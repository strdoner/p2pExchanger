import {observer} from 'mobx-react-lite'
import React, {useState, useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import CustomSelect from '../components/CustomSelect/CustomSelect'
import P2pPricePanel from '../components/P2pPricePanel'
import { Link, Outlet, useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination';

function P2pTrade() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const location = useLocation()
    const isSellOrders = location.pathname.includes('/sell');
    const IsPanelOpenHandler = () => {
        setIsPanelOpen(true)
    }
    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
            if (searchParams.get("coin") === null) {
                newSearchParams.set("coin", "USDT");
            }
            if (searchParams.get("method") === null) {
                newSearchParams.set("method", "Все методы");
            }
            // newSearchParams.set("method", "USDT");
            setSearchParams(newSearchParams);
    
    }, [])

    useEffect(() => {
        // Если путь точно /p2p-trade (без подмаршрутов)
        if (location.pathname === '/p2p-trade') {
            navigate('buy', { replace: true });
        }
    }, []);
    
    var coinsTo = [
        {label:"USDT", value:"1", name:"USDT"},
        {label:"USDC", value:"2", name:"USDC"},
        {label:"ETH", value:"3", name:"ETH"},
        {label:"BTC", value:"4", name:"BTC"},
        {label:"BNB", value:"5", name:"BNB"},

    ]

    var paymentsMethods = [
        {label:"Все методы", value:"1", name:"Все методы"},
        {label:"Сбербанк", value:"2", name:"Сбербанк"},
        {label:"Т-Банк", value:"3", name:"Т-Банк"},
        {label:"АльфаБанк", value:"4", name:"АльфаБанк"},
        {label:"Райффайзен", value:"5", name:"Райффайзен"},
        {label:"ВТБ", value:"6", name:"ВТБ"},

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
                            <CustomSelect options={coinsTo} paramName="coin"/>
                            <CustomSelect options={paymentsMethods} size="lg" paramName="method"/>
                            <div className={`pricePanelButton ${isPanelOpen ? "hidden": ""}`}>
                                <button className='select-button' onClick={IsPanelOpenHandler}><i class="bi bi-graph-up"></i></button>
                            </div>
                        </div>
                        <P2pPricePanel value="asdf"
                            isOpen={isPanelOpen} 
                            onToggle={() => setIsPanelOpen(!isPanelOpen)} 
                        />
                        <Outlet />
                    </div>
                </div>



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