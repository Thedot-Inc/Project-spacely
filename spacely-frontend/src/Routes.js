import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// User Side
import Home from "./user/Home"
import OTP from "./user/OTP"
import Profile from "./user/Profile"



// User Login
import Login from "./user/Login"




// Admin Side
import AdminHome from "./admin/AdminHome"


// Routes - Restricted

import AdminRoutes from './admin/AdminRoutes'

const Routes = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/otp" exact component={OTP} />
          <Route path="/profilecomplete" exact component={Profile} />

          <Route path="/profilecomplete" exact component={Profile} />




        </Switch>
      </BrowserRouter>
    );
  };

export default Routes;