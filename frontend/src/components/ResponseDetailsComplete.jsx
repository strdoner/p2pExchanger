import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const ResponseDetailsComplete = ({response, statusHandler, isSell, responseTimer}) => {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [timer, setTimer] = useState(responseTimer);
    const { responseId } = useParams();
    const [isPaid, setIsPaid] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [contragent, setContragent] = useState(null)

    useEffect(() => {
        const ans = store.getUserMinInfo(isSell ? response.taker.id : response.maker.id)
        ans.then(function(er) {
            if (er.success) {
                setContragent(er.content)
            }
            else {
                console.log("some error: " + er.error)
            }
        })
    }, []);





    const handlePaymentConfirm = () => {
        const response = store.confirmResponse(responseId)
        response.then(function(er) {
            if (er.success) {
                setIsPaid(true)
                statusHandler("CONFIRMED")
                console.log("confirmed")
            }
            else {
                console.log("some errors")
            }
        })
    }


    return (
        <div className="card shadow-sm border-success">
            <div className="card-body text-center p-4">
                {/* Большая иконка успеха */}
                <div className="my-4">
                    <div className="bg-success bg-opacity-10 d-inline-flex rounded-circle p-4 completed-operation justify-content-center align-items-center">
                        <i className="bi bi-check-circle-fill success-color fs-1"></i>
                    </div>
                </div>

                <h3 className="mb-3">Сделка завершена успешно!</h3>

                <div className="alert alert-success mx-auto" style={{maxWidth: '400px'}}>
                    <i className="bi bi-check-lg me-2"></i>
                    Средства были успешно переведены
                </div>

                {/* Блок с суммой */}
                <div className="border rounded p-3 mb-4 mx-auto" style={{maxWidth: '400px'}}>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Вы получили:</span>
                        {isSell
                            ? (
                                <span className="fw-bold success-color">
                                    {(response.amount * response.price).toFixed(2)} RUB
                                </span>
                            )
                            : (
                                <span className="fw-bold success-color">
                                    {(response.amount).toFixed(2)} {response.currency}
                                </span>
                            )
                        }

                    </div>
                    <div className="d-flex justify-content-between small secondary-text-color">
                        <span>По курсу:</span>
                        <span>1 {response.currency} = {response.price} RUB</span>
                    </div>
                </div>

                {/* Информация о контрагенте */}
                <div className="border-top pt-3 text-start" style={{maxWidth: '400px'}}>
                    <h6 className="text-start">Контрагент</h6>
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
                </div>

                {/* Кнопки действий */}
                <div className="d-grid gap-2 mx-auto mt-4" style={{maxWidth: '400px'}}>
                    <button className="btn btn-outline-secondary">
                        <i className="bi bi-receipt me-2"></i>
                        Получить квитанцию
                    </button>
                    <Link className="btn btn-primary" to={"/p2p-trade/buy"}>
                        <i className="bi bi-arrow-left me-2"></i>
                        Вернуться к объявлениям
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default observer(ResponseDetailsComplete)