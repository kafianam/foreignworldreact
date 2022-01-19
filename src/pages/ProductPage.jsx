import React from "react"
import { SubCategory } from "../Component/Categories/SubCategory"
import { CartOpen } from "../Component/layout/CartOpen"

export const ProductPage = () => {
  return (
    <>
      <CartOpen />
      <SubCategory />
    </>
  )
}