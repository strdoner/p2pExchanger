import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const ResponseDetailsConfirmationMaker = ({response, statusHandler}) => {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [timer, setTimer] = useState(900);
    const { responseId } = useParams();
    const [contragent, setContragent] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)

    useEffect(() => {
        const ans = store.getUserMinInfo(response.taker.id)
        ans.then(function(er) {
            if (er.success) {
                setContragent(er.content)

            }
            else {
                console.log("some error: " + er.error)
            }
        })
    }, []);

    const handleDispute = () => {

    }

    const handleConfirmPayment = () => {
        const ans = store.completeResponse(responseId)
        ans.then(function(er) {
            if (er.success) {
                statusHandler("COMPLETED")
                console.log("completed")
            }
            else {
                console.log("some error: " + er.error)
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




    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="mb-0">
                    Подтверждение получения средств
                </h5>
            </div>
            <div className="card-body">
                <div className="alert alert-info d-flex align-items-center">
                    <i className="bi bi-clock-history fs-4 me-2"></i>
                    <div>
                        <div className="d-flex align-items-center">
                            <strong className="me-2">Ожидает подтверждения:</strong>
                            <span className="fw-bold danger-color">
                        {formatTime(timer)}
                    </span>
                        </div>
                        <div className="small">Покупатель ожидает вашего подтверждения</div>
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
                        <span className="secondary-text-color">Итого получено:</span>
                        <span className="fw-bold success-color fs-5">
                    {(response.amount * response.price).toFixed(2)} RUB
                </span>
                    </div>
                </div>

                <div className="border-top pt-3">
                    <h6>Покупатель</h6>
                    <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                             style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person-fill text-white fs-5"></i>
                        </div>
                        <div className={"placeholder-glow"}>
                            <div className={`fw-bold ${contragent !== null ? "" : "placeholder"}`}>{contragent !== null ? contragent.username : "username"}</div>
                            <div></div>
                            <div className={`secondary-text-color small ${contragent !== null ? "" : "placeholder"}`}>
                                 {contragent !== null ? contragent.percentOrdersCompleted : "4"}% | {contragent !== null ? contragent.ordersCount : "122"} сделок
                            </div>
                        </div>
                    </div>

                    <div className="border-top pt-3">
                        <h6>Подтверждение платежа</h6>
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="confirmCheck"
                                checked={isConfirmed}
                                onChange={(e) => setIsConfirmed(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="confirmCheck">
                                Я подтверждаю получение {response.amount * response.price} RUB на счет
                            </label>
                        </div>
                    </div>

                    <div className="alert alert-warning small">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Подтверждайте сделку только после проверки поступления средств.
                    </div>
                </div>
            </div>
            <div className="card-footer bg-light d-flex justify-content-between">
                <button
                    className="btn btn-outline-danger"
                    onClick={handleDispute}
                >
                    <i className="bi bi-flag me-2"></i>
                    Оспорить
                </button>
                <button
                    className={`btn ${isConfirmed ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={handleConfirmPayment}
                    disabled={!isConfirmed || isConfirming}
                >
                    {isConfirming ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Подтверждаю...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-circle me-2"></i>
                            Подтвердить получение
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default observer(ResponseDetailsConfirmationMaker)