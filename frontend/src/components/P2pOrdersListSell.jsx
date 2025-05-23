import {observer} from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import P2pOrderItem from './P2pOrderItem';
import {useSearchParams} from "react-router-dom";
import {Context} from "../index";
import Pagination from "./Pagination";
import ModalWindow from "./ModalWindow";

const P2pOrderList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalShow, setModalShow] = useState(false)
    const {store} = useContext(Context)
    const [order, setOrder] = useState(null)
    const [orders, setOrders] = useState([])

    const handleModalClose = () => {
        setModalShow(false);
        setOrder(null); // Сброс состояния заказа
    };

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const response = await store.getOrders(
                    searchParams.get("coin"),
                    searchParams.get("method"),
                    "SELL",
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


    return (
        <>
            <ModalWindow modalShow={modalShow} setModalShow={setModalShow} action={"SELL"} order={order}
                         onExited={handleModalClose}/>
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
                        <P2pOrderItem action="sell" order={order} key={order.id} modalHandler={setModalShow}
                                      orderHandler={setOrder}/>
                    )
                    : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">
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

export default observer(P2pOrderList)