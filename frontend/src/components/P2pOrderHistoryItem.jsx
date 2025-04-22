import { observer } from 'mobx-react-lite';
import React from 'react';
import PaymentMethod from './PaymentMethod';

const P2pOrderHistoryItem = ({action}) => {
    return (
        <tr>
            <th className='history__type'>
                <span className='success-color'>Покупка</span>
                <p>22-04-2025 17:38</p>
            </th>
            <th>
                <span>1</span>
            </th>
            <th>
                <div className='order__volume'>
                    <p className='text-color'>55.00000 USDT</p>
                    <div>
                        <p className='text-color'>81.40RUB</p>/
                        <p className='text-color'>USDT</p>
                    </div>
                </div>
            </th>
            <th>
                <div className='d-flex'>
                    <p className='text-color m-0'>RUB</p>/
                    <p className='text-color m-0'>USDT</p>
                </div>
            </th>
            <th className='history__agent'>
                <div className='d-flex'>
                    <span className='text-color'>dontstrdoner</span>
                </div>
            </th>
            <th>
                <PaymentMethod color={"green"} name={"Завершено"} /> 
            </th>
        </tr>
    )
}

export default observer(P2pOrderHistoryItem)