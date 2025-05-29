import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const ResponseDetailsConfirmationTaker = ({response, statusHandler, responseTimer}) => {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [timer, setTimer] = useState(responseTimer);
    const {responseId} = useParams();
    const [isPaid, setIsPaid] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [contragent, setContragent] = useState(null)

    useEffect(() => {
        const ans = store.getUserMinInfo(response.maker.id)
        ans.then(function (er) {
            if (er.success) {
                setContragent(er.content)
            } else {
                console.log("some error: " + er.error)
            }
        })
    }, []);

    const handleCancelOrder = () => {
        const response = store.cancelResponse(responseId)
        response.then(function (er) {
            if (er.success) {
                navigate('/p2p-trade/buy?coin=USDT')
            } else {
                console.log("some errors")
            }
        })
    }

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


    const handlePaymentConfirm = () => {
        const response = store.confirmResponse(responseId)
        response.then(function (er) {
            if (er.success) {
                setIsPaid(true)
                statusHandler("CONFIRMED")
                console.log("confirmed")
            } else {
                console.log("some errors")
            }
        })
    }


    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="mb-0 text-color">
                    Ожидание подтверждения от продавца
                </h5>
            </div>
            <div className="card-body">
                {/*<div className="progress mb-4" style={{ height: '10px' }}>*/}
                {/*    <div*/}
                {/*        className="progress-bar progress-bar-striped progress-bar-animated bg-primary"*/}
                {/*        style={{ width: '75%' }}*/}
                {/*    ></div>*/}
                {/*</div>*/}
                <div className="alert alert-info d-flex align-items-center">
                    <i className="bi bi-hourglass-split fs-4 me-2"></i>
                    <div>
                        <strong>Статус сделки:</strong> Ожидание подтверждения
                        <div className="small">Продавец проверяет поступление средств</div>
                    </div>
                </div>


                <div className="mb-3">
                    <h6>Детали сделки</h6>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Сумма:</span>
                        <span className="fw-bold">
                    {response.amount} {response.currency}
                </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Курс:</span>
                        <span className="fw-bold">
                    1 {response.currency} = {response.price} RUB
                </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <span className="secondary-text-color">Итого:</span>
                        <span className="fw-bold text-primary fs-5">
                    {(response.amount * response.price).toFixed(2)} RUB
                </span>
                    </div>
                </div>

                <div className="border-top pt-3">
                    <h6>Продавец</h6>
                    <div className="d-flex align-items-center mb-3">
                        <div
                            className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                            style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-person-fill text-white fs-5"></i>
                        </div>
                        <div className={"placeholder-glow"}>
                            <div
                                className={`fw-bold ${contragent !== null ? "" : "placeholder"}`}>{contragent !== null ? contragent.username : "username"}</div>
                            <div></div>
                            <div className={`secondary-text-color small ${contragent !== null ? "" : "placeholder"}`}>
                                {contragent !== null ? contragent.percentOrdersCompleted : "4"}%
                                | {contragent !== null ? contragent.ordersCount : "122"} сделок
                            </div>
                        </div>
                    </div>

                    <div className="row text-center mb-3">
                        <div className="col">
                            <div className="fw-bold">Время ожидания</div>
                            <div className="text-primary fs-4">{formatTime(timer)}</div>
                        </div>
                    </div>

                    <div className="alert alert-warning small">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Не закрывайте эту страницу!</strong> При возникновении проблем используйте чат с
                        продавцом
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default observer(ResponseDetailsConfirmationTaker)