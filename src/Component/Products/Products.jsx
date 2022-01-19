/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useGlobalContext } from "../../reducer/cartContext";
import { ProductDetails } from "../ProductDetails";
import axiosInstance from "../../helper/axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const Product = (props) => {
  const {
    name,
    unit_price,
    unit,
    id,
    upload,
    max_qty,
    shipping_cost,
    shipping_message,
    description,
    user,
    discount_type,
    discount,
    min_qty,
    quantity,
    is_quantity_multiplied,
    stock_visibility_state,
    current_stock,
  } = props;
  console.log("pro", props.quantity);
  const hasDiscount = (discount_type, unit_price, discount) => {
    if (discount_type === "amount") {
      return (
        <span className="product_price_discount">
          ৳ {unit_price - discount}
        </span>
      );
    } else if (discount_type === "percent") {
      return (
        <span className="product_price_discount">
          ৳ {unit_price * (discount / 100)}
        </span>
      );
    }
  };
  const product = {
    description,
    name,
    unit_price,
    unit,
    id,
    upload,
    shipping_message,
    shipping_cost,
    min_qty: min_qty ?? 1,
    max_qty: max_qty ?? 999,
    user,
    discount_type,
    discount,
    quantity,
    is_quantity_multiplied,
    stock_visibility_state,
    current_stock,
  };

  const { addToCart, cartItems, decrementItem, incrementItem, openModal } =
    useGlobalContext();
  const [detailsMode, setDetailsMode] = useState(false);
  const [productD, setProductD] = useState({});
  const notify = () =>
    toast("Wishlist added successfully !", {
      position: "top-center",
      autoClose: 2000,
    });

  const isInCart = (id) => {
    return !!cartItems.find((item) => item.id === id);
  };

  const getQuantity = (id) => {
    const product = cartItems.find((item) => item.id === id);
    return product && product.quantity ? product.quantity : 0;
  };

  const StoreWishList = () => {
    if (reactLocalStorage.getObject("token").token) {
      axiosInstance
        .post(
          "/wishlist/store",
          { product_id: id },
          {
            headers: {
              Authorization: `Bearer ${
                reactLocalStorage.getObject("token").token
              }`,
            },
          }
        )
        .then((res) => {
          notify();
        })
        .catch((error) => {});
    } else {
      openModal();
    }
  };

  return (
    <>
      <div className="col-6 col-md-3 product--items mb-3">
        <div className="product">
          <div className="product__card">
            <div className="product_img d-flex align-items-center justify-content-center">
              <img
                src={`${process.env.REACT_APP_SERVER_IMAGE_URL}/${
                  upload ? upload.file_name : ""
                }`}
                className="img-fluid"
                alt="img"
              />
            </div>

            <div className="product_name">{name}</div>

            <div className="product_price d-flex align-items-center justify-content-center">
              {discount_type ? (
                hasDiscount(discount_type, unit_price, discount)
              ) : (
                <span className="product_price_discount">৳ {unit_price}</span>
              )}
              {discount_type && discount !== 0 && (
                <span className="product_price_price">৳{unit_price} </span>
              )}
            </div>

            <div className="product_overlay d-flex align-items-center justify-content-center">
              <p
                className="product_overlay_text"
                onClick={() =>
                  isInCart(id)
                    ? incrementItem(id)
                    : addToCart({
                        ...product,
                        unit_price: unit_price - discount,
                      })
                }
              >
                Add to Shopping Bag
              </p>

              <a
                className="product_overlay_details"
                onClick={() => {
                  setDetailsMode(true);
                  setProductD(product);
                }}
              >
                Details &raquo;
              </a>
            </div>
          </div>

          <div className="product__btns">
            {isInCart(id) && (
              <div className="product__btns_add px-3">
                <div className="d-flex align-items-center">
                  <button
                    className="btn-minus"
                    onClick={() => decrementItem(id)}
                  >
                    –
                  </button>
                  <div className="product__btns_add_number">
                    {getQuantity(id)}
                  </div>
                  <button
                    className="btn-plus"
                    onClick={() => incrementItem(id)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            {!isInCart(id) && (
              <div className="product__btns_cart px-3">
                <button
                  disabled={current_stock === 0}
                  className="btn w-100"
                  onClick={() =>
                    addToCart({
                      ...product,
                      unit_price: unit_price - discount,
                    })
                  }
                >
                  <span className="product__btns_cart_text">
                    <i className="fas fa-shopping-basket mr-1"></i>
                    {current_stock === 0 ? "out of stock" : "Add to Bag"}
                  </span>
                </button>
              </div>
            )}
          </div>
          <div
            className="orderedProducts_remove ml-auto"
            onClick={StoreWishList}
          >
            <div className="product__btns_cart px-3">
              <button className="btn w-100">
                <span className="product__btns_cart_text">
                  <i class="fa fa-heart-o "></i>
                </span>
              </button>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
      {detailsMode && (
        <ProductDetails
          setDetailsMode={setDetailsMode}
          productD={productD}
          getQuantity={getQuantity}
          isInCart={isInCart}
          hasDiscount={hasDiscount}
        />
      )}
    </>
  );
};
