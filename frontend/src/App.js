import WelcomePage from './pages/WelcomePage';
import './styles/style.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import P2pTrade from './pages/p2p-trade';
import Navbar from "./components/Navbar/Navbar";
import P2pOrdersListBuy from './components/P2pOrdersListBuy';
import P2pOrdersListSell from './components/P2pOrdersListSell';
import OrdersHistory from './pages/orders-history';
import Login from './pages/login';
import Register from './pages/register';
import {useContext, useEffect} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import ResponseDetails from "./pages/response-details";
import {connect} from "./websocket/connection";

function App() {
    const {store} = useContext(Context)

    useEffect(() => {
        store.setAuthLoading(true)
        store.checkAuth().then(r => {
            if (r.success) {
                connect('http://localhost:8080/ws')
                    .then(() => {
                        store.setIsWebSocketConnected(true)
                    })
                    .catch(console.error);

            }
        })
    }, [store.id]);

    if (store.id === -2 || (!store.isWebSocketConnected && store.id > 0)) {
        return <div>Loading</div>
    }
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>

                <Route path='/' element={<WelcomePage/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>

                <Route path="/p2p-trade" element={<P2pTrade/>}>
                    <Route index element={<Navigate to="buy" replace/>}/>
                    <Route path="buy" element={<P2pOrdersListBuy/>}/>
                    <Route path="sell" element={<P2pOrdersListSell/>}/>
                </Route>
                <Route path='orders-history' element={<OrdersHistory/>}/>
                <Route path='/response/:responseId' element={<ResponseDetails/>}/>
                {/* <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} /> */}
                {/* <Route path="*" element={<Page404 />} /> */}
            </Routes>

        </BrowserRouter>

    );
}

export default observer(App);
