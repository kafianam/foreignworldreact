import { useGlobalContext } from "./../../reducer/cartContext";
import { reactLocalStorage } from "reactjs-localstorage";
import { useHistory } from "react-router";

export const Category = () => {
  const history = useHistory();

  const { category } = useGlobalContext();

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

  return (
    <>
      <div className="product--category mb-5">
        <h2 className="product--listing__title d-flex justify-content-center align-items-center">
          Our Product Categories
        </h2>
        <div
          className="d-flex flex-wrap product-cat-row"
          style={{ height: category.length == 0 ? "274px" : "" }}
        >
          {category.map((i) => {
            if (i.featured === 1) {
              return (
                <div className="cat_item">
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
            }
          })}
        </div>
      </div>
    </>
  );
};
