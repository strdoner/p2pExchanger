import React from "react"
import {observer} from "mobx-react-lite";

const DisputeOrderResponseDetails = ({response, status}) => {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-header">
                <h5 className="mb-0 text-color d-flex justify-content-between">
                    Спор
                    <span className="d-flex align-items-center small"><div className="rounded-5 p-1 mx-2" style={{background: status.color, width: 10, height: 10}}></div>{status.name}</span>
                </h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <h6>Детали сделки</h6>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Тип:</span>
                        <span className={`fw-bold ${response.type === 'BUY' ? 'success-color' : 'danger-color'}`}>
                                            {response.type === 'BUY' ? 'Покупка' : 'Продажа'}
                                        </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Сумма:</span>
                        <span className="fw-bold">
                                            {response.amount} {response.currency}
                                        </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="secondary-text-color">Курс:</span>
                        <span className="fw-bold">
                                            1 {response.currency} = {response.price.toLocaleString()} RUB
                                        </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <span className="secondary-text-color">Итоговая сумма:</span>
                        <span className="fw-bold text-primary fs-5">
                                            {(response.amount * response.price).toLocaleString()} RUB
                                        </span>
                    </div>
                    {response?.orderCreatedAt ? (
                        <>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="secondary-text-color">Дата создания объявления:</span>
                                <span className="fw-bold">
                                            {new Date(response.orderCreatedAt).toLocaleString()}
                                        </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="secondary-text-color">Дата начала спора:</span>
                                <span className="fw-bold">
                                            {new Date(response.disputeStartedAt).toLocaleString()}
                                        </span>
                            </div>
                        </>
                    ):(
                        <></>
                    )}
                </div>

                <div className="border-top pt-3">
                    <h6>Метод оплаты</h6>
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
                                            <span className={`fw-bold ${response.paymentMethod.bank.color !== "yellow" ? "text-white": ""}`}>
                                                {response.paymentMethod.bank.name.charAt(0)}
                                            </span>
                        </div>
                        <div>
                            <div className="fw-bold">{response.paymentMethod.bank.name}</div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default observer(DisputeOrderResponseDetails);