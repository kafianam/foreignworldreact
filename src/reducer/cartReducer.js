import { toast } from "react-toastify";
import { reactLocalStorage } from "reactjs-localstorage";

const showToastr = (message = 'No message !', type = 'success') => {
  toast(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    type
  });
}

export const cartReducer = (state, action) => {

  let localST = reactLocalStorage.get("cart") ?? [];

  // if (action.type !== "GET_TOTAL") { // fixed a bug of Last item remove and first item add on cart
    reactLocalStorage.set("cart", JSON.stringify(state.cartItems));
  // }
  switch (action.type) {
    case "ADD_TO_CART":
      let minQty = undefined;
      if (action.payload.min_qty > 1) {
        showToastr(`You have to add minimum ${action.payload.min_qty} quantity`, 'info')
        // alert(`You have to add minimum ${action.payload.min_qty} quantity`);
        minQty = action.payload.min_qty;
      }
      if (!state.cartItems.find((item) => item.id === action.payload.id)) {
        state.cartItems.push({
          ...action.payload,
          quantity: minQty ?? state.quantity,
        });
      }

      return {
        ...state,
        cartItems: [...state.cartItems],
        localST,
      };
    
    case "INCREMENTITEM":
      const updatedCart = state.cartItems.map((curElem) => {
        if (curElem.id === action.payload) {
          let updatedQnty = curElem.quantity + 1;
          if (curElem.max_qty < updatedQnty) {
            showToastr(`Max quantity for this product is ${curElem.max_qty}`, 'info')
            // alert(`Max quantity for this product is ${curElem.max_qty}`);
            return { ...curElem };
          }
          return { ...curElem, quantity: updatedQnty };
        }
        return curElem;
      });
      return { ...state, cartItems: updatedCart };

    case "DECREMENTITEM":
      let qntShouldRemove = 1;
      const updatedCartd = state.cartItems
        .map((curElem) => {
          if (curElem.quantity == curElem.min_qty) {
            showToastr(`You have to add minimum ${curElem.min_qty} quantity`, 'info')
            // alert(`You have to add minimum ${curElem.min_qty} quantity`);
            qntShouldRemove = curElem.min_qty;
          }
          if (curElem.id === action.payload) {
            return { ...curElem, quantity: curElem.quantity - qntShouldRemove };
          }
          return curElem;
        })
        .filter((curElem) => curElem.quantity !== 0);
      return { ...state, cartItems: updatedCartd };

    case "REMOVE_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.filter((curElem) => {
          return curElem.id !== action.payload;
        }),
      };

    case "REMOVE_ITEMS":
      return {
        ...state,
        cartItems: [],
      };

    case "GET_TOTAL":
      let { totalAmount } = state.cartItems.reduce(
        (accum, curVal) => {
          let { unit_price, quantity } = curVal;

          let updatedTotalAmount = unit_price * quantity;
          accum.totalAmount += updatedTotalAmount;
          return accum;
        },
        {
          totalAmount: 0,
        }
      );
      return { ...state, totalAmount };
    
    default:
      return state;
  }
};