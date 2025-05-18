import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const ResponseDetailsWaiting = ({response, statusHandler, responseTimer}) => {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [timer, setTimer] = useState(responseTimer);
    const { responseId } = useParams();
    const [isPaid, setIsPaid] = useState(false)

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleCancelOrder = () => {
        const response = store.cancelResponse(responseId)
        response.then(function(er) {
            if (er.success) {
                navigate('/p2p-trade')
            }
            else {
                console.log("some errors")
            }
        })
    }

    const handlePaymentConfirm = () => {
        const response = store.confirmResponse(responseId)
        response.then(function(er) {
            if (er.success) {
                setIsPaid(true)
                statusHandler("CONFIRMATION")
                console.log("confirmed")
            }
            else {
                console.log("some errors")
            }
        })
    }

    const formatCard = (card) => {
        let out = card.substring(0, 4) + " " + card.substring(4, 8) + " " + card.substring(8, 12) + " " + card.substring(12, 16)
        return out
    }

    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="mb-0 text-color">
                    Ожидание оплаты от покупателя
                </h5>
            </div>
            <div className="card-body">
                <div className="alert alert-info d-flex align-items-center">
                    <i className="bi bi-hourglass-split fs-4 me-2"></i>
                    <div>
                        <strong>Ожидаем поступление средств:</strong> {formatTime(timer)}
                        <div className="small">Покупатель должен оплатить в течение этого времени</div>
                    </div>
                </div>

                <div className="mb-3">
                    <h6>Детали сделки</h6>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Количество криптовалюты:</span>
                        <span className="fw-bold">
                    {response.amount.toLocaleString()} {response.currency}
                </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Курс:</span>
                        <span className="fw-bold">
                    1 {response.currency} = {response.price.toLocaleString()} RUB
                </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <span className="secondary-text-color">Итого к оплате покупателя:</span>
                        <span className="fw-bold text-primary fs-5">
                    {(response.amount * response.price).toLocaleString()} RUB
                </span>
                    </div>
                </div>

                <div className="border-top pt-3">
                    <h6>Ваши реквизиты</h6>
                    <div className="d-flex align-items-center mb-3">
                        <div
                            className="rounded-circle me-2"
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: response.paymentMethod.bank.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                    <span className="fw-bold text-white">
                        {response.paymentMethod.bank.name.charAt(0)}
                    </span>
                        </div>
                        <div>
                            <div className="fw-bold">{response.paymentMethod.bank.name}</div>
                            <div className="secondary-text-color small">
                                {formatCard(response.paymentMethod.details)}
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-warning small">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        После поступления средств на ваш счет, подтвердите получение платежа
                    </div>


                </div>
            </div>
            <div className="card-footer bg-light d-flex justify-content-between">
                <button
                    className="btn btn-outline-danger"
                    onClick={handleCancelOrder}
                >
                    Отменить сделку
                </button>

            </div>
        </div>
    )
}

export default observer(ResponseDetailsWaiting)