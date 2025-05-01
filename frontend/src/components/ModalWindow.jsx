import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useContext, useEffect, useState} from "react";
import PaymentMethod from "./PaymentMethod";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";

function ModalWindow({modalShow,setModalShow, action, order}) {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [isChoosen, setIsChoosen] = useState(false)
    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (order !== null) {
            setIsChoosen(true)
        }
        else {
            setIsChoosen(false)
        }
    }, []);

    const createResponseHandler = () => {
        setIsLoading(true)
        const response = store.createResponse(order.id)
        response.then(function(er) {
            setIsLoading(false)
            if (er.success) {
                console.log(er)
                navigate(`/response/${er.responseId}`)
            }
            else {
                console.log("some error: " + er.error)
            }
        })
    }

    return (
        <>
            <Modal
                show={modalShow}
                onHide={handleClose}
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
                                    <span className="success-color">Покупка {order?.currency?.name}</span>
                                ) : (
                                    <span className="danger-color">Продажа {order?.currency?.name}</span>
                                )}
                            </h5>

                            <div className="price-display text-center my-3">
                                <span className="h4">1 {order?.currency?.name} = </span>
                                <span className="h3 fw-bold">{order?.price} RUB</span>
                            </div>
                        </div>

                        {/* Детали сделки */}
                        <div className="deal-details">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-color">Сумма:</span>
                                <span className="fw-bold">
                                    {order?.amount} {order?.currency?.name}
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
                                    {isChoosen ? <div className='placeholder p-2 w-100'></div> : <PaymentMethod name={isChoosen ? "" : order?.paymentMethod?.name} color={order?.paymentMethod?.color} className={isChoosen ? "placeholder" : ""}/>}
                                    {/*{order?.paymentMethod.name} ({order?.paymentDetails.slice(-4)})*/}
                                </span>
                            </div>
                        </div>

                        {/* Предупреждения */}
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
                            variant={order?.type === 'BUY' ? 'success' : 'danger'}
                            onClick={createResponseHandler}
                        >
                            {order?.type === 'BUY' ? 'Купить' : 'Продать'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ModalWindow;