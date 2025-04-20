import WelcomePage from './pages/WelcomePage';
import './styles/style.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import {Route, BrowserRouter, Routes} from "react-router-dom"
import P2pTrade from './pages/p2p-trade';

function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<WelcomePage />} />
      <Route path='/p2p-trade' element={<P2pTrade />} />
      {/* <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} /> */}
      {/* <Route path="*" element={<Page404 />} /> */}
    </Routes>

  </BrowserRouter>

  );
}

export default App;
