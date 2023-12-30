import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
}from 'react-router-dom';
import { Provider} from 'react-redux';
import store from './store';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PrivateRoutes from './components/PrivateRoutes';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/RegistterScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import FilterScreen from './screens/FilterScreen';
import CartScreen from './screens/CartScreen';
import ServiceListScreen from './screens/admin/serviceListScreen';
import SupplierTypesListScreen from './screens/admin/supplierTypesListScreen';
import ServiceEditScreen from './screens/admin/serviceEditScreen';
import SupplierTypesEditScreen from './screens/admin/supplierTypesEditScreen';

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route index={true} path="/" element={<HomeScreen/>}/>
        <Route path="/product/:id" element={<ProductScreen/>}/>
        <Route path="/login" element={<LoginScreen/>}/>
        <Route path="register" element={<RegisterScreen/>}/>
        <Route path='' element={<PrivateRoutes/>}>
        <Route path="/Profile" element={<ProfileScreen/>}/>
        <Route path="/Filter" element={<FilterScreen/>}/>
        <Route path="/cart" element={<CartScreen/>}/>
        </Route>
        
        <Route path="" element={<AdminRoute/>}>
          <Route path="/admin/productlist" element={<ProductListScreen/>}/>
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen/>}/>
          <Route path="/admin/userlist" element={<UserListScreen/>}/>
          <Route path="/admin/user/:id/edit" element={<UserEditScreen/>}/>
          <Route path="/admin/servicelist" element={<ServiceListScreen/>}/>
          <Route path="/admin/suppliertypelist" element={<SupplierTypesListScreen/>}/>
          <Route path="/admin/service/:id/edit" element={<ServiceEditScreen/>}/>
          <Route path="/admin/supplierType/:id/edit" element={<SupplierTypesEditScreen/>}/>

        </Route>
       
    </Route>
     
  )
)

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}/> 
    </Provider>

  </React.StrictMode>
);

reportWebVitals();

