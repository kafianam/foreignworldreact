import React from "react";
import { CheckOut } from "../Component/CheckOut.jsx";
import { CartOpen } from "../Component/layout/CartOpen";
export const CheckoutPage = () => {
  return (
    <>
      <CartOpen />
      <CheckOut />
    </>
  );
};
