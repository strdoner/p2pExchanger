import { observer } from 'mobx-react-lite';
import React, {useContext, useState, useEffect} from 'react';
import PaymentMethod from './PaymentMethod';
import P2pOrderItem from './P2pOrderItem';
import { Context } from '../index.js'
import { useOutletContext } from 'react-router-dom';


const P2pOrderListBuy = () => {
    useEffect(() => {
        updateOrdersList()
    }, []);
    const {store} = useContext(Context)
    const [orders, setOrders] = useState([])
    const [selectedCoin, selectedMethod, selectedPage] = useOutletContext()

    if (store.isLoading) {
        return (
            <div className='charts m-5' style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <div className="spinner-grow text-muted"></div>
            </div>
        );
    }

    const updateOrdersList = () => {
        
        const response = store.getOrders(selectedCoin, selectedMethod, selectedPage);
        response.then(function(data) {
            console.log(data)
            setOrders(data)
        })
    }

    return (
        <table className='order__list'>
            <thead>
                <tr>
                    
                    <th>{selectedCoin}</th>
                    <th>Цена</th>
                    <th>Доступно|Лимиты</th>
                    <th>Платежные методы</th>
                    <th>Действие</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => 
                    <P2pOrderItem action="buy" order={order} key={order.id}/>
                )}
            </tbody>
        </table>
    )
}

export default observer(P2pOrderListBuy)