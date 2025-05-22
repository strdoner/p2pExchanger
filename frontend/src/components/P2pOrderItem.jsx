import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import PaymentMethod from './PaymentMethod';
import {Context} from "../index";

const P2pOrderItem = ({action, order, placeholder, modalHandler, orderHandler}) => {
    const {store} = useContext(Context)

    const deleteOrder = () => {
        const response = store.deleteOrder(order.id)
        response.then((er) => {
            if (er.success) {
                console.log("Удалено")
            }
        })
    }

    return (
        <tr>
            <th className='merchant_info placeholder-glow'>
                <span
                    className={placeholder ? "placeholder" : ""}>{placeholder ? "username" : order.maker.username}</span>
                <div className={`d-flex align-items-center ${placeholder ? "placeholder" : ""}`}>

                    <p className={placeholder ? "placeholder" : ""}>{placeholder ? "999" : order.maker.ordersCount} ордеров</p>|
                    <p className={placeholder ? "placeholder" : ""}>{placeholder ? "99" : order.maker.percentOrdersCompleted}%</p>

                </div>
            </th>
            <th className='order__price placeholder-glow'>
                <div className={placeholder ? "placeholder" : ""}><span
                    className={`h4`}>{placeholder ? "1233" : order.price.toLocaleString()}</span><span
                    className='ms-1'>RUB</span></div>
            </th>
            <th>
                <div className='order__volume placeholder-glow'>
                    <p className={`text-color ${placeholder ? "placeholder" : ""}`}>{`${placeholder ? "2333" : order.amount.toLocaleString()} ${placeholder ? "" : order.currency.shortName}`}</p>
                </div>
            </th>
            <th className='placeholder-glow'>
                {placeholder ? <div className='placeholder p-2 w-100'></div> :
                    <PaymentMethod name={placeholder ? "" : order?.paymentMethod?.name}
                                   color={order?.paymentMethod?.color}
                                   className={placeholder ? "placeholder" : ""}/>

                }

            </th>
            <th>
                <button onClick={() => {
                    if (order.maker.userId !== store.id) {
                        modalHandler(true);
                        orderHandler(order)
                    } else {
                        deleteOrder()
                    }
                }}
                        className={`${store.id < 0 ? "disabled" : ""} btn ${action === "buy" && order?.maker?.userId !== store.id ? "btn-success" : "btn-danger"}`}>
                    {order?.maker?.userId === store.id ? "Удалить" : (action === "buy" ? "Купить" : "Продать")}
                </button>
            </th>
        </tr>
    )
}

export default observer(P2pOrderItem)