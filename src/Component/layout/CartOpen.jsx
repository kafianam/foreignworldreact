import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../reducer/cartContext";
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

const toggleSidebar = () => {
  document.getElementById("sidebarWrapper").classList.toggle("sidebarOpen");
};

export const CartOpen = () => {
  let history = useHistory();
  const { handleCart, cartItems, totalAmount, openModal } = useGlobalContext();
  const [usedCoupon, setUsedCoupon] = useState({ amount: 0 });

  useEffect(() => {
    if (reactLocalStorage.getObject("coupon")?.amount) {
      setUsedCoupon(reactLocalStorage.getObject("coupon"));
    }
    console.log("CartOpen component loaded !");
  }, [totalAmount, handleCart]);

  return (
    <>
      <div className="cart--summary" onClick={handleCart}>
        <div className="item--count">
          <div>
            <div className="item--count__icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <p className="item--count__count">
              <span>{cartItems?.length} Items</span>
            </p>
          </div>

          <div className="item--count__total">
            <span className="mr-1">৳</span>
            {totalAmount - usedCoupon?.amount}
          </div>
        </div>
      </div>

      <div className="mobile-shopping-wrap d-block d-md-none position-fixed">
        <div className="d-flex flex-wrap h-100">
          {cartItems?.length ? (
            <button
              className="start_shopping_btn"
              onClick={() =>
                reactLocalStorage.getObject("token").user &&
                reactLocalStorage.getObject("token").token
                  ? history.push("./checkoutpage")
                  : openModal()
              }
            >
              Click to Order
            </button>
          ) : (
            <button className="start_shopping_btn" onClick={toggleSidebar}>
              Start Shopping
            </button>
          )}

          <div
            className="mobile-shopping-wrap__cart d-flex flex-wrap align-items-center justify-content-center"
            onClick={handleCart}
          >
            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            <span className="mobile-shopping-wrap__cart_item d-flex align-items-center justify-content-center">
              {cartItems?.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
