import React from "react";
import { Route, Switch } from "react-router-dom";
import { CheckoutPage } from "../pages/CheckoutPage.jsx";
import { HomePages } from "../pages/HomePages.jsx";
import Pay from "../pages/Pay";
import OrderDone from "../Component/OrderDone.jsx";
import Profile from "../Component/dashboard/Profile.jsx";
import Orders from "../Component/dashboard/Orders.jsx";
import { NotFound } from "../Component/layout/NotFound.jsx";
import { ProductPage } from "../pages/ProductPage.jsx";
import { SearchPage } from "../pages/SearchPage";
import { WishListPage } from "../pages/WishListPage.jsx";

export const RouteApp = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={HomePages} />
        <Route path="/search/:key" component={SearchPage} />
        <Route path="/checkoutpage" component={CheckoutPage} />
        <Route path="/wishlist" component={WishListPage} />
        <Route path="/pay" component={Pay} />
        <Route path="/order-done" component={OrderDone} />
        <Route path="/dashboard/profile" component={Profile} />
        <Route path="/dashboard/orders" component={Orders} />
        <Route path="/:categoryname" component={ProductPage} />
        <Route path="/productdetails" component={ProductPage} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
};
