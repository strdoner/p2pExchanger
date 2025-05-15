import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useContext, useEffect, useState} from "react";
import PaymentMethod from "./PaymentMethod";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import PaymentMethodSelect from "./CustomSelect/PaymentMethodSelect";

function ModalWindow({modalShow, setModalShow, action, order}) {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [isChoosen, setIsChoosen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState({})
    const [isPaymentMethodsLoaded, setIsPaymentMethodsLoaded] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState()
    const handleClose = () => {
        console.log("qwe")
        setModalShow(false)
    };
    const handleShow = () => setModalShow(true);
    const [error, setError] = useState("")

    useEffect(() => {
        if (order !== null) {
            setIsChoosen(true)
        } else {
            setIsChoosen(false)
        }
        if (order?.paymentMethod && action === "SELL") {
            const response = store.getPaymentMethods(order?.paymentMethod?.id)
            response.then((er) => {
                if (er.success) {
                    setPaymentMethods(er.content)
                    setIsPaymentMethodsLoaded(true)
                }
            })
        }
    }, [order]);

    const createResponseHandler = async (e) => {
        e.preventDefault()
        try {
            console.log(paymentMethod)
            const response = await store.createResponse(order.id, paymentMethod);
            if (response.success) {
                navigate(`/response/${response.responseId}`);
            } else {
                setError(response.error || "Произошла ошибка");
            }
        } catch (err) {
            setError("Ошибка сети или сервера");
            console.error("Error creating response:", err);
        } finally {
            setIsLoading(false); // Разблокируем кнопку
        }
    }

    return (
        <>
            <Modal
                show={modalShow}
                onHide={isLoading ? null : handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {action === 'BUY' ? 'Подтверждение покупки' : 'Подтверждение продажи'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="deal-confirmation">
                        {/* Основная информация */}
                        <div className="deal-summary mb-4">
                            <h5 className="text-center">
                                {action === 'BUY' ? (
                                    <span className="success-color">Покупка {order?.currency?.shortName}</span>
                                ) : (
                                    <span className="danger-color">Продажа {order?.currency?.shortName}</span>
                                )}
                            </h5>

                            <div className="price-display text-center my-3">
                                <span className="h4">1 {order?.currency?.shortName} = </span>
                                <span className="h3 fw-bold">{order?.price} RUB</span>
                            </div>
                        </div>

                        {/* Детали сделки */}
                        <div className="deal-details">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-color">Сумма:</span>
                                <span className="fw-bold">
                                    {order?.amount} {order?.currency?.shortName}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-color">К оплате:</span>
                                <span className="fw-bold">
                                    {order?.amount * order?.price} RUB
                                </span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-color">Способ оплаты:</span>
                                <span className="fw-bold">
                                    {action === 'SELL' ? (
                                        order?.paymentMethod && isPaymentMethodsLoaded ? (
                                            (Object.keys(paymentMethods).length !== 0
                                                    ? <PaymentMethodSelect
                                                        setOption={setPaymentMethod}
                                                        options={paymentMethods}/>
                                                    : <div className="danger-color">У вас нет подходящих методов</div>
                                            )


                                        ) : (
                                            <div className='placeholder p-2 w-100'></div>
                                        )
                                    ) : (
                                        order?.paymentMethod ? (
                                            <PaymentMethod
                                                name={order?.paymentMethod?.name}
                                                color={order?.paymentMethod?.color}
                                            />
                                        ) : (
                                            <div className='placeholder p-2 w-100'></div>
                                        )
                                    )}
                                </span>
                            </div>
                        </div>
                        {action === 'BUY' ? (
                                <div className="alert alert-warning mt-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <span>Продавец ожидает оплату в течение 15 минут</span>
                                    </div>
                                    <div className="d-flex align-items-center mt-2">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <span>Переводите только на указанные реквизиты</span>
                                    </div>
                                </div>
                            )
                            : (
                                <div className="alert alert-warning mt-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <span>Переводите деньги только после получения оплаты от покупателя.</span>
                                    </div>
                                    <div className="d-flex align-items-center mt-2">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <span>Не доверяйте скриншотам — проверяйте поступления в своём банке или платёжной системе.</span>
                                    </div>
                                    <div className="d-flex align-items-center mt-2">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <span>Общайтесь только через чат обменника — это защитит вас в случае спора.</span>
                                    </div>
                                </div>

                            )

                        }
                        <div className="alert alert-info">
                            <span
                                className="fw-bolder">Комментарий {action === "SELL" ? "Покупателя" : "Продавца"}
                            </span>
                            <div></div>
                            <span>{order?.paymentDetails}</span>
                        </div>
                        <div className="danger-color">{error}</div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <div className="seller-info">
                        <span className="text-color">Продавец:</span>
                        <span className="ms-2 fw-bold">
                            {order?.maker.username} | {order?.maker.percentOrdersCompleted}%
                        </span>
                    </div>

                    <div>
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Отменить
                        </Button>
                        <Button
                            className={isLoading ? "disabled" : ""}
                            variant={action === 'BUY' ? 'success' : 'danger'}
                            onClick={(e) => {
                                createResponseHandler(e)
                            }}
                        >
                            {action === 'BUY' ? 'Купить' : 'Продать'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalWindow;