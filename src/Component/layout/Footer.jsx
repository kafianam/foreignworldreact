import React, { useEffect } from "react";
import facebook from "../../asset/images/fb.png";
import Youtube from "../../asset/images/Youtube.png";
import Instagram from "../../asset/images/Instagram.png";
import twitter from "../../asset/images/twitter.png";
// import google_play_badge from "../../asset/images/app_store_badge.png";
// import app_store_badge from "../../asset/images/app_store_badge.png";

export const Footer = () => {
  return (
    <footer className="pt-4 pt-md-5">
      <div className="container">
        <div className="row pb-4">
          <div className="col-md-4">
            <div className="call-us">
              <div className="call-us__phone mb-2">
                <i className="fas fa-phone-alt"></i> +8801960086007
              </div>
              <div className="call-us__email">
                or email{" "}
                <a href="mailto:foreignworld2020@gmail.com">
                  foreignworld2020@gmail.com
                </a>
              </div>
            </div>

            <h3>Follow Us on:</h3>
            <div className="social--links">
              <a href="https://www.facebook.com/foreignworldbd" target="_blank">
                <img src={facebook} alt="face" />
              </a>
              <a href="#" target="_blank">
                <img src={Youtube} alt="" />
              </a>
              <a href="#" target="_blank">
                <img src={Instagram} alt="" />
              </a>
              <a href="#" target="_blank">
                <img src={twitter} alt="" />
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <h3>Customer Service</h3>

            <ul className="footer-menu">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>

            <h3>About Foreignworldbd</h3>
            <ul className="footer-menu">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Use</a>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h3>Contact</h3>
            <div className="contact--address mb-4 text-center text-md-left">
              <address>
                <p>Address: BDR Bari, Badda Dhaka 1212, Bangladesh.</p>
              </address>
            </div>
            {/* <h3>Get Our App</h3> */}
            {/* <div className="app--link d-flex align-items-center justify-content-center justify-content-md-start">
              <a href="#" target="_blank">
                <img src={app_store_badge} alt="/" />
              </a>
              <a href="#" target="_blank">
                <img src={google_play_badge} alt="" />
              </a>
            </div>{" "} */}
            <h3>Pay With</h3>
            <ul className="payMethods d-flex align-items-center">
              <li>
                <img
                  src="https://chaldn.com/asset/Egg.Grocery.Fabric/Egg.Grocery.Web/1.5.0+DataCenter-Release-2330/Default/components/shared/NewFooter/images/Amex.png?q=low&amp;webp=1&amp;alpha=1"
                  className="img-fluid"
                />
              </li>
              <li>
                <img
                  src="https://chaldn.com/asset/Egg.Grocery.Fabric/Egg.Grocery.Web/1.5.0+DataCenter-Release-2330/Default/components/shared/NewFooter/images/mastercard.png?q=low&amp;webp=1&amp;alpha=1"
                  className="img-fluid"
                />
              </li>
              <li>
                <img
                  src="https://chaldn.com/asset/Egg.Grocery.Fabric/Egg.Grocery.Web/1.5.0+DataCenter-Release-2330/Default/components/shared/NewFooter/images/VIsa.png?q=low&amp;webp=1&amp;alpha=1"
                  className="img-fluid"
                />
              </li>
              <li>
                <img
                  src="https://chaldn.com/asset/Egg.Grocery.Fabric/Egg.Grocery.Web/1.5.0+DataCenter-Release-2330/Default/components/shared/NewFooter/images/bkash.png?v=1&amp;q=low&amp;webp=1&amp;alpha=1"
                  className="img-fluid"
                />
              </li>
              <li>
                <img
                  src="https://chaldn.com/asset/Egg.Grocery.Fabric/Egg.Grocery.Web/1.5.0+DataCenter-Release-2330/Default/components/shared/NewFooter/images/COD.png?v=1&amp;q=low&amp;webp=1&amp;alpha=1"
                  className="img-fluid"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="copyright-wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 copyright text-center">
              <p>&copy; Foreignworldbd.com 2021 All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
