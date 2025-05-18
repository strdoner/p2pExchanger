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
import WalletPage from "./pages/wallet-page";
import UserProfile from "./pages/user-profile";
import PrivateRoute from "./pages/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import DisputsPage from "./pages/disputes-page";
import DisputeDetails from "./pages/dispute-details";

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
                <Route path='/user/:userId' element={<UserProfile/>}/>
                <Route path="/wallet" element={<PrivateRoute/>}>
                    <Route path="" element={<WalletPage/>}/>
                </Route>
                <Route path="/disputes" element={<AdminRoute/>}>
                    <Route path="" element={<DisputsPage/>}/>
                </Route>
                <Route path="/response/:responseId" element={<PrivateRoute/>}>
                    <Route path="" element={<ResponseDetails/>}/>
                </Route>
                <Route path="/dispute/:disputeId" element={<AdminRoute/>}>
                    <Route path="" element={<DisputeDetails/>}/>
                </Route>


                <Route path="orders-history" element={<PrivateRoute/>}>
                    <Route path="" element={<OrdersHistory/>}/>
                </Route>
                {/* <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} /> */}
                {/* <Route path="*" element={<Page404 />} /> */}
            </Routes>

        </BrowserRouter>

    );
}

export default observer(App);
