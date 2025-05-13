import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import AddPaymentMethodModal from "../components/AddPaymentMethodModal";
import Footer from "../components/Footer/Footer";

const UserProfile = () => {
    const {userId} = useParams()
    const {store} = useContext(Context);
    const [isLoaded, setIsLoaded] = useState(false);
    // Данные пользователя
    const [user, setUser] = useState({
        username: 'john_doe',
        totalDeals: 42,
        successfulDeals: 38,
        rating: 4.8,
    });

    useEffect(() => {
        const response = store.getFullUserInfo(userId);
        response.then((response) => {
            if (response.success) {
                console.log(response.content)
                setUser(response.content)
                setPaymentMethods(response.content.paymentMethods)
                setIsLoaded(true)
            }
        })
    }, [userId]);

    const [showModal, setShowModal] = useState(false);

    // Список платежных методов
    const [paymentMethods, setPaymentMethods] = useState([
        {id: 1, lastFour: '1234', bankName: 'Сбербанк'},
        {id: 2, lastFour: '5678', bankName: 'Тинькофф'},
    ]);


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);


    // Удаление карты
    const handleRemovePaymentMethod = (id) => {
        setPaymentMethods(prev => prev.filter(method => method.id !== id));
    };

    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            <AddPaymentMethodModal setPaymentMethods={setPaymentMethods} setShowModal={setShowModal}
                                   showModal={showModal}/>
            <div className="container mt-4 pt-5">
                <div className="profile-header mt-5">
                    <h2 className="text-color fw-bolder mb-5">{user.username}</h2>
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4">
                            <div className="div h-100 border p-2 text-center">
                                <h5 className="fw-medium">Всего сделок</h5>
                                <span className="fs-3 text-color">{user.ordersCount}</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="div h-100 border p-2 text-center">
                                <h5 className="fw-medium">Успешных сделок</h5>
                                <span
                                    className="fs-3 text-color">{user.successBuysCount + user.successSellsCount}</span>
                                <div className="text-color">
                                    <span className="success-color">Покупок: {user.successBuysCount}</span>|
                                    <span className="danger-color">Продаж: {user.successSellsCount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="div h-100 border p-2 text-center">
                                <h5 className="fw-medium">Процент успеха</h5>
                                <span className="fs-3 text-color">{user.successPercent}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="mt-5 mb-4"/>
                {store.id === Number(userId)
                    ? (
                        <div className="profile-body">
                            <div className="row justify-content-between">
                                <div className="col-4 d-flex align-items-center">
                                    <h5 className="m-0">Платежные методы</h5>
                                </div>
                                <div className="col-2 text-end">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleShowModal}
                                    >
                                        Добавить карту
                                    </button>
                                </div>
                                <div className=" mt-4 ">
                                    {paymentMethods.map((method, index) => (
                                        <div
                                            className="payment__method-item p-3 d-flex align-items-center justify-content-between"
                                            key={method.id}>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        backgroundColor: method.bank.color
                                                    }}>
                                                    <span
                                                        className={` ${method.bank.color !== "yellow" ? "text-white" : ""}`}>{method.bank.name.charAt(0)}</span>
                                                </div>
                                                <div className="d-block">
                                                    <h6 className="text-color fw-bold m-0">{method.bank.name}</h6>
                                                    <span
                                                        className="secondary-text-color small">{method.cardHolderName}</span>
                                                    <div></div>
                                                    <span
                                                        className="secondary-text-color small">{"**** **** **** " + method.lastFour}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="btn-danger btn btn-sm"
                                                    onClick={() => handleRemovePaymentMethod(method.id)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                    : <></>
                }
            </div>
            <Footer/>
        </>
    );
};

export default observer(UserProfile)