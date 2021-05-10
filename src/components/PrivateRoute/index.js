import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { paths } from '../../constants/path';
const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const idToken = useSelector((state) => state.auth.idToken);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!idToken) {
          return (
            <Redirect
              to={{
                pathname: paths.LOGIN_PATH,
                state: { from: props.location },
              }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
