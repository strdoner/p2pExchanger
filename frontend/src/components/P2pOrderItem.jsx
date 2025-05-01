import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';

const P2pOrderItem = ({action, order, placeholder, modalHandler, orderHandler}) => {
    return (
        <tr>
            <th className='merchant_info placeholder-glow'>
                <span className={placeholder ? "placeholder" : ""}>{placeholder ? "username" : order.maker.username}</span>
                <div className={`d-flex align-items-center ${placeholder ? "placeholder" : ""}`}>
                    <div className='online_icon'></div>
                    <p className={placeholder ? "placeholder" : ""}>В сети</p>|
                    <p className={placeholder ? "placeholder" : ""}>{placeholder ? "999" : order.maker.ordersCount} ордеров</p>|
                    <p className={placeholder ? "placeholder" : ""}>{placeholder ? "99" : order.maker.percentOrdersCompleted}%</p>|
                    <p className={placeholder ? "placeholder" : ""}>20 мин.</p>
                </div>
            </th>
            <th className='order__price placeholder-glow'>
                <div className={placeholder ? "placeholder" : ""}><span className={`h4`}>{placeholder ? "1233" : order.price}</span><span className='ms-1'>RUB</span></div>
            </th>
            <th>
                <div className='order__volume placeholder-glow'>
                    <p className={`text-color ${placeholder ? "placeholder" : ""}`}>{`${placeholder ? "2333" : order.amount} ${placeholder ? "" : order.currency.name}`}</p>
                </div>
            </th>
            <th className='placeholder-glow'>
                {placeholder ? <div className='placeholder p-2 w-100'></div> : <PaymentMethod name={placeholder ? "" : order.paymentMethod.name} color={order.paymentMethod.color} className={placeholder ? "placeholder" : ""}/>}
                
            </th>
            <th>
                <button onClick={() => {modalHandler(true); orderHandler(order)}} className={`btn ${action === "buy" ? "btn-success" : "btn-danger"}`}>{action === "buy" ? "Купить": "Продать"}</button>
            </th>
        </tr>
    )
}

export default observer(P2pOrderItem)