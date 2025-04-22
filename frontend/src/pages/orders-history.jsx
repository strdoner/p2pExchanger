import { observer } from 'mobx-react-lite';
import React from 'react';
import P2pOrdersHistory from '../components/P2pOrdersHistory';
import Navbar from '../components/Navbar/Navbar';
import CustomSelect from '../components/CustomSelect/CustomSelect';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer/Footer';

const OrdersHistory = () => {
    var coinsTo = [
        {label:"USDT", value:"1"},
        {label:"USDC", value:"2"},
        {label:"ETH", value:"3"},
    ]

    var type = [
        {label:"Покупка", value:"1"},
        {label:"Продажа", value:"2"}
    ]

    var status = [
        {label:"Завершено", value:"1"},
        {label:"В процессе", value:"2"},
        {label:"Подана апелляция", value:"3"},
        {label:"Отклонено", value:"4"}

    ]

    return (
        <>
            <div className='container'>
                <Navbar />
                <div className='row history_filters mt-5 pt-5'>
                    <div className="col-3">
                        <p>Валюта</p>
                        <CustomSelect options={coinsTo} size={"full"}/>
                    </div>
                    <div className="col-3">
                        <p>Тип</p>
                        <CustomSelect options={type} size={"full"}/>
                    </div>
                    <div className="col-3">
                        <p>Статус</p>
                        <CustomSelect options={status} size={"full"}/>
                    </div>
                    <div className="col-3">
                        <p>Дата</p>
                        {/* <CustomSelect  size={"full"}/> */}
                    </div>
                </div>
                <P2pOrdersHistory />
                <Pagination />
            </div>
            <Footer />
        
        
        
        </>
        )
}

export default observer(OrdersHistory)