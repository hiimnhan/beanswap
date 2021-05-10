import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';

import './App.less';
import routes from './configs/routes';
import { AuthActions } from './redux/actions/auth.actions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AuthActions.checkAutoLogout());
  }, [dispatch]);

  return <Switch>{routes}</Switch>;
}

export default App;
