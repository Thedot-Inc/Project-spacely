import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// User Side
import Home from "./user/Home"
import OTP from "./user/OTP"
import Profile from "./user/Profile"

// User Check Router
import UserCheck from "./user/userRouter/UserCheck";





// User Login
import Login from "./user/Login"
import Logout from "./user/Logout";




// Admin Side
import AdminHome from "./admin/AdminHome"


// Routes - Restricted

import AdminRoutes from './admin/AdminRoutes'

const Routes = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <UserCheck path="/login" exact component={Login} />
          <Route exact path="/logout" component={Logout} />

          <UserCheck path="/otp" component={OTP} />
          <Route path="/profilecomplete" exact component={Profile} />

          <Route path="/admin/login" exact component={AdminHome} />




        </Switch>
      </BrowserRouter>
    );
  };

export default Routes;