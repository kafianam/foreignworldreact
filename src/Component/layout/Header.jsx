import { useEffect, useState } from "react";
import Logo from "./../../asset/images/logo2.png";
import { Link, useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { useGlobalContext } from "./../../reducer/cartContext";
import { LoginForm } from "../LoginForm";

const Header = () => {
  const history = useHistory();
  const [LoggedInUser, setLoggedInUser] = useState();

  const { openModal, closeModal, totalAmount } = useGlobalContext();
  const handleChange = (e) => {
    if (e.target.value === "") {
      history.push("/");
    } else {
      history.push("/search/" + e.target.value);
    }
  };

  const logout = () => {
    reactLocalStorage.remove("token");
    setLoggedInUser(null);
    closeModal();
    history.push("/");
  };

  const toggleSidebar = () => {
    document.getElementById("sidebarWrapper").classList.toggle("sidebarOpen");
  };
  const showdropDown = () => {
    document.getElementById("headerDropdownMenu").classList.toggle("show");
  };

  useEffect(() => {
    const token = reactLocalStorage.getObject("token");
    if (token.token) setLoggedInUser(token);
    console.log("Header component loaded !");
  }, [closeModal]);
  return (
    <>
      <div className="header--wrapper position-fixed w-100">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="logo-wrap d-flex align-items-center">
              <div className="hamburger-menu mr-3 d-block d-sm-block d-md-none">
                <button
                  id="toggle_nav"
                  className="toggle-menu"
                  onClick={toggleSidebar}
                >
                  <i></i>
                  <i></i>
                  <i></i>
                </button>
              </div>
              <Link to="/" className="khetkhamar_logo">
                <img src={Logo} alt="Logo" className="img-fluid" />
              </Link>
            </div>
            <div className="search--wrap d-none d-md-block">
              <div className="search--box d-flex">
                <input
                  onChange={handleChange}
                  className="searchBox"
                  type="text"
                  placeholder="Search for products (e.g. eggs, milk, potato)"
                />
                <button type="submit">
                  <svg
                    className="search"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 100 100"
                    data-reactid=".b9pytvtuci.4.0.0.0.3.0.2.0"
                  >
                    <path
                      d="M44.5,78.5c-18.8,0-34-15.3-34-34s15.3-34,34-34s34,15.3,34,34S63.3,78.5,44.5,78.5z M44.5,18.1  C30,18.1,18.2,30,18.2,44.5S30,70.8,44.5,70.8S70.9,59,70.9,44.5S59,18.1,44.5,18.1z"
                      data-reactid=".b9pytvtuci.4.0.0.0.3.0.2.0.0"
                    ></path>
                    <path
                      d="M87.2,91c-1,0-2-0.4-2.7-1.1L63.1,68.5c-1.5-1.5-1.5-3.9,0-5.4s3.9-1.5,5.4,0l21.3,21.3  c1.5,1.5,1.5,3.9,0,5.4C89.2,90.6,88.2,91,87.2,91z"
                      data-reactid=".b9pytvtuci.4.0.0.0.3.0.2.0.1"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div
              className="sign--in-box"
              onClick={() => (LoggedInUser?.token ? "Logged in" : openModal())}
            >
              <div className="dropdown h-100 text-center d-flex align-items-center justify-content-center">
                <span className="dropdown-toggle" type="button">
                  <span className="d-none d-md-block">
                    {LoggedInUser ? LoggedInUser?.user?.name : "Login"}
                  </span>
                  <div
                    className="dot-menu d-block d-sm-block d-md-none"
                    onClick={() =>
                      LoggedInUser?.token ? showdropDown() : openModal()
                    }
                  >
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </span>
                {LoggedInUser && (
                  <div
                    className="dropdown-menu dropdown-menu-right "
                    id="headerDropdownMenu"
                  >
                    <Link className="dropdown-item" to="/dashboard/profile">
                      Your Profile
                    </Link>
                    {/* <Link className="dropdown-item" to="#">
                      Your Orders
                    </Link> */}
                    <Link className="dropdown-item" to="/wishlist">
                      WishList
                    </Link>
                    {/* <Link className="dropdown-item" to="#">
                      Payment History
                    </Link>
                    <Link className="dropdown-item" to="/dashboard/profile">
                      Change Password
                    </Link> */}
                    <Link className="dropdown-item" to="/" onClick={logout}>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="search--wrap-mobile col-12 d-block d-md-none py-2">
              <div className="search--box d-flex">
                <input
                  onChange={handleChange}
                  className="searchBox"
                  type="text"
                  placeholder="Search for products (e.g. eggs, milk, potato)"
                />
                <button type="submit">
                  <svg
                    className="search"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 100 100"
                    data-reactid=".b9pytvtuci.4.0.0.0.3.0.2.0"
                  >
                    <path
                      d="M44.5,78.5c-18.8,0-34-15.3-34-34s15.3-34,34-34s34,15.3,34,34S63.3,78.5,44.5,78.5z M44.5,18.1  C30,18.1,18.2,30,18.2,44.5S30,70.8,44.5,70.8S70.9,59,70.9,44.5S59,18.1,44.5,18.1z"
                      data-reactid=".b9pytvtuci.4.0.0.0.3.0.2.0.0"
                    ></path>
                    <path
                      d="M87.2,91c-1,0-2-0.4-2.7-1.1L63.1,68.5c-1.5-1.5-1.5-3.9,0-5.4s3.9-1.5,5.4,0l21.3,21.3  c1.5,1.5,1.5,3.9,0,5.4C89.2,90.6,88.2,91,87.2,91z"
                      data-reactid=".b9pytvtuci.4.0.0.0.3.0.2.0.1"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginForm setLoggedInUser={setLoggedInUser} />
    </>
  );
};
export default Header;
