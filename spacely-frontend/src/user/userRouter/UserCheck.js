  
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userCheckAuth } from "./helpmiddleware";

const UserCheck = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !userCheckAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/logout",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default UserCheck;