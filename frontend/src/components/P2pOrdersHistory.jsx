import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import PaymentMethod from './PaymentMethod';
import P2pOrderItem from './P2pOrderItem';
import Navbar from './Navbar/Navbar';
import P2pOrderHistoryItem from './P2pOrderHistoryItem';
import {Context} from "../index";
import {useSearchParams} from "react-router-dom";
import Pagination from "./Pagination";

const P2pOrdersHistory = () => {
    const {store} = useContext(Context)
    const [orders, setOrders] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    let counter = 0;
    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const response = await store.getUserOrders(
                    store.id,
                    searchParams.get("status"),
                    searchParams.get("coin"),
                    searchParams.get("type"),
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

                    <th>Тип/Дата</th>
                    <th>Номер операции</th>
                    <th>Количество/Цена</th>
                    <th>Фиат/Криптовалюта</th>
                    <th>Контрагент</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                <P2pOrderHistoryItem placeholder={true} />
                <P2pOrderHistoryItem placeholder={true} />
                <P2pOrderHistoryItem placeholder={true} />
                <P2pOrderHistoryItem placeholder={true} />
                <P2pOrderHistoryItem placeholder={true} />
                </tbody>
            </table>
        );
    }
    return (
        <>
            <table className='order__list'>
                <thead>
                    <tr>
                        <th>Тип/Дата</th>
                        <th>Номер операции</th>
                        <th>Количество/Цена</th>
                        <th>Фиат/Криптовалюта</th>
                        <th>Контрагент</th>
                        <th>Статус</th>
                        <th>Ссылка</th>
                    </tr>
                </thead>
                <tbody>
                    {!orders?.empty ? orders?.content?.map(order =>
                            <P2pOrderHistoryItem action={order.type} order={order} key={counter++}/>
                        )
                        : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Ваша история пуста
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

export default observer(P2pOrdersHistory)