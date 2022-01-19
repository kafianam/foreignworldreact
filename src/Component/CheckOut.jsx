import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useGlobalContext } from "../reducer/cartContext";
import axiosInstance from "../helper/axios";
import loadingImg from "../asset/images/loading.gif";

import paymentIcon from "../asset/images/payment_icons_portwallet.png";

import Select from "react-select";

import { reactLocalStorage } from "reactjs-localstorage";

export const CheckOut = () => {
  const [editItem, setEditItem] = useState({});
  const [formData, setFormData] = useState();
  const [selectedAddress, setSelectedAddress] = useState({});
  const [gettoken, setGetToken] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [citys, setCitys] = useState([]);
  const [city, setCity] = useState("");

  const [usedCoupon, setUsedCoupon] = useState({ amount: 0 });

  let history = useHistory();
  const {
    cartItems,
    cartClose,
    totalAmount,
    openModal,
    isModalOpen,
    closeModal,

    handleCart,
  } = useGlobalContext();

  const [shippingInfo, setShippingInfo] = useState({
    shipping_cost: 0,
    shipping_message: "",
  });

  const getShippingInfo = (selectedAdd) => {
    const hasShippingMessage = cartItems.find(
      (i) => i.shipping_message != null && i.shipping_message.length > 0
    );
    if (
      hasShippingMessage == undefined ||
      !hasShippingMessage.shipping_message ||
      hasShippingMessage.shipping_message.length == 0
    ) {
      if (selectedAddress.city || selectedAdd.city) {
        const shipping_costs = cartItems.map((i) => {
          if (JSON.parse(i.shipping_cost)[selectedAdd.city] !== undefined) {
            return JSON.parse(i.shipping_cost)[selectedAdd.city];
          } else {
            return 0;
          }
        });
        const shipping_cost = Math.max(...shipping_costs);
        if (isNaN(shipping_cost))
          setShippingInfo({
            shipping_cost: 0,
            shipping_message: "No shipping cost available for this address !",
          });
        else
          setShippingInfo({ shipping_cost, shipping_message: shipping_cost });
      } else {
        alert("Please select an address or create new one !");
      }
    } else {
      setShippingInfo({
        shipping_cost: 0,
        shipping_message: hasShippingMessage.shipping_message,
      });
    }
  };

  const {
    register,
    handleSubmit,

    reset,
  } = useForm();

  const grandTotal =
    totalAmount + shippingInfo.shipping_cost - usedCoupon.amount;

  //*get Address*
  const getAddress = () => {
    axiosInstance
      .get(
        `/addresses/billing_address/${
          reactLocalStorage.getObject("token").user.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${
              reactLocalStorage.getObject("token").token
            }`,
          },
        }
      )
      .then(
        ({
          data: {
            data: { data },
          },
        }) => {
          if (data[0]?.id) {
            setSelectedAddress(data[0]);
            getShippingInfo(data[0]);
          }
          setFormData(data);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const getCity = () => {
    axiosInstance
      .get("/cities")
      .then(({ data: { data } }) => {
        const newCity = data.map((i) => ({ ...i, label: i.name, value: i.id }));
        setCitys(newCity);
      })
      .catch((error) => {});
  };
  const handleChange = (e) => {
    setCity(e.name);
  };
  // Store Authenticated user's shipping + billing address.
  const onSubmit = (data) => {
    if (city !== "") {
      data.city = city;
      axiosInstance
        .post(
          "/address/store",
          {
            user_id: `${gettoken.user.id}`,
            address_type: "billing_address ",
            address: data.address,
            country: data.country,
            city: data.city,
            postal_code: data.postal_code,
            phone: `${gettoken.user.phone}`,
          },
          {
            headers: {
              Authorization: `Bearer ${gettoken.token}`,
            },
          }
        )
        .then(({ data: { data } }) => {
          //history.push("./checkoutpage");
          closeModal();
          getAddress();
        })
        .catch((error) => {
          console.log(error);
        });

      reset();
    } else {
      alert("please select a city ");
    }
  };

  //*update Address*
  const updateAddress = (e) => {
    e.preventDefault();
    axiosInstance
      .post(
        "/address/update",
        {
          id: editItem.id,
          address_type: "billing_address",
          address: editItem.address,
          country: editItem.country,
          city: editItem.city,
          postal_code: editItem.postal_code,
          phone: editItem.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${
              reactLocalStorage.getObject("token").token
            }`,
          },
        }
      )
      .then((data) => {
        getAddress();
        setEditItem({});
        setEditMode(false);
        closeModal();
      });
  };

  //*delete*
  const deleteAddress = (i) => {
    axiosInstance
      .delete(`/address/delete/${i.id}`, {
        headers: {
          Authorization: `Bearer ${reactLocalStorage.getObject("token").token}`,
        },
      })
      .then((data) => {
        getAddress();
      })
      .catch(() => {});
  };

  //*Order place*
  const placeOrder = () => {
    if (
      !selectedAddress.address ||
      !selectedAddress.city ||
      !selectedAddress.country ||
      !selectedAddress.postal_code
    ) {
      alert("Please add a address first !");
    } else {
      axiosInstance
        .post(
          "/place-order",
          {
            payment_type: "cash_on_delivery",
            // payment_type: delivery,
            grand_total: totalAmount + shippingInfo.shipping_cost,
            coupon_discount: usedCoupon.amount,
            shipping_cost: shippingInfo.shipping_cost,
            shipping_message: shippingInfo.shipping_message,
            address: selectedAddress.address,
            city: selectedAddress.city,
            postal_code: selectedAddress.postal_code,
            country: selectedAddress.country,
            cart: cartItems.map((item) => {
              return {
                seller_id: 10,
                product_id: item.id,
                price: item.unit_price * item.quantity,
                quantity: item.quantity,
              };
            }),
          },
          {
            headers: {
              Authorization: `Bearer ${
                reactLocalStorage.getObject("token").token
              }`,
            },
          }
        )
        .then(({ data: { data } }) => {
          // setOrderPlace(data);
          console.log("order", data);

          reactLocalStorage.setObject("order", data);
          history.push("/order-done?" + data.id);
        });
    }
  };

  useEffect(() => {
    console.log("Checkout component loaded !");
    if (reactLocalStorage.getObject("coupon")?.amount) {
      setUsedCoupon(reactLocalStorage.getObject("coupon"));
    }
    if (
      reactLocalStorage.get("cart") &&
      reactLocalStorage.get("cart").length > 0
    ) {
      if (!reactLocalStorage.get("reloadForSSLCommerz")) {
        reactLocalStorage.set("reloadForSSLCommerz", true);
        //window.location.reload();
      }
      cartClose();
      const temToken = reactLocalStorage.getObject("token");
      setGetToken(temToken);
      getAddress();
      getCity();
      window.scrollTo({ top: 0 });
    } else {
      history.push("/");
    }

    return () => {
      if (reactLocalStorage.get("reloadForSSLCommerz")) {
        reactLocalStorage.remove("reloadForSSLCommerz");
      }
    };
  }, [cartItems]);

  const sslData = {
    user_id: reactLocalStorage.getObject("token")?.user?.id,
    token: reactLocalStorage.getObject("token")?.token,
    payment_type: "sslcommerze",
    grand_total: grandTotal,
    coupon_discount: 10,
    shipping_cost: shippingInfo.shipping_cost,
    shipping_message: shippingInfo.shipping_message,
    address: selectedAddress.address,
    city: selectedAddress.city,
    postal_code: selectedAddress.postal_code,
    country: selectedAddress.country,
    cart: cartItems.map((item) => {
      return {
        seller_id: 10,
        product_id: item.id,
        price: item.unit_price * item.quantity,
        quantity: item.quantity,
      };
    }),
  };
  return (
    <>
      {/* <div className="container">
        <form method="POST" className="needs-validation" noValidate>
          <button
            className="btn btn-primary btn-lg btn-block"
            id="sslczPayBtn"
            token="if you have any token validation"
            postdata="your javascript arrays or objects which requires in backend"
            order={JSON.stringify(sslData)}
            endpoint={`https://admina.khetkhamar.org/api/react/pay-via-ajax`}
          >
            Pay Now
          </button>
        </form>
      </div> */}
      <div className="mobile-shopping-wrap d-block d-md-none position-fixed">
        <div className="d-flex flex-wrap h-100">
          <button className="start_shopping_btn" onClick={placeOrder}>
            Place order
          </button>
          <div
            className="mobile-shopping-wrap__cart d-flex flex-wrap align-items-center justify-content-center"
            onClick={handleCart}
          >
            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            <span className="mobile-shopping-wrap__cart_item d-flex align-items-center justify-content-center">
              {cartItems.length}
            </span>
          </div>
        </div>
      </div>

      <div className="checkout--content">
        <div className="title-overlay d-block d-md-none"></div>

        <h1 className="page-title text-center text-md-left m-0">
          Checkout Order
        </h1>
        <p className="checkoutSubTitle text-center text-md-left">
          Everybody has equal opportunity
        </p>

        <div className="card checkout--content__address">
          <div className="card-header">
            <i className="fas fa-map-marker-alt mr-1" aria-hidden="true"></i>{" "}
            Select shipping address
          </div>

          {formData
            ? formData.map((i, index) => {
                return (
                  <div class="card-body d-flex align-items-center justify-content-between">
                    <div className="custom-control custom-radio shipping-address  pl-5">
                      <input
                        defaultChecked={index === 0 ? true : false}
                        type="radio"
                        name="shippingAddress"
                        id={`shippingAddress${index}`}
                        className="custom-control-input active"
                        onChange={() => {
                          setSelectedAddress(i);
                          getShippingInfo(i);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        for={`shippingAddress${index}`}
                        key={i.id}
                      >
                        {i ? i.address : ""}
                        <br />
                        {i ? i.city : ""}-{i ? i.postal_code : ""},{" "}
                        {i ? i.country : ""}
                      </label>
                    </div>

                    <div className="edit--section pl-md-2">
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setEditItem(i);
                          openModal();
                        }}
                      >
                        <i className="far fa-edit mr-1" aria-hidden="true"></i>{" "}
                        Edit
                      </button>
                      <button
                        className="ml-md-2"
                        onClick={() => deleteAddress(i)}
                      >
                        <i class="far fa-trash-alt mr-1"></i> Delete
                      </button>
                    </div>
                  </div>
                );
              })
            : ""}

          {!formData && (
            <>
              <div className="loading-btn text-center mt-1 mb-1">
                <img src={loadingImg} alt="" className="img-fluid" />
              </div>
            </>
          )}

          <div class="card-footer p-0">
            <button
              className="add-new p-2 d-block w-100"
              onClick={() => {
                openModal();
                setEditMode(false);
              }}
            >
              + Add New Address
            </button>
          </div>
        </div>

        <div className="oderSummary mt-4">
          <div className="row d-flex justify-content-center">
            <div className="col-12 col-md-6">
              <h3 className="d-flex justify-content-center align-items-center mb-4">
                Order Summary
              </h3>

              <div className="oderSummary__cont">
                <div className="row mb-2">
                  <div className="col-6">Subtotal</div>
                  <div className="col-6 text-right">
                    <span>৳</span>
                    {totalAmount}
                    {}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Delivery Charge</div>
                  <div className="col-6 text-right">
                    <span>৳</span> {shippingInfo.shipping_cost}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Discount</div>
                  <div className="col-6 text-right">
                    - <span>৳ {usedCoupon.amount}</span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Order Total</div>
                  <div className="col-6 text-right">
                    <span>৳</span>{" "}
                    {reactLocalStorage.getObject("coupon")?.discount
                      ? grandTotal -
                        reactLocalStorage.getObject("coupon")?.discount
                      : grandTotal}
                  </div>
                </div>

                {/* <div className="row mb-2">
                  <div className="col-6 cl-red">Amount Paid</div>
                  <div className="col-6 text-right">
                    <span>৳</span> 0
                  </div>
                </div> */}
                <div className="oderSummary__cont_line"></div>
                <div className="row mb-2">
                  <div className="col-6">Due</div>
                  <div className="col-6 text-right">
                    <strong>
                      <span>৳</span>{" "}
                      {reactLocalStorage.getObject("coupon")?.discount
                        ? grandTotal -
                          reactLocalStorage.getObject("coupon")?.discount
                        : grandTotal}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-header">
            <i className="far fa-credit-card mr-1" aria-hidden="true"></i>{" "}
            Payment Method{" "}
            <small>(Please select only one! payment method)</small>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="payment--methods p-4 h-100 d-flex align-items-center">
                  <div className="custom-control custom-radio">
                    <input
                      checked
                      defaultChecked
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      className="custom-control-input"
                      defaultValue="Cash_On_delivery"
                    />
                    <label
                      className="custom-control-label"
                      for="cashOnDelivery"
                    >
                      Cash On delivery
                    </label>
                  </div>
                </div>
              </div>

              {/* <div className="col-12 col-md-6 mt-3 mt-md-0">
                <div className="payment--methods p-4 h-100 d-flex align-items-center">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id="payOnCard"
                      name="paymentMethod"
                      className="custom-control-input"
                    />
                    <label class="custom-control-label" htmlFor="payOnCard">
                      <form
                        method="POST"
                        className="needs-validation"
                        noValidate
                      >
                        <img
                          src={paymentIcon}
                          alt="payment"
                          id="sslczPayBtn"
                          token="if you have any token validation"
                          postdata="your javascript arrays or objects which requires in backend"
                          order={JSON.stringify(sslData)}
                          endpoint={`https://qa.ezelo.com.bd/api/react/pay-via-ajax`}
                        />
                      </form>
                    </label>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <div className="container">
          <form method="POST" className="needs-validation" noValidate>
            <div className="orderPaymentMethods">
              <h4>
                Do you want to <strong>Pay Now</strong>?
              </h4>

              <div className="paymentMethods d-md-flex align-items-md-center justify-content-md-center">
                <div>
                  <img
                    src={paymentIcon}
                    alt="payment"
                    id="sslczPayBtn"
                    token="if you have any token validation"
                    postdata="your javascript arrays or objects which requires in backend"
                    order={JSON.stringify(sslData)}
                    endpoint={`https://qa.ezelo.com.bd/api/react/pay-via-ajax`}
                  />
                </div>
              </div>
            </div>
          </form>
        </div> */}
        <div className="placeOrderFooter">
          <div className="paymentMethodInstruction d-md-flex text-center text-md-left py-3">
            <div>Delivery charge included</div>
            {/* <div>Payment options available on the next page</div> */}
            {/* <div className="mt-1 mt-md-0 ml-md-auto">
              <small>৳</small> Delivery charge included
            </div> */}
          </div>

          <div className="placeOrderBtns d-none d-md-block d-md-none mt-3">
            <button onClick={placeOrder} className="btn" type="submit">
              <span className="placeOrderText">Place Order</span>
              <span className="totalMoneyCount">
                <span className="mr-1"></span>{" "}
                {reactLocalStorage.getObject("coupon")?.discount
                  ? grandTotal - reactLocalStorage.getObject("coupon")?.discount
                  : grandTotal}
              </span>
            </button>
            <small className="termConditionText">
              By clicking/tapping Place Order, I agree to Khetkhamar's{" "}
              <a href="#" target="_blank">
                Terms of Services
              </a>
            </small>
            {/* <button id="placeBtn" className="btn">
              <span>৳</span> {temTotal}
            </button> */}
          </div>
        </div>
      </div>

      <main
        className={`${
          isModalOpen ? "modal-overlay show-modal" : "modal-overlay"
        }`}
      >
        <div className="container">
          <div className="row justify-content-md-center address-modal-body">
            {editMode === false && (
              <div className="col-lg-12 col-md-12 col-sm-12">
                <h3 className="text-center">Billing & Shipping address</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="address"
                      placeholder="Address"
                      {...register("address", { required: true })}
                    />
                  </div>

                  <div className="form-group">
                    <Select
                      onChange={(e) => handleChange(e)}
                      options={citys}
                      defaultValue={city}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      className="form-control"
                      name="postal_code"
                      placeholder="Postal Code"
                      {...register("postal_code", { required: true })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="country"
                      placeholder="Country"
                      {...register("country", { required: true })}
                    />
                  </div>

                  <button
                    id="subbtn2"
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Address
                  </button>
                </form>
                <button className="close-modal-btn" onClick={closeModal}>
                  &times;
                  {/* <FaTimes /> */}
                </button>
              </div>
            )}

            {editMode && (
              <div className="col-lg-12 col-md-12 col-sm-12">
                <h3 className="text-center">Update Address</h3>
                <form onSubmit={updateAddress}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="address"
                      placeholder="Address"
                      defaultValue={editItem.address}
                      onChange={(e) =>
                        setEditItem({ ...editItem, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <Select
                      options={citys}
                      name="city"
                      value={{ value: "true", label: editItem.city }}
                      onChange={(e) =>
                        setEditItem({ ...editItem, city: e.name })
                      }
                    ></Select>
                  </div>

                  <div className="form-group">
                    <input
                      className="form-control"
                      name="postal_code"
                      placeholder="Postal Code"
                      defaultValue={editItem.postal_code}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          postal_code: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="country"
                      placeholder="Country"
                      defaultValue={editItem.country}
                      onChange={(e) =>
                        setEditItem({ ...editItem, country: e.target.value })
                      }
                    />
                  </div>

                  <button
                    id="subbtn2"
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Address
                  </button>
                </form>
                <button className="close-modal-btn" onClick={closeModal}>
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
