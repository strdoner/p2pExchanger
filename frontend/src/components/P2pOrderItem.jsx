import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';

const P2pOrderItem = ({action, order}) => {
    return (
        <tr>
            <th className='merchant_info'>
                <span>{order.maker.username}</span>
                <div className='d-flex align-items-center'>
                    <div className='online_icon'></div>
                    <p>В сети</p>|
                    <p>169 ордеров</p>|
                    <p>93%</p>|
                    <p>20 мин.</p>
                </div>
            </th>
            <th className='order__price'>
                <span className='h4'>{order.price}</span><span className='ms-1'>RUB</span>
            </th>
            <th>
                <div className='order__volume'>
                    <p className='text-color'>{`${order.amount} ${order.currency}`}</p>
                    <div>
                        <p className='text-color'>{order.minLimit}</p>-
                        <p className='text-color'>{order.maxLimit}</p>
                    </div>
                </div>
            </th>
            <th>
                <PaymentMethod name={order.paymentMethod} color="red"/>
            </th>
            <th>
                <button className={`btn ${action == "buy" ? "btn-success" : "btn-danger"}`}>{action == "buy" ? "Купить": "Продать"}</button>
            </th>
        </tr>
    )
}

export default observer(P2pOrderItem)