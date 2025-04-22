import WelcomePage from './pages/WelcomePage';
import './styles/style.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import {Route, BrowserRouter, Routes, Navigate} from "react-router-dom"
import P2pTrade from './pages/p2p-trade';
import P2pOrdersListBuy from './components/P2pOrdersListBuy';
import P2pOrdersListSell from './components/P2pOrdersListSell';
import OrdersHistory from './pages/orders-history';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<WelcomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path="p2p-trade" element={<P2pTrade />}>
        <Route path="buy" element={<P2pOrdersListBuy />} />
        <Route path="sell" element={<P2pOrdersListSell />} />
        <Route index element={<Navigate to="buy" />} />
      </Route>
      <Route path='orders-history' element={<OrdersHistory />} />
      {/* <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} /> */}
      {/* <Route path="*" element={<Page404 />} /> */}
    </Routes>

  </BrowserRouter>

  );
}

export default App;
