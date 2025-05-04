import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';
import {Link} from "react-router-dom";

const P2pOrderHistoryItem = ({action, order, placeholder}) => {
    return (
        <tr>
            <th className='history__type placeholder-glow'>
                <span className={`${action === 'BUY' ? "success-color" : "danger-color"} ${placeholder ? "placeholder" : ""}`}>{placeholder ? "Покупка" : (order.type === "BUY" ? "Покупка" : "Продажа")}</span>
                <p className={placeholder ? "placeholder" : ""}>{order?.createdAt}</p>
            </th>
            <th>
                <span>{order?.responseId === -1 ? "-": order?.responseId}</span>
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
            <th>
                {order?.responseId !== -1
                    ?<Link className="link-style" to={`/response/${order?.responseId}`}>Ссылка</Link>
                    :<div></div>

                }
            </th>
        </tr>
    )
}

export default observer(P2pOrderHistoryItem)