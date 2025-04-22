import {observer} from 'mobx-react-lite'
import React, {useState} from 'react';
import ToggleTheme from '../components/ToggleTheme/ToggleTheme'
import { ThemeContext } from '../contexts/ThemeContext'
import { themes } from '../contexts/ThemeContext'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import CustomSelect from '../components/CustomSelect/CustomSelect'
import P2pPricePanel from '../components/P2pPricePanel'
import P2pOrdersList from '../components/P2pOrdersListBuy';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination';

function P2pTrade() {
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const location = useLocation()
    const isSellOrders = location.pathname.includes('/sell');
    const IsPanelOpenHandler = () => {
        setIsPanelOpen(true)
    }

    var coinsTo = [
        {label:"USDT", value:"1"},
        {label:"USDC", value:"2"},
        {label:"ETH", value:"3"},
    ]

    var paymentsMethods = [
        {label:"Все методы", value:"1"},
        {label:"Сбербанк", value:"2"},
        {label:"Т-Банк", value:"3"},
        {label:"АльфаБанк", value:"4"},
        {label:"Райффайзен", value:"5"},
        {label:"ВТБ", value:"6"},
        {label:"QIWI", value:"7"},

    ]


    return (
        <>
            <Navbar />
            <div className='container pt-5'>
                <div className='header__block p-5'>
                    <h1 className='text-center'>P2P-торговля</h1>
                    <p className='pt-3'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium, porro incidunt? Quae, id deserunt fugiat reprehenderit, numquam repellendus tenetur exercitationem modi consequuntur eos vitae accusamus explicabo iste quas perferendis aspernatur.</p>
                </div>
                <div className='orders__list'>
                    <div className='orders__list_header'>
                        <div className='d-flex mb-3'>
                            <Link to="buy" className={`me-3 ${isSellOrders ? "" : "choosen"} p-1 h2`}>Купить</Link>
                            <Link to="sell" className={`p-1 ${isSellOrders ? "choosen" : ""} h2`}>Продать</Link>
                        </div>
                        <hr />
                        <div className='d-flex orders__list_choose'>
                            <CustomSelect options={coinsTo}/>
                            <CustomSelect options={paymentsMethods} size="lg"/>
                            <div className={`pricePanelButton ${isPanelOpen ? "hidden": ""}`}>
                                <button className='select-button' onClick={IsPanelOpenHandler}><i class="bi bi-graph-up"></i></button>
                            </div>
                        </div>
                        <P2pPricePanel 
                            isOpen={isPanelOpen} 
                            onToggle={() => setIsPanelOpen(!isPanelOpen)} 
                        />
                        <Outlet />
                    </div>
                </div>
                <Pagination />



                <div className="howto__block text-center">
                    <h1>Как это работает?</h1>
                    <div className='row mt-5'>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-card-checklist'></i>
                            <h5>Выберите заявку</h5>
                            <p>Покупатель/продавец выставляет условия.</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-currency-exchange'></i>
                            <h5>Совершите сделку</h5>
                            <p>Криптовалюта резервируется, фиат переводится напрямую.</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-check-circle'></i>
                            <h5>Подтвердите оплату</h5>
                            <p>Продавец проверяет поступление денег.</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-coin'></i>
                            <h5>Получите активы</h5>
                            <p>Система разблокирует криптовалюту.</p>
                        </div>
                    </div>
                
                </div>
            </div>



            
            <Footer />
        </>

    )
}

export default observer(P2pTrade);