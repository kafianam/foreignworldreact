/* eslint-disable jsx-a11y/anchor-is-valid */
// import orderdoneimg from "../asset/images/grocery-crate2.png";
import paymentIcon from "../asset/images/payment_icons_portwallet.png";
import paymentBkash from "../asset/images/bkash.png";
import { useGlobalContext } from "../reducer/cartContext";
import { useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axiosInstance from "../helper/axios";

const OrderDone = () => {
  const [address, setAddress] = useState({})
  const [orderDetail, setOrderDetail] = useState({})

  let { removeAll } = useGlobalContext();

  const getOrder = (orderId) => {
    axiosInstance.get(`/get-order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${reactLocalStorage.getObject("token").token}`,
      }
    }).then((res) => {
      setOrderDetail(res?.data?.data)
      setAddress(JSON.parse(res?.data?.data?.shipping_address))
    }).catch((error) => {
      console.log(error)
    })
  }
   
   
  useEffect(() => {
    window.scrollTo({ top: 0 })
    reactLocalStorage.remove('coupon')

    const orderIdString = window.location.search
    const orderId = orderIdString.slice(1, orderIdString.length)

    getOrder(orderId)

    reactLocalStorage.set("cart", [])
    reactLocalStorage.set("order", [])
    if(reactLocalStorage.get('reloadForSSLCommerz')){
      reactLocalStorage.remove('reloadForSSLCommerz')
    }

    return () => {
      if(reactLocalStorage.get('reloadForSSLCommerz')){
        reactLocalStorage.remove('reloadForSSLCommerz')
      }
      reactLocalStorage.set("cart", [])
      reactLocalStorage.set("order", [])
      removeAll()
      reactLocalStorage.remove('coupon')
    }
  }, [])
  return (
    <div>
      <div className="orderDoneWrapper">
        <div class="orderSuccess d-flex align-items-center justify-content-center">
          {/* <div className="orderSuccess_img">
                        <img src={orderdoneimg} />
                    </div> */}

          <div class="orderSuccessMessage text-center">
            <div class="orderNum">
              <strong>Order Number </strong>
              <strong>#{orderDetail.code}</strong>
            </div>
            <div class="thankYou orderNum mb-0">
              {/* <strong>Your order is on its way</strong> */}
              <strong>Don't Stop Until You're Proud</strong>
              <div>
                <strong>Please pay with :</strong>
                <span>
                  {orderDetail.payment_type?.replaceAll("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="oderSummary mt-4">
          <div className="row">
            <div className="col-12 col-md-6">
              <h3 className="d-flex justify-content-center align-items-center mb-4">
                Order Summary
              </h3>

              <div className="oderSummary__cont">
                <div className="row mb-2">
                  <div className="col-6">Subtotal</div>
                  <div className="col-6 text-right">
                    <span>৳</span>
                    {(Number(orderDetail.grand_total ?? 0) + Number(orderDetail.coupon_discount ?? 0)) - Number(orderDetail.shipping_cost ?? 0)}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Delivery Charge</div>
                  <div className="col-6 text-right">
                    <span>৳</span>{" "}
                    {orderDetail.shipping_message}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Discount</div>
                  <div className="col-6 text-right">
                    - <span>৳</span> {orderDetail.coupon_discount}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Order Total</div>
                  <div className="col-6 text-right">
                    <span>৳</span>{" "}
                    {orderDetail.shipping_cost
                      ? orderDetail.grand_total
                      : orderDetail.grand_total -
                        orderDetail.shipping_cost}
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
                      {orderDetail.shipping_cost
                        ? orderDetail.grand_total
                        : orderDetail.grand_total -
                          orderDetail.shipping_cost}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="orderDeliveryAddress">
                <h3 className="d-flex justify-content-center align-items-center mb-4">
                  Delivery Address
                </h3>

                <div className="orderDeliveryAddress_address d-flex align-items-center justify-content-center">
                  <p>
                    {address.address} ,
                    {address.city} - 
                    {address.postal_code} ,
                    {address.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

       

        <div className="cancelOrder my-5">
          <p className="mb-0 text-center">
            Would you like to cancel this order?{" "}
            <a href="#" className="btn btn-success ml-3">
              Cancel Order
            </a>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};
export default OrderDone;