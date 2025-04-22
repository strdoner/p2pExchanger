import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';
import P2pOrderItem from './P2pOrderItem';

const P2pOrderList = () => {
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
                <P2pOrderItem action="sell"/>
                <P2pOrderItem action="sell"/>
                <P2pOrderItem action="sell"/>
                <P2pOrderItem action="sell"/>
                <P2pOrderItem action="sell"/>
            </tbody>
        </table>
    )
}

export default observer(P2pOrderList)