// /* eslint-disable array-callback-return */
// import React, { useState } from "react";

// import { useGlobalContext } from "../../reducer/cartContext";
// import { Link } from "react-router-dom";

// export const SideBar = () => {
//   const { show, setShow } = useState(false);

//   const SubShow = () => {
//     setShow(true);
//   };
//   const { category } = useGlobalContext();
//   //const params = new URLSearchParams(window.location.search).toString()
//   return (
//     <div className="col-sm-3 flex-grow-sm-1 flex-shrink-1 flex-grow-0  pb-sm-0 pb-3">
//       <div className="bg-light border rounded-3 p-1 h-100 ">
//         <h6 className="d-none d-sm-block text-muted">Categories</h6>
//         <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
//           {category.map((i) => {
//             if (i.parent_id === 0) {
//               return (
//                 <div className="col-6 col-md-4 cat_item">
//                   <Link to={`/${i.slug}`}>
//                     <div className="cat_item_img">
//                       <img
//                         className="img-fluid"
//                         src={`https://admina.khetkhamar.org/public/${
//                           i.banner_img ? i.banner_img.file_name : ""
//                         }`}
//                         alt=""
//                       />
//                     </div>
//                     <div className="cat_item_name p-2 p-md-3 text-center">
//                       {i.name}
//                     </div>
//                   </Link>
//                 </div>
//               );
//             }
//           })}
//         </ul>
//       </div>
//     </div>
//   );
// };
