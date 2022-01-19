// /* eslint-disable react-hooks/exhaustive-deps */
// // import React, { useEffect, useState } from "react";
// // import { Product } from "./Products";
// // import axiosInstance from "../../helper/axios";
// // import { useGlobalContext } from "../../reducer/cartContext";

// // //import { FaShoppingBag } from "react-icons/fa";

// // export const ProductList = () => {
// //   const [products, setProducts] = useState();

// //   const { item } = useGlobalContext();

// //   useEffect(() => {
// //     if (item) {
// //       getProducts();
// //     }
// //   }, [item]);

// //   const getProducts = async () => {
// //     await axiosInstance
// //       .get(`/products/category/${item}?page=1`)
// //       .then(
// //         ({
// //           data: {
// //             data: { data },
// //           },
// //         }) => {
// //           setProducts(data);
// //         }
// //       )
// //       .catch((error) => {
// //         console.log(error);
// //       });
// //   };

// //   return (
// //     <>
// //       <div className="product--listing">
// //         <div className="row product--row">
// //           {products.map((product) => (
// //             <Product {...product} key={product.id} />
// //           ))}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };
