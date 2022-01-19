import { Banner } from "../Component/Banner";
import { CartOpen } from "../Component/layout/CartOpen";
import { Category } from "../Component/Categories/Category";
import { Footer } from "../Component/layout/Footer";
import { useEffect } from "react";

export const HomePages = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  });
  return (
    <>
      <Banner />
      <CartOpen />
      <Category />
      <Footer />
    </>
  );
};
