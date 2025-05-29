import {observer} from 'mobx-react-lite';
import React from 'react';

const P2pPricePanel = ({isOpen, onToggle}) => {

    return (
        <div className={`price__info ${isOpen ? "d-md-flex" : "hidden"} d-none`}>
            <div className='price__info_pair me-4 d-flex'>
                <span className='align-self-center'>USDT/RUB</span>
            </div>
            <div className='price__info_metrics'>
                <div className='d-flex'>
                    <p>Real Time Price</p>
                    <span>80.5</span>
                </div>
                <div className='d-flex'>
                    <p>24H Change</p>
                    <span className='danger-color'>-0.75%</span>
                </div>
                <div className='d-flex'>
                    <p>High</p>
                    <span>82.5</span>
                </div>
                <div className='d-flex'>
                    <p>Low</p>
                    <span>82.4</span>
                </div>
                <div className='d-flex'>
                    <p>Price chart</p>
                    <span>80</span>
                </div>
            </div>

            <div className='price__info_details d-flex'>
                <a href="" className='align-self-center'>details</a>
                <i className='bi bi-x' onClick={onToggle}></i>
            </div>
        </div>
    )
}

export default observer(P2pPricePanel)