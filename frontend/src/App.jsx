import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/shop/Home';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Checkout from './pages/checkout/Checkout';
import Payment from './pages/checkout/Payment';
import Orders from './pages/orders/Orders';

function Layout() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0,0); }, [location.pathname]);
  const authPage = ['/login','/register'].includes(location.pathname);
  return <>{!authPage && <Navbar/>}<Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/products/:id" element={<ProductDetail/>}/>
    <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
    <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
    <Route path="/payment/:orderId" element={<ProtectedRoute><Payment/></ProtectedRoute>}/>
    <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
    <Route path="*" element={<main className="container py-5">Page not found.</main>}/>
  </Routes></>;
}
export default function App() { return <BrowserRouter><Layout/></BrowserRouter>; }
