import {observer} from 'mobx-react-lite';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import P2pOrderHistoryItem from './P2pOrderHistoryItem';
import {Context} from "../index";
import {useSearchParams} from "react-router-dom";
import Pagination from "./Pagination";

const P2pOrdersHistory = () => {
    const {store} = useContext(Context)
    const [orders, setOrders] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false)
    let counter = 0;

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
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
            setOrders({empty: true}); // Устанавливаем empty при ошибке
        } finally {
            setIsLoading(false);
        }
    }, [store, searchParams]);

    useEffect(() => {
        const page = searchParams.get("page");
        const status = searchParams.get("status");
        const coin = searchParams.get("coin");
        const type = searchParams.get("type");

        fetchOrders();
    }, [fetchOrders, searchParams]);


    if (isLoading || orders === null) {
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
                <tr>
                    <td colSpan="7" className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </td>
                </tr>
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
                            <td colSpan="7" className="text-center py-4">
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