/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "./../../reducer/cartContext";
import { useHistory, useParams } from "react-router-dom";
import axiosInstance from "../../helper/axios";
import { Product } from "../Products/Products";
import { reactLocalStorage } from "reactjs-localstorage";
import InfiniteScroll from "react-infinite-scroll-component";

export const SubCategory = () => {
  const [subCategory, setSubCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(undefined);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const params = useParams();

  let nextPage = useRef(1);

  let { category } = useGlobalContext();

  const history = useHistory();
  console.log("pro", products);

  const getCategory = async () => {
    await axiosInstance
      .get("/categories?page=1")
      .then(
        ({
          data: {
            data: { data },
          },
        }) => {
          category = data;
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const getProducts = async (id = categoryId) => {
    if (id == undefined) {
      return false;
    }
    await axiosInstance
      .get(`/products/category/${id}?page=${nextPage.current}`)
      .then((data) => {
        if (nextPage.current == 1) {
          setProducts(data?.data?.data?.data);
        } else {
          setProducts([...products, ...data?.data?.data?.data]);
        }

        if (data?.data?.data?.next_page_url) nextPage.current += 1;
        else setCategoryId(undefined);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const redirectToCategory = (slug, isAgeRestricted) => {
    if (isAgeRestricted == 1) {
      if (reactLocalStorage.get("ageRestrictedPassed") != undefined) {
        history.push(slug);
      } else {
        if (window.confirm("Are you 18 + ?")) {
          reactLocalStorage.set("ageRestrictedPassed", true);
          history.push(slug);
        }
      }
    } else {
      history.push(slug);
    }
  };
  const closeSidebar = () => {
    document.getElementById("sidebarWrapper").classList.remove("sidebarOpen");
  };

  useEffect(async () => {
    closeSidebar();

    console.log("Sub category rendered !");
    nextPage.current = 1;
    setSubCategory([]);
    setProducts([]);

    if (category.length === 0) await getCategory();
    const categoryObj = category.find((i) => i.slug == params.categoryname);

    if (
      categoryObj?.is_age_restricted == 1 &&
      reactLocalStorage.get("ageRestrictedPassed") == undefined
    ) {
      if (window.confirm("Are you 18 + ?")) {
        reactLocalStorage.set("ageRestrictedPassed", true);
      } else {
        history.push("/");
      }
    }
    if (categoryObj?.children_categories?.length > 0) {
      setSubCategory(categoryObj.children_categories);
    } else if (categoryObj?.id) {
      setCategoryId(categoryObj.id);
      getProducts(categoryObj.id);
    }
    setCategoryImage(categoryObj?.banner_img?.file_name);
    setCategoryName(categoryObj?.name);
    setCategoryMessage(categoryObj?.message);

    window.scrollTo({ top: 0 });
  }, [params.categoryname]);

  return (
    <>
      <div className="product--category mb-5">
        {categoryImage && (
          <>
            <div className="product--category__img d-flex align-items-center justify-content-center mb-2 mb-md-4">
              <img
                className="img-fluid m-auto category-banner"
                src={`${process.env.REACT_APP_SERVER_IMAGE_URL}/${categoryImage}`}
                alt="img"
              />
            </div>

            <div className="breadcrumbs--wrapper">
              <ul className="breadcrumbs d-flex flex-wrap">
                <li>
                  <a href="/">Product Category</a>
                </li>
                <li>
                  <a href="">Product Sub Category</a>
                </li>
                <li>Product Name</li>
              </ul>
            </div>
          </>
        )}
        {categoryName && (
          <>
            <h2 class="product--listing__title d-flex justify-content-center align-items-center">
              {categoryName}
            </h2>
            <h5 className="text-center text-success">{categoryMessage}</h5>
          </>
        )}
        {subCategory?.length == 0 && products?.length == 0 && (
          <h3 className="text-center text-success">Loading ....</h3>
        )}
        <div className="d-flex flex-wrap product-cat-row">
          {subCategory.map((i) => {
            return (
              <div key={i.id} className="cat_item">
                <a
                  onClick={() =>
                    redirectToCategory(`/${i.slug}`, i.is_age_restricted)
                  }
                >
                  <div className="cat_item_img d-flex align-items-center justify-content-center">
                    <img
                      className="img-fluid"
                      src={`${process.env.REACT_APP_SERVER_IMAGE_URL}/${
                        i.banner_img ? i.banner_img.file_name : ""
                      }`}
                      alt="img"
                    />
                  </div>
                  <div className="cat_item_name text-center">{i.name}</div>
                </a>
              </div>
            );
          })}
        </div>
        <InfiniteScroll
          dataLength={products?.length}
          next={getProducts}
          hasMore={true}
          // loader={<h4>Loading ...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="product--listing">
            <div className="row product--row">
              {products?.map((product) => (
                <Product {...product} key={product.id} />
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};
