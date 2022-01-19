import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { useGlobalContext } from "../reducer/cartContext";
import { ProductDetails } from "./ProductDetails";

export const WishList = () => {
  const [wish, setWish] = useState();
  const { addToCart, cartItems, decrementItem, incrementItem } =
    useGlobalContext();
  const [detailsMode, setDetailsMode] = useState(false);
  const [productD, setProductD] = useState({});

  const isInCart = (id) => {
    return !!cartItems.find((item) => item.id === id);
  };

  const getQuantity = (id) => {
    const product = cartItems.find((item) => item.id === id);
    return product && product.quantity ? product.quantity : 0;
  };
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

  const getWishList = () => {
    axiosInstance
      .get("/wishlists", {
        headers: {
          Authorization: `Bearer ${reactLocalStorage.getObject("token").token}`,
        },
      })
      .then(
        ({
          data: {
            data: { data },
          },
        }) => {
          console.log(data[0])
          setWish(data);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };
  const removeWishList = (id) => {
    axiosInstance
      .delete(`/wishlist/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${reactLocalStorage.getObject("token").token}`,
        },
      })
      .then(() => {
        getWishList();
      });
  };

  useEffect(() => {
    getWishList();
  }, []);

  return (
    <>
      <h2 class="product--listing__title d-flex justify-content-center align-items-center">
        Your Wishlist
      </h2>
      <div className="product--listing">
        <div className="row product--row">
          {wish &&
            wish.map((i) => {
              const { product } = i;
              console.log("pro", product);
              return (
                <div className="col-6 col-md-3 product--items mb-3">
                  <div className="product">
                    <div className="product__card">
                      <div className="product_img d-flex align-items-center justify-content-center">
                        <img
                          src={`${process.env.REACT_APP_SERVER_IMAGE_URL}/${
                            product?.upload ? product?.upload.file_name : ""
                          }`}
                          className="img-fluid"
                          alt="img"
                        />
                      </div>
                      <div className="product_name">{product?.name}</div>
                      <div className="product_price d-flex align-items-center justify-content-center">
                        {product?.discount_type ? (
                          hasDiscount(
                            product?.discount_type,
                            product?.unit_price,
                            product?.discount
                          )
                        ) : (
                          <span className="product_price_discount">
                            ৳ {product?.unit_price}
                          </span>
                        )}
                        {product?.discount_type && product?.discount !== 0 && (
                          <span className="product_price_price">
                            ৳{product?.unit_price}{" "}
                          </span>
                        )}
                      </div>

                      <div className="product_overlay d-flex align-items-center justify-content-center">
                        <p
                          className="product_overlay_text"
                          onClick={() =>
                            isInCart(product?.id)
                              ? incrementItem(product?.id)
                              : addToCart({
                                  ...product,
                                  unit_price:
                                    product?.unit_price - product?.discount,
                                })
                          }
                        >
                          Add to Shopping Bag
                        </p>

                        <a
                          className="product_overlay_details"
                          onClick={() => {
                            setDetailsMode(true);
                            setProductD(i.product);
                          }}
                        >
                          Details &raquo;
                        </a>
                      </div>
                    </div>
                    <div className="product__btns">
                      {isInCart(product?.id) && (
                        <div className="product__btns_add px-3">
                          <div className="d-flex align-items-center">
                            <button
                              className="btn-minus"
                              onClick={() => decrementItem(product?.id)}
                            >
                              –
                            </button>
                            <div className="product__btns_add_number">
                              {getQuantity(product?.id)}
                            </div>
                            <button
                              className="btn-plus"
                              onClick={() => incrementItem(product?.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      {!isInCart(product?.id) && (
                        <div className="product__btns_cart px-3">
                          <button
                          disabled={product?.current_stock === 0}
                            className="btn w-100"
                            onClick={() =>
                              addToCart({
                                ...product,
                                unit_price:
                                  product?.unit_price - product?.discount,
                              })
                            }
                          >
                            <span className="product__btns_cart_text">
                              <i className="fas fa-shopping-basket mr-1"></i>
                              {product?.current_stock === 0 ? "out of stock" : "Add to Bag"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className="orderedProducts_remove ml-auto"
                      onClick={() => removeWishList(i.id)}
                    >
                      <div className="product__btns_cart px-3">
                        <button className="btn w-100">
                          <span className="product__btns_cart_text">
                            <i className="far fa-trash-alt mr-1"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
