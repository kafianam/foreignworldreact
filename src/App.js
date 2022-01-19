import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./new.scss";
import { RouteApp } from "./Route/RouteApp";
import { BrowserRouter } from "react-router-dom";
import Header from "./Component/layout/Header"; // add .jsx, if get error in server
import Sidebar from "./Component/layout/Sidebar";
import { Cart } from "./Component/Cart/Cart";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Cart />
      <div className="main--wrapper">
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <div className="main-content p-3 p-md-4">
              <RouteApp />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App