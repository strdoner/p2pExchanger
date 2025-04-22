import { observer } from 'mobx-react-lite';
import React from 'react';

const PaymentMethod = ({name, color}) => {
    return (
        <div className='payment__method d-flex align-items-center gap-2'>
            <div className='payment__method_icon' style={{backgroundColor: color}}></div>
            <div>
                <p className='m-0 text'>{name}</p>
            </div>
        </div>
    )
}

export default observer(PaymentMethod)