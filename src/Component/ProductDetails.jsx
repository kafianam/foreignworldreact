import React from "react";
import { useGlobalContext } from "../reducer/cartContext";

export const ProductDetails = ({
  setDetailsMode,
  productD,
  getQuantity,
  isInCart,
  hasDiscount,
}) => {
  const {
    id,
    name,
    unit_price,
    upload,
    description,
    user,
    discount_type,
    discount,
    unit,
    current_stock,
  } = productD;

  const { decrementItem, incrementItem, addToCart } = useGlobalContext();

  return (
    <div className="modal-overlay show-modal">
      <div className="product--details">
        <button
          className="close-modal-btn"
          onClick={() => setDetailsMode(false)}
        >
          &times;
        </button>
        <div className="row py-2 py-md-4">
          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center m-auto product--details__img">
            <img
              src={`${process.env.REACT_APP_SERVER_IMAGE_URL}//${
                upload ? upload.file_name : ""
              }`}
              alt=""
              className="img-fluid"
            />
          </div>

          <div className="col-12 col-md-7 product--details__desc">
            <div className="px-3 pl-md-0">
              <h2>{name}</h2>
              <span className="product--details__desc_quantity">{unit}</span>
              <span className="product--details__desc_quantity">
                {discount_type ? (
                  hasDiscount(discount_type, unit_price, discount)
                ) : (
                  <span className="product_price_discount">৳ {unit_price}</span>
                )}

                {discount_type && discount !== 0 && (
                  <span className="product_price_price">৳{unit_price} </span>
                )}
              </span>
              {!isInCart(id) && (
                <div className="product__btns_cart px-3">
                  <button
                    disabled={current_stock === 0}
                    className="btn w-100"
                    onClick={() =>
                      addToCart({
                        ...productD,
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

              {isInCart(id) && (
                <div class="product__btns_add">
                  <div class="d-flex align-items-center">
                    <button class="btn-minus" onClick={() => decrementItem(id)}>
                      –
                    </button>
                    <div class="product__btns_add_number">
                      {getQuantity(id)}
                    </div>
                    <button class="btn-plus" onClick={() => incrementItem(id)}>
                      +
                    </button>
                  </div>
                </div>
              )}
              {/* <div className="product--details__desc_text mt-2 mt-md-4">
                {user && user.name ? "Seller: " + user.name : ""}
              </div> */}
              <div
                className="product--details__desc_text mt-2 mt-md-4"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
