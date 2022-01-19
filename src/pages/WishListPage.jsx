import React from "react";
import { WishList } from "../Component/WishList";
import { CartOpen } from "../Component/layout/CartOpen"

export const WishListPage = () => {

  return (
    <>
       <CartOpen />
      <WishList />
    </>
  );
};
