import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import CustomFormSelect from "./CustomSelect/CustomFormSelect";

function ModalWindowNewOrderBuy({modalShow, setModalShow, action}) {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [isChoosen, setIsChoosen] = useState(false)
    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);
    const [isOrderCreating, setIsOrderCreating] = useState(false)
    const [order, setOrder] = useState({
        currency: "USDT",
        price: 0,
        amount: 0,
        preferredBank: 1,
        paymentDetails: ""
    })
    const [coin, setCoin] = useState("USDT")

    var banks = [
        {label: "Сбербанк", value: "1", name: "Сбербанк"},
        {label: "Т-Банк", value: "2", name: "Т-Банк"},
        {label: "АльфаБанк", value: "3", name: "АльфаБанк"},
        {label: "Райффайзен", value: "4", name: "Райффайзен"},
        {label: "ВТБ", value: "5", name: "ВТБ"},

    ]

    const [preferredBank, setPreferredBank] = useState(banks[0].label)
    const [error, setError] = useState("")

    useEffect(() => {
        setOrder({...order, currency: coin, preferredBank: preferredBank})
    }, [coin, preferredBank]);


    const createOrderHandler = () => {
        setError(null)
        if (!isValid(order)) {
            return;
        }
        setIsOrderCreating(true)
        const response = store.createOrder({...order, type: action})
        response.then(function (er) {
            setIsOrderCreating(false)
            if (er.success) {
                console.log(er)
                // window.location.reload();
            } else {
                setError(er.error)
                console.log("error while creating order: " + er.error)
            }
        })
    }

    const isValid = (order) => {
        if (order.price < 1) {
            setError("Укажите корректную цену")
            return false
        }
        if (order.amount < 1) {
            setError("Укажите корректное количество")
            return false
        }

        if (order.paymentDetails > 500) {
            setError("Комментарий слишком длинный. Максимальная длина - 500 символов")
            return false
        }
        return true
    }

    var coinsTo = [
        {label: "USDT", value: "1", name: "USDT"},
        {label: "USDC", value: "2", name: "USDC"},
        {label: "ETH", value: "3", name: "ETH"},
        {label: "BTC", value: "4", name: "BTC"},
        {label: "BNB", value: "5", name: "BNB"},
    ]


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
                        {action === 'BUY' ? 'Создание объявления на покупку' : 'Создание объявления на продажу'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="deal-confirmation">
                        <div className="mb-3">
                            <label htmlFor="currency" className="form-label">Криптовалюта</label>
                            <CustomFormSelect options={coinsTo} size={"full"} setOption={setCoin} initialValue={coin}
                                              hasIcon={true}/>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="price" className="form-label">Цена за 1 ед., RUB</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        placeholder="0.00"
                                        step="0.01"
                                        onChange={(e) => setOrder({...order, price: e.target.value})}
                                    />
                                    <span className="input-group-text">RUB</span>
                                </div>

                            </div>

                            <div className="col-md-6">
                                <label htmlFor="amount" className="form-label">Количество</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="amount"
                                        placeholder="0.00"
                                        step="0.0001"
                                        onChange={(e) => setOrder({...order, amount: e.target.value})}
                                    />
                                    <span className="input-group-text currency-label">{order.currency}</span>
                                </div>

                            </div>

                        </div>
                        <div className="mb-3">
                            <label htmlFor="paymentMethod" className="form-label">Способ оплаты</label>
                            <CustomFormSelect options={banks} initialValue={banks[0]}
                                              setOption={setPreferredBank} size={"full"}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="paymentDetails" className="form-label">Реквизиты/Комментарий</label>
                            <textarea
                                className="form-control"
                                id="paymentDetails"
                                rows="3"
                                placeholder="Укажите дополнительную информацию"
                                onChange={(e) => setOrder({...order, paymentDetails: e.target.value})}
                            ></textarea>

                        </div>
                        <div className="danger-color">{error}</div>

                        <div className="alert alert-warning mt-3">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <span>Эти данные будут видны всем, не указывайте здесь личную информацию</span>
                            </div>

                        </div>

                        <div className="alert alert-info mt-3">
                            <i className="bi bi-info-circle me-2"></i>
                            После создания объявления оно станет видимым для других пользователей.
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <div></div>
                    <div>
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Отменить
                        </Button>
                        <Button
                            variant={'primary'}
                            onClick={createOrderHandler}
                        >
                            Создать
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalWindowNewOrderBuy;