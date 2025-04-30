import { observer } from 'mobx-react-lite';
import React, {useEffect} from 'react';
import P2pOrdersHistory from '../components/P2pOrdersHistory';
import Navbar from '../components/Navbar/Navbar';
import CustomSelect from '../components/CustomSelect/CustomSelect';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer/Footer';

const OrdersHistory = () => {
    var coinsTo = [
        {label: null, value:"1", name: "Все валюты"},
        {label:"USDT", value:"2", name:"USDT"},
        {label:"USDC", value:"3", name:"USDC"},
        {label:"ETH", value:"4", name:"ETH"},
        {label:"BTC", value:"5", name:"BTC"},
        {label:"BNB", value:"6", name:"BNB"},

    ]

    var type = [
        {label:null, value:"1", name: "Все типы"},
        {label:"BUY", value:"2", name: "Покупка"},
        {label:"SELL", value:"3", name: "Продажа"}
    ]

    var status = [
        {label:"ACTIVE", value:"1", name:"Активен"},
        {label:"COMPLETED", value:"2", name:"Завершен"},
        {label:"IN_PROCESS", value:"3", name:"В процессе"},
        {label:"DISPUTED", value:"4", name:"На обжаловании"},
        {label:"CANCELLED", value:"5", name:"Отменен"},
        {label:"PENDING", value:"6", name:"Ожидание"},

    ]



    return (
        <>
            <div className='container'>
                <Navbar />
                <div className='row history_filters mt-5 pt-5'>
                    <div className="col-3">
                        <p>Валюта</p>
                        <CustomSelect options={coinsTo} size={"full"} paramName="coin"/>
                    </div>
                    <div className="col-3">
                        <p>Тип</p>
                        <CustomSelect options={type} size={"full"} paramName="type"/>
                    </div>
                    <div className="col-3">
                        <p>Статус</p>
                        <CustomSelect options={status} size={"full"} paramName="status"/>
                    </div>
                    <div className="col-3">
                        <p>Дата</p>
                        {/* <CustomSelect  size={"full"}/> */}
                    </div>
                </div>
                <P2pOrdersHistory />
            </div>
            <Footer />
        
        
        
        </>
        )
}

export default observer(OrdersHistory)