import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import PaymentMethod from './PaymentMethod';
import P2pOrderItem from './P2pOrderItem';
import {useSearchParams} from "react-router-dom";
import {Context} from "../index";
import Pagination from "./Pagination";

const P2pOrderList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const {store} = useContext(Context)

    const [orders, setOrders] = useState([])

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

        fetchOrders();
    }, [searchParams, store]);

    if (store.isLoading) {
        return (
            <table className='order__list'>
                <thead>
                <tr>

                    <th>Пользователь</th>
                    <th>Цена</th>
                    <th>Доступно|Лимиты</th>
                    <th>Платежные методы</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                <P2pOrderItem placeholder={true} />
                <P2pOrderItem placeholder={true} />
                <P2pOrderItem placeholder={true} />
                <P2pOrderItem placeholder={true} />
                <P2pOrderItem placeholder={true} />
                </tbody>
            </table>
        );
    }



    return (
        <>
            <table className='order__list'>
                <thead>
                <tr>

                    <th>Пользователь</th>
                    <th>Цена</th>
                    <th>Доступно|Лимиты</th>
                    <th>Платежные методы</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {!orders?.empty ? orders?.content?.map(order =>
                        <P2pOrderItem action="sell" order={order} key={order.id}/>
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