import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';

const P2pOrderHistoryItem = ({action, order, placeholder}) => {
    return (
        <tr>
            <th className='history__type placeholder-glow'>
                <span className={`success-color ${placeholder ? "placeholder" : ""}`}>{placeholder ? "Покупка" : (order.type === "BUY" ? "Покупка" : "Продажа")}</span>
                <p className={placeholder ? "placeholder" : ""}>22-04-2025 17:38</p>
            </th>
            <th>
                <span>1</span>
            </th>
            <th>
                <div className='order__volume placeholder-glow'>
                    <p className={`text-color ${placeholder ? "placeholder" : ""}`}>{placeholder ? "1234" : order.amount} {placeholder ? "RUB" : order.currency.name}</p>
                    <div>
                        <p className={`text-color ${placeholder ? "placeholder" : ""}`}>{placeholder ? "123" : order.price} RUB</p>/
                        <p className={`text-color ${placeholder ? "placeholder" : ""}`}>{placeholder ? "USDT" : order.currency.name}</p>
                    </div>
                </div>
            </th>
            <th>
                <div className='d-flex placeholder-glow'>
                    <p className={`text-color m-0 ${placeholder ? "placeholder" : ""}`}>RUB</p>/
                    <p className={`text-color m-0 ${placeholder ? "placeholder" : ""}`}>{placeholder ? "USDT" : order.currency.name}</p>
                </div>
            </th>
            <th className='history__agent placeholder-glow'>
                <div className='d-flex'>
                    <span className={`text-color ${placeholder ? "placeholder" : ""}`}>{placeholder ? "username" : (order.status.value === "PENDING" ? "-" : order.contragentName)}</span>

                </div>
            </th>
            <th>
                {placeholder ? <div className='placeholder p-2 w-100'></div> : <PaymentMethod name={placeholder ? "" : order.status.name} color={order.status.color} className={placeholder ? "placeholder" : ""}/>}

            </th>
        </tr>
    )
}

export default observer(P2pOrderHistoryItem)