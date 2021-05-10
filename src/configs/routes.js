import { Route } from 'react-router-dom';

import { paths } from '../constants/path';
import LoginPage from '../pages/Login';
import PrivateRoute from '../components/PrivateRoute';
import DashboardPage from '../pages/Dashboard';
import _404Page from '../pages/_404';
import SelectBrandPage from '../pages/SelectBrand';
import StoresPage from '../pages/Stores';
import EmployeesPage from '../pages/Employees';
import ProfilePage from '../pages/Profile';
import VoucherPage from '../pages/Voucher';
import TransferPage from '../pages/Transfer';

const publicRoutes = [
  {
    key: 'login',
    path: paths.LOGIN_PATH,
    exact: true,
    component: LoginPage,
  },
];

const privateRoutes = [
  {
    key: 'stores',
    path: paths.STORE_PATH,
    component: StoresPage,
    exact: true,
  },
  {
    key: 'select-brand',
    path: paths.SELECT_BRAND,
    component: SelectBrandPage,
    exact: true,
  },
  {
    key: 'dashboard',
    path: paths.DASHBOARD_PATH,
    exact: true,
    component: DashboardPage,
  },
  {
    key: 'employees',
    path: paths.EMPLOYEE_PATH,
    exact: true,
    component: EmployeesPage,
  },
  {
    key: 'profile',
    path: paths.PROFILE_PATH,
    exact: true,
    component: ProfilePage,
  },
  {
    key: 'voucher',
    path: paths.VOUCHER_PATH,
    exact: true,
    component: VoucherPage,
  },
  {
    key: 'transfer',
    path: paths.TRANSFER_PATH,
    exact: true,
    component: TransferPage,
  },
];

const routes = [
  ...publicRoutes.map(({ key, path, exact, component }) => (
    <Route key={key} path={path} exact={exact} component={component} />
  )),
  ...privateRoutes.map(({ key, path, exact, component }) => (
    <PrivateRoute key={key} path={path} exact={exact} component={component} />
  )),
  <Route key="_404" component={_404Page} />,
];

export default routes;
