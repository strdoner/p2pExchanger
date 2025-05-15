import React, {useContext, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {observer} from "mobx-react-lite";
import CustomFormSelect from "./CustomSelect/CustomFormSelect";
import {Context} from "../index";

const AddPaymentMethodModal = ({showModal, setShowModal, setPaymentMethods}) => {
    const {store} = useContext(Context)
    const handleCloseModal = () => {
        console.log("sdf")
        setShowModal(false);
    };
    const [paymentMethod, setPaymentMethod] = React.useState({});
    const [bank, setBank] = React.useState("Сбербанк");
    const [cardDetails, setCardDetails] = React.useState({
        firstName: "",
        secondName: "",
        fatherName: "",
        cardNumber: ""
    });
    const [error, setError] = useState()
    var paymentsMethods = [
        {label: "Сбербанк", value: "2", name: "Сбербанк"},
        {label: "Т-Банк", value: "3", name: "Т-Банк"},
        {label: "АльфаБанк", value: "4", name: "АльфаБанк"},
        {label: "Райффайзен", value: "5", name: "Райффайзен"},
        {label: "ВТБ", value: "6", name: "ВТБ"},

    ]

    const handleAddPaymentMethod = async (e) => {

        setError("")
        if (!isValid()) {
            return
        }
        const response = store.createPaymentMethod({...cardDetails, bankName: bank})
        response.then(async (response) => {
            if (response.success) {
                // handleCloseModal()
                setPaymentMethods(prev => [...prev, response.content]);
                setPaymentMethod({cardNumber: '', bank: ''});
            }
        })


    };

    const isValid = () => {
        if (cardDetails.cardNumber.length !== 16) {
            setError("Длина номера карты должна быть равна 16 символам!")
            return false
        }

        if (!/^\d+$/.test(cardDetails.cardNumber)) {
            setError("Номер карты может состоять только из цифр!")
            return false
        }

        if (cardDetails.firstName.length <= 2 || cardDetails.secondName.length <= 2 || cardDetails.fatherName.length <= 2) {
            setError("Длина указанных полей не может быть меньше 2 символов!")
            return false
        }

        if (!/^[a-zA-Zа-яА-Я]+$/.test(cardDetails.firstName) || !/^[a-zA-Zа-яА-Я]+$/.test(cardDetails.secondName) || !/^[a-zA-Zа-яА-Я]+$/.test(cardDetails.fatherName)) {
            setError("ФИО может не может состоять из посторонних символов")
            return false
        }
        return true
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Добавить платежную карту</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label htmlFor="">Номер карты</label>
                <input
                    className={`form-control mb-3`}
                    type="text"
                    name={"cardNumber"}
                    value={cardDetails.cardNumber}
                    onChange={e => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                    placeholder="0000 0000 0000 0000"
                />
                <label htmlFor="">Фамилия</label>
                <input
                    className={`form-control mb-3`}
                    type="text"
                    name={"cardNumber"}
                    value={cardDetails.secondName}
                    onChange={e => setCardDetails({...cardDetails, secondName: e.target.value})}
                    placeholder="Иванов"
                />
                <label htmlFor="">Имя</label>
                <input
                    className={`form-control mb-3`}
                    type="text"
                    name={"cardNumber"}
                    value={cardDetails.firstName}
                    onChange={e => setCardDetails({...cardDetails, firstName: e.target.value})}
                    placeholder="Иван"
                />
                <label htmlFor="">Отчество</label>
                <input
                    className={`form-control mb-3`}
                    type="text"
                    name={"cardNumber"}
                    value={cardDetails.fatherName}
                    onChange={e => setCardDetails({...cardDetails, fatherName: e.target.value})}
                    placeholder="Иванович"
                />
                <label htmlFor="">Название банка</label>

                <CustomFormSelect options={paymentsMethods} setOption={setBank} initialValue={bank} size={"full"}/>
                <span className="danger-color small">{error}</span>
                <div className="d-flex justify-content-end gap-2 mt-5">

                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleAddPaymentMethod}>
                        Сохранить
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default observer(AddPaymentMethodModal);