import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../Component/Products/Products";
import axiosInstance from "../helper/axios";

export const Search = () => {
  const [loadingText, setLoadingText] = useState("Loading ....");
  const [results, setResults] = useState([]);

  const params = useParams();

  const search = (keyword) => {
    setLoadingText("Loading ....");
    axiosInstance
      .get(`/products/${keyword}`)
      .then(
        ({
          data: {
            data: { data },
          },
        }) => {
          if (data.length == 0) {
            setLoadingText(
              `Your search ${params.key} did not match any products !`
            );
          }
          setResults(data);
        }
      )
      .catch(() => {});
  };

  useEffect(() => {
    search(params.key);
    return () => {
      setResults([]);
    };
  }, [params.key]);

  return (
    <>
      <div className="product--listing">
        <div className="row product--row">
          {results.length === 0 && (
            <h3 className="text-center text-success">{loadingText}</h3>
          )}
          {results.map((product) => (
            <Product {...product} key={product.id} />
          ))}
        </div>
      </div>
    </>
  );
};
