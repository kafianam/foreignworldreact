/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
import { useEffect } from "react";
import { useHistory } from "react-router";
import { reactLocalStorage } from "reactjs-localstorage";
import { useGlobalContext } from "../../reducer/cartContext";

const showCategory = (target, isStepChild = false, stepChild) => {
  document
    .querySelectorAll(".category")
    .forEach((i) => i.classList.add("hide"));
  if (target !== undefined) {
    if (isStepChild) {
      document.querySelectorAll(stepChild).forEach((i) => {
        i.classList.remove("hide");
      });
    }
    document.querySelectorAll(target).forEach((i) => {
      i.classList.remove("hide");
    });
  }
};

const Sidebar = () => {
  const history = useHistory();

  const { category } = useGlobalContext();

  const redirectToCategory = (slug, isAgeRestricted) => {
    if (isAgeRestricted == 1) {
      if (reactLocalStorage.get("ageRestrictedPassed") !== undefined) {
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

  useEffect(() => {
    console.log("Sidebar component loaded !");
   
  }, []);
  return (
    <div id="sidebarWrapper" className="sidebar--wrap py-3 px-0">
      <ul className="sidebar-menu">
        {category.map((parent) => {
          if (parent?.parent_id === 0) {
            return (
              <li key={parent.id}>
                <a
                  onClick={() => {
                    redirectToCategory(
                      `/${parent.slug}`,
                      parent.is_age_restricted
                    );
                    showCategory(`.child-category${parent.id}`);
                  }}
                >
                  {parent.name}
                </a>
                {parent?.children_categories?.length > 0 && (
                  <ul className="sidebar-menu__sub">
                    <i className="arrow"></i>

                    {parent?.children_categories.map((child) => (
                      <li
                        className={`category child-category${parent.id} hide   `}
                        key={child.id}
                      >
                        <a
                          onClick={() => {
                            redirectToCategory(
                              `/${child.slug}`,
                              child.is_age_restricted
                            );
                            showCategory(
                              `.step-child-category${child.id}`,
                              true,
                              `.child-category${parent.id}`
                            );
                          }}
                        >
                          {child.name}
                        </a>
                        {child?.categories?.length > 0 && (
                          <ul className="sidebar-menu__sub">
                            <i className="arrow"></i>

                            {child?.categories?.map((stepChild) => (
                              <li key={stepChild.id}>
                                <a
                                  className={`category step-child-category${child.id} hide`}
                                  onClick={() =>
                                    redirectToCategory(
                                      `/${stepChild.slug}`,
                                      stepChild.is_age_restricted
                                    )
                                  }
                                >
                                  {stepChild.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }
        })}
      </ul>
      <ul className="sidebar-menu">
        <li>
          <a href="#">Coupons</a>
        </li>
        <li>
          <a href="#">
            Offers <span className="sidebar-menu_count">99</span>
          </a>
        </li>
        <li>
          <a href="#">Food Aid</a>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
