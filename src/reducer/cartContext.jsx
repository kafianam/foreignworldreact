import React, { useState, useContext, useReducer, useEffect } from "react";
import axiosInstance from "../helper/axios";
import { cartReducer } from "./cartReducer";
import { reactLocalStorage } from "reactjs-localstorage";

const AppContext = React.createContext();

const initialState = {
  totalAmount: 0,
  quantity: 1,
  cartItems: reactLocalStorage.get("cart")
    ? JSON.parse(reactLocalStorage.get("cart"))
    : [],
};

export const AppProvider = ({ children }) => {
  const [openCart, setOpenCart] = useState(false);

  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [orderPlace, setOrderPlace] = useState();
  const [category, setCategory] = useState([]);
  //const [item, setItem] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState();
  //console.log("tk", token);

  const getData = async () => {
    await axiosInstance
      .get("/categories?page=1")
      .then(
        ({
          data: {
            data: { data },
          },
        }) => {
          setCategory(data);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  // const filterCategory = (id, name) => {
  //   console.log(id, name);
  //   const params = new URLSearchParams(window.location.search);
  //   params.set("catagory", `${id},${name}`);
  //   params.toString();
  //   window.history.replaceState(
  //     {},
  //     "",
  //     `${window.location.pathname}?${params.toString()}`
  //   );
  //   setItem(id);
  // };

  //const getToken = reactLocalStorage.getObject("token");

  useEffect(() => {
    dispatch({ type: "GET_TOTAL" });
    //removeItem();
  }, [state.cartItems]);

  const handleCart = () => {
    setOpenCart(true);
  };
  const cartOpen = () => {
    setOpenCart(true);
  };
  const cartClose = () => {
    setOpenCart(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
  };

  const incrementItem = (id) => {
    return dispatch({
      type: "INCREMENTITEM",
      payload: id,
    });
  };

  const decrementItem = (id) => {
    return dispatch({
      type: "DECREMENTITEM",
      payload: id,
    });
  };
  const removeItem = (id) => {
    return dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });
  };

  const removeAll = () => {
    return dispatch({
      type: "REMOVE_ITEMS",
      payload: null,
    });
  };

  return (
    <AppContext.Provider
      value={{
        orderPlace,
        setOrderPlace,
        setFormData,
        formData,
        //getToken,
        // setToken,
        category,
        // filterCategory,
        //item,

        isModalOpen,
        openModal,
        closeModal,
        ...state,
        removeItem,
        removeAll,
        decrementItem,
        incrementItem,
        addToCart,
        openCart: openCart,
        cartOpen: cartOpen,
        cartClose: cartClose,
        handleCart: handleCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
