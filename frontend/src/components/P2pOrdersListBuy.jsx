import { observer } from 'mobx-react-lite';
import React, {useContext, useState, useEffect} from 'react';
import PaymentMethod from './PaymentMethod';
import P2pOrderItem from './P2pOrderItem';
import { Context } from '../index.js'
import { useOutletContext, useSearchParams } from 'react-router-dom';
import Pagination from './Pagination.jsx';


const P2pOrderListBuy = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCoin = searchParams.get("coin")
    const selectedMethod = searchParams.get("method")
    const selectedPage = searchParams.get("page") === null ? 1 : searchParams.get("page")
    const {store} = useContext(Context)
    const [orders, setOrders] = useState([])
    
    useEffect(() => {
        console.log("sdf")
        updateOrdersList()
    }, [selectedCoin, selectedMethod, selectedPage]);
    
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
    const updateOrdersList = () => {
        const selectedCoin = searchParams.get("coin")
        const selectedMethod = searchParams.get("method")
        console.log(selectedMethod)
        const selectedPage = searchParams.get("page") === null ? 1 : searchParams.get("page")
        const response = store.getOrders(selectedCoin, selectedMethod, selectedPage - 1);
        response.then(function(data) {
            console.log(data)
            setOrders(data)
        })
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
                        <P2pOrderItem action="buy" order={order} key={order.id}/>
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

export default observer(P2pOrderListBuy)