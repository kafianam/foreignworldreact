import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../reducer/cartContext";

import { CartItem } from "./CartItem";
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import axiosInstance from "../../helper/axios";

export const Cart = () => {
  let { openCart, cartClose, cartItems, totalAmount, openModal, handleCart } =
    useGlobalContext();
  const history = useHistory();
  const [usedCoupon, setUsedCoupon] = useState({ amount: 0 });
  const [coupon, setCoupon] = useState("");
  const couponInput = useRef("");

  const addCoupon = (e) => {
    e.preventDefault();
    if (coupon !== "") {
      axiosInstance
        .post(
          `/coupon/check/${coupon}`,
          {
            total_price: totalAmount,
            cart: cartItems.map((item) => {
              return {
                product_id: item.id,
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
          if (!isNaN(data)) {
            const couponObj = { code: coupon, amount: data };
            reactLocalStorage.setObject("coupon", couponObj);
            setUsedCoupon(couponObj);
            showCoupon();
          }
        })
        .catch((error) => {
          if (error?.response?.data?.data) alert(error?.response?.data?.data);
        });
    }
  };
  const removeCoupon = (e) => {
    e.preventDefault();
    reactLocalStorage.remove("coupon");
    setUsedCoupon({ amount: 0 });
    couponInput.current.value = "";
  };
  const showCoupon = () => {
    window.document.getElementById("couponshow")?.classList.toggle("hide");
  };

  useEffect(() => {
    if (reactLocalStorage.getObject("coupon")?.amount) {
      setUsedCoupon(reactLocalStorage.getObject("coupon"));
      showCoupon();
    }
    console.log("cart load");
  }, [totalAmount]);

  return (
    <CartWrapper show={openCart}>
      <div className="shoppingCartWrapper">
        <div
          class="shoppingCartWrapper_container_btn"
          onClick={cartClose}
        ></div>
        <div className="shoppingCart">
          <div className="shoppingCart__header d-flex align-items-center">
            <span className="shoppingCart__header_icon mr-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="c-box"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M352 160v-32C352 57.42 294.579 0 224 0 153.42 0 96 57.42 96 128v32H0v272c0 44.183 35.817 80 80 80h288c44.183 0 80-35.817 80-80V160h-96zm-192-32c0-35.29 28.71-64 64-64s64 28.71 64 64v32H160v-32zm160 120c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zm-192 0c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24z"></path>
              </svg>
            </span>

            <div className="shoppingCart__header_itemCount">
              {cartItems?.length} &nbsp;items
            </div>

            <span className="closeCartButtonTop" onClick={cartClose}>
              Close
            </span>
          </div>
          <div className="shoppingCart__body">
            <div className="shoppingCart__body__products">
              {cartItems?.length === 0 && (
                <div className="emp-cart p-3">
                  <i className="fas fa-shopping-basket"></i>
                  <span>Your cart is empty</span>
                </div>
              )}

              {cartItems?.length !== 0 &&
                cartItems?.map((item) => (
                  <CartItem
                    {...item}
                    // price={item.unit_price * item.quantity}
                    key={item.id}
                  />
                ))}
            </div>
          </div>

          {cartItems?.length !== 0 ? (
            <div className="shoppingCart__footer">
              <div class="discountCodeHeader">
                <div class="btnDiscount" onClick={showCoupon}>
                  Have a special code? <span class="down-arrow"></span>
                </div>
                <div class="discountCodeContent hide" id="couponshow">
                  <span class="inputNbtn">
                    <form onSubmit={addCoupon}>
                      <input
                        onChange={(e) => setCoupon(e.target.value)}
                        type="text"
                        name="coupon"
                        ref={couponInput}
                        defaultValue={usedCoupon.code}
                        placeholder="Special Code"
                      />
                      {usedCoupon.code ? (
                        <button
                          type="button"
                          class="discountSubmitBtn"
                          onClick={(e) => removeCoupon(e)}
                        >
                          <i className="far fa-trash-alt mr-1"></i>
                        </button>
                      ) : (
                        <button class="discountSubmitBtn" type="submit">
                          Go
                        </button>
                      )}
                    </form>
                  </span>
                </div>
              </div>

              <div className="shoppingtCartActionButtons ">
                <button
                  className="placeOrderButton"
                  onClick={(e) =>
                    reactLocalStorage.getObject("token").user &&
                    reactLocalStorage.getObject("token").token
                      ? history.push("/checkoutpage")
                      : openModal()
                  }
                >
                  <span className="placeOrderText">Click to Order</span>
                  <span className="totalMoneyCount">
                    ৳{totalAmount - usedCoupon?.amount}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </CartWrapper>
  );
};

const CartWrapper = styled.div`
  background-color: #fff;
  -webkit-box-shadow: -2px 0 5px 0 rgba(143,143,143,0.38);
  box-shadow: -2px 0 5px 0 rgba(143,143,143,0.38);
  position: fixed;
  top: 54px;
  right: 0;
  width: 320px;
  height: calc(100vh - 54px);
  z-index: 91;
  transform: ${(props) =>
    props.show ? "translateX(0)" : "translateX(calc(100% + 20px))"};
  transition: all 300ms;

  @media only screen and (max-width: 767px) {
    height: calc(100vh - 100px);
    top: 84px;
    // width: 300px;
    width: 100%;
  }

  .cart-top {
    margin-top: 20px;
    margin-left: 30px;
    border-bottom: 2px solid grey;
  }

  itemCount {
    color: #4f4f4f;
    font-weight: 700;
    text-align: left;
    width: 120px;
    text-transform: uppercase;
  }

  /* .c-box {
    color: #308c3f;
    margin-bottom: 8px;
    margin-right: 10px;
  } */
  .close {
    border: 1px solid #62615f;
    color: #4f4f4f;
    display: block;
    font-size: 12px;
    margin-left: auto;
    padding: 0 10px;
    margin-right: 20px;
  }
  .shoppingtCartActionButtons {
    
      padding: 10px;
      text-align: center;

      .placeOrderButton {
        background:#00a07e;
        border: none;
        box-shadow: 0 0 3px #b1aeae;
        border-radius: 2px;
        color: #fff;
        display: flex;
        font-size: 16px;
        flex-wrap: wrap;
        height:40px;
        line-height: 37px;
        padding: 0;
        width: 100%;

        > span {
          display: block;
          width: 100%;
          flex: 0 0 80%;
          max-width: 70%;
        }

        .totalMoneyCount {
          background: #016a54;
          line-height: 40px;
          flex: 0 0 30%;
          max-width: 30%;
          border-radius: 0 2px 2px 0;
        }
  /* .cart-checkout {
    display: flex;
    flex-direction: row;
    background-color: #308c3f;
    width: 80%;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    margin-left: 50px;
    margin-top: 20px;
    cursor: pointer;
  }
  .c-text {
    color: #ffff;
    font-size: 20px;
    text-align: center;
    margin-left: 25px;
    text-transform: capitalize;
  }
  .c-total {
    background: #ffff;
    color: black;
    width: 70px;
    margin-right: 7px;
    font-size: 15px;

    border-radius: 10px;
    height: 40px;
    text-align: center;
    padding-top: 12px;
    padding-left: 5px;
  } */
  .emp-cart {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    span {
      font-size: 30px;
      text-transform: capitalize;
    }
  }
  .emp-bag {
    font-size: 200px;
    @media (max-width: 576px) {
      font-size: 40px;
    }
    @media (max-width: 768px) {
      font-size: 100px;
    }
  }
`;
