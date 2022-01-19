// import React, { useEffect, useState } from "react";
// import { useGlobalContext } from "../reducer/cartContext";
// import { useForm } from "react-hook-form";
// import { useHistory } from "react-router-dom";
// import axiosInstance from "../helper/axios";
// import { FaTimes } from "react-icons/fa";
// //import axios from "axios";
// import { reactLocalStorage } from "reactjs-localstorage";

// export const BillingAndShipping = () => {
//   const [gettoken, setGetToken] = useState({});
//   let history = useHistory();
//   const { isModalOpen, closeModal } = useGlobalContext();

//   //const { setFormData } = useGlobalContext();
//   console.log("to", gettoken);
//   const {
//     register,
//     handleSubmit,

//     reset,
//   } = useForm();

//  useEffect(() => {
//    const temToken = reactLocalStorage.getObject("token");
//    setGetToken(temToken);
//  }, []);

//   // const temtoekn=()=>{
//   //  reactLocalStorage.getObject("token");
//   //   return temtoekn
//   // }

//   ///Store Authenticated user's shipping + billing address.
//   const onSubmit = (data) => {
//     console.log("data");
//     axiosInstance
//       .post(
//         "/address/store",
//         {
//           user_id: `${gettoken.user.id}`,
//           address_type: "billing_address ",
//           address: data.address,
//           country: data.country,
//           city: data.city,
//           postal_code: data.postal_code,
//           phone: `${gettoken.user.phone}`,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${gettoken.token}`,
//           },
//         }
//       )
//       .then(({ data: { data } }) => {
//         //history.push("./checkoutpage");
//         closeModal();

//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     //setFormData(data);

//     //console.log(data);

//     reset();
//   };

//   return (
//     <div>
//       <main
//         className={`${
//           isModalOpen ? "modal-overlay show-modal" : "modal-overlay"
//         }`}
//       >
//         <div className="container">
//           <div className="row justify-content-md-center row-space-top">
//             <div className="col-lg-6 col-md-12 col-sm-12">
//               <div className="bill">
//                 <h1>Billing & Shippping address</h1>

//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <input
//                     name="address"
//                     placeholder="address"
//                     {...register("address", { required: true })}
//                   />
//                   <input
//                     name="country"
//                     placeholder="country"
//                     {...register("country", { required: true })}
//                   />
//                   <input
//                     name="city"
//                     placeholder="city"
//                     {...register("city", { required: true })}
//                   />
//                   <input
//                     name="postal_code"
//                     placeholder="postal_code"
//                     {...register("postal_code", { required: true })}
//                   />

//                   <button
//                     id="subbtn2"
//                     type="submit"
//                     className="btn btn-danger "
//                   >
//                     save
//                   </button>
//                 </form>
//                 <button className="close-modal-btn" onClick={closeModal}>
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };
