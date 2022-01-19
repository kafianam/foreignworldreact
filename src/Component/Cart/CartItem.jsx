import React from "react";
//import { FaPlus, FaMinus } from "react-icons/fa";
//import { AiFillDelete } from "react-icons/ai";
import { useGlobalContext } from "../../reducer/cartContext";

export const CartItem = (props) => {
  const {
    name,
    unit_price,
    unit,
    id,

    quantity,
    upload,
  } = props;
  const { removeItem, incrementItem, decrementItem } = useGlobalContext();

  //const price = unit_price * quantity;
  return (
    <div className="orderedProducts d-flex align-items-center">
      <div className="orderedProducts_quantity">
        <div
          className="caret caret-up"
          title="Add one more to bag"
          onClick={() => incrementItem(id)}
        ></div>
        <div className="orderedProducts_quantity_count">{quantity}</div>
        <div
          className="caret caret-down"
          title="Remove one from bag"
          onClick={() => decrementItem(id)}
        ></div>
      </div>

      <div className="orderedProducts_img">
        <img
          src={`${process.env.REACT_APP_SERVER_IMAGE_URL}/${
            upload ? upload.file_name : ""
          }`}
          className="img-fluid"
          alt="Diploma Instant Full Cream Milk Powder"
        />
      </div>

      <div className="orderedProducts_name">
        <span>{name}</span>
        <div className="subText">
          <span>
            ৳{unit_price}/ {quantity} {unit}
          </span>
        </div>
      </div>

      <div className="orderedProducts_amount d-flex align-items-center justify-content-center flex-column">
        <div className="orderedProducts_amount_discount">
          <span>৳</span>
          {unit_price * quantity}
        </div>
        {/* <div className="orderedProducts_amount_total">
              <span>৳{price} </span> 
            </div> */}
      </div>

      <div
        className="orderedProducts_remove ml-auto"
        onClick={() => removeItem(id)}
      >
        <i className="far fa-trash-alt"></i>
      </div>
    </div>
  );
};
