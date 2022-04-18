import React, { useState } from "react";
import { useGlobalContext } from "../reducer/cartContext";
import { useHistory } from "react-router-dom";
import axiosInstance from "../helper/axios";
import { useForm } from "react-hook-form";
import { reactLocalStorage } from "reactjs-localstorage";
import SocialButton from './../Component/SocialLogin/SocialButton.js'
import 'font-awesome/css/font-awesome.min.css';

export const LoginForm = ({ setLoggedInUser }) => {
  const { isModalOpen, closeModal } = useGlobalContext();
  const [id, setId] = useState(null);
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [phone, setPhone] = useState();

  let history = useHistory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmitPhone = (data) => {
    if (data.phone_number[0] !== "+") {
      data.phone_number = `+88${data.phone_number}`;
    }
    setViewOtpForm(true);
    axiosInstance
      .post("/auth/login-using-otp", data)
      .then(({ data: { data } }) => {
        setId(data.user_id);
        //alert("OTP send successfully !");
      })
      .catch((error) => {
        setViewOtpForm(false);
        console.log(error);
      });
    reset();
    setPhone(data);
  };
  const onSubmitOtp = (data) => {
    axiosInstance
      .post("/auth/otp-verify", {
        user_id: id,
        code: data.code,
      })
      .then(({ data: { data } }) => {
        reactLocalStorage.setObject("token", {
          token: data.token,
          user: data.user,
        });
        setViewOtpForm(false);
        setLoggedInUser(reactLocalStorage.getObject("token"));
        if (
          reactLocalStorage.get("cart") &&
          reactLocalStorage.get("cart").length > 0
        ) {
          history.push("/checkoutpage");
        } else {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const resandOtp = () => {
    axiosInstance
      .post("/auth/resend-otp", { phone_number: phone.phone_number })
      .then((res) => {
        alert("OTP resend successfully !");
      })
      .catch((error) => {});
  };

  const handleSocialLogin = (user) => {
    axiosInstance
      .post("/auth/social-login", {
        social_media_login_type: user._provider,
        social_media_login_id: user._profile.id,
        social_media_login_data: {
          name: user._profile.name,
          email: user._profile.email
        },
      })
      .then(({ data: { data } }) => {
        console.log(data)
        reactLocalStorage.setObject("token", {
          token: data.token,
          user: data.user,
        });
        setViewOtpForm(false);
        setLoggedInUser(reactLocalStorage.getObject("token"));
        if (
          reactLocalStorage.get("cart") &&
          reactLocalStorage.get("cart").length > 0
        ) {
          history.push("/checkoutpage");
        } else {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleSocialLoginFailure = (err) => {
    console.error(err)
  }  

  return (
    <>
      <div
        className={`${
          isModalOpen ? "modal-overlay show-modal" : "modal-overlay"
        }`}
      >
        <div className="modal-container login-modal px-4 px-md-5 py-3 d-flex align-items-center">
          <div className="w-100">
            {!viewOtpForm ? (
              <form className="w-100" onSubmit={handleSubmit(onSubmitPhone)}>
                <h3 className="modal--title">Hello!</h3>
                <h4 className="modal--subTitle">Glad you're here.</h4>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter your valid phone number"
                    name="phone_number"
                    autoComplete="false"
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    className={`form-control ${
                      errors.phone_number && "invalid"
                    }`}
                    {...register("phone_number", {
                      required: "Phone is Required",
                      pattern: {
                        value: /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/,
                        message: "Invalid phone no",
                      },
                    })}
                  />
                  {errors.phone_number && (
                    <small className="text-danger">
                      {errors.phone_number.message}
                    </small>
                  )}
                </div>

                <button type="submit" id="sub" className="btn w-100">
                  Login With OTP
                </button>
              </form>
            ) : (
              <div>
                <form onSubmit={handleSubmit(onSubmitOtp)}>
                  <h3 className="modal--title">Hello!</h3>
                  <h4 className="modal--subTitle">
                    Live with purpose, every day
                  </h4>

                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter your OTP"
                      name="code"
                      autoComplete="false"
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      className={`form-control text-center ${
                        errors.code && "invalid"
                      }`}
                      {...register("code", {
                        required: "code is Required",
                        pattern: {
                          message: "enter 4 digit code",
                        },
                      })}
                    />
                    {errors.code && (
                      <small className="text-danger">
                        {errors.code.message}
                      </small>
                    )}
                  </div>

                  <button
                    id="sub"
                    type="submit"
                    className="btn w-100"
                    onClick={closeModal}
                  >
                    Verify
                  </button>
                </form>
                <button id="sub" className="btn mt-2 w-100" onClick={resandOtp}>
                  Resend OTP
                </button>
              </div>
            )}

            <button className="close-modal-btn" onClick={closeModal}>
              {/* <FaTimes /> */}
              &times;
            </button>
          
          {/* Social Media Login */}
          <div className="mt-3">
            <SocialButton
                style={{backgroundColor: '#fe6313', border: 'none'}}
                provider="facebook"
                appId="375840177536393"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}
              >
                <button type="button" id="sub" className="btn w-100" style={{fontSize: '16px'}}>
                  <i className="fa fa-facebook-square mr-2" style={{color: '#3b5998'}}></i>
                  Login with facebook
                </button>
            </SocialButton>
            <SocialButton
                style={{backgroundColor: '#fe6313', border: 'none', marginTop: '8px'}}
                provider="google"
                appId="449648193182-c53foier6inrvvaqoicitipld4ca2q4p.apps.googleusercontent.com"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}
              >
                <button type="button" id="sub" className="btn w-100" style={{fontSize: '16px'}}>
                  <i className="fa fa-google mr-2" style={{color: '#db4a39'}}></i>
                  Login with google
                </button>
            </SocialButton>
          </div>
          
          </div>
        </div>
      </div>
    </>
  );
};