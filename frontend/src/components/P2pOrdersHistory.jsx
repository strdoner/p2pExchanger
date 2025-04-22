import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';
import P2pOrderItem from './P2pOrderItem';
import Navbar from './Navbar/Navbar';
import P2pOrderHistoryItem from './P2pOrderHistoryItem';

const P2pOrdersHistory = () => {
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
                    </tr>
                </thead>
                <tbody>
                    <P2pOrderHistoryItem />
                    <P2pOrderHistoryItem />
                    <P2pOrderHistoryItem />
                    <P2pOrderHistoryItem />
                    <P2pOrderHistoryItem />
                </tbody>
            </table>
        </>
    )
}

export default observer(P2pOrdersHistory)