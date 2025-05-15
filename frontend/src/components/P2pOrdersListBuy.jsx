import {observer} from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import P2pOrderItem from './P2pOrderItem';
import {Context} from '../index.js'
import {useSearchParams} from 'react-router-dom';
import Pagination from './Pagination.jsx';
import ModalWindow from "./ModalWindow";


const P2pOrdersListBuy = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalShow, setModalShow] = useState(false)
    const {store} = useContext(Context)
    const [order, setOrder] = useState(null)
    const [orders, setOrders] = useState([])

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const response = await store.getOrders(
                    searchParams.get("coin"),
                    searchParams.get("method"),
                    "BUY",
                    searchParams.get("page") === null ? 0 : Number(searchParams.get("page")) - 1
                );
                setOrders(response);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        const timer = setInterval(fetchOrders, 4000);

        fetchOrders();
        return () => {
            clearInterval(timer);
        };
    }, [searchParams, store]);


    if (store.isLoading) {
        return (
            <table className='order__list'>
                <thead>
                <tr>

                    <th>Пользователь</th>
                    <th>Цена</th>
                    <th>Количество</th>
                    <th>Платежный метод</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="5" className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </td>
                </tr>

                {/*<P2pOrderItem placeholder={true}/>*/}
                </tbody>
            </table>
        );
    }


    return (
        <>
            <ModalWindow modalShow={modalShow} setModalShow={setModalShow} action={"BUY"} order={order}/>
            <table className='order__list'>
                <thead>
                <tr>

                    <th>Пользователь</th>
                    <th>Цена</th>
                    <th>Количество</th>
                    <th>Платежный метод</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {!orders?.empty ? orders?.content?.map(order =>
                        <P2pOrderItem action="buy" order={order} key={order.id} modalHandler={setModalShow}
                                      orderHandler={setOrder}/>
                    )
                    : (
                        <tr>
                            <td colSpan="5" className="text-center py-4" style={{height: 20}}>
                                Нет доступных ордеров
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>

            {orders?.totalPages > 1 && (
                <Pagination
                    isFirst={orders.first}
                    isLast={orders.last}
                    totalPages={orders.totalPages}
                />
            )}
        </>

    )
}

export default observer(P2pOrdersListBuy)