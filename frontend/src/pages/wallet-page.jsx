import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import ChatComponent from "../components/ChatComponent";
import Footer from "../components/Footer/Footer";
import {Context} from "../index";
import CurrencyItem from "../components/CurrencyItem";
import ModalWindowDeposit from "../components/ModalWindowDeposit";

const WalletPage = () => {
    const {store} = useContext(Context)
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const getUserBalances = () => {
        const response = store.getUserBalances()
        response.then((e) => {
            if (e.success) {
                console.log(response)
                setCurrencies(e.content)
                setLoading(false)
            }

        })
    }

    useEffect(() => {
        setLoading(true)
        getUserBalances()
    }, [store]);

    const createBalanceHandler = () => {
        setShowForm(true)
    }

    return (
        <>
            <ModalWindowDeposit modalShow={showForm} setModalShow={setShowForm} getUserBalancesHandler={getUserBalances} />
            <div className="d-flex flex-column py-5 container">
                <div className="row mb-4 pt-5">
                    <div className="col-12">
                        <h1 className="fw-bold text-color"><i className="bi bi-wallet2 me-2"></i> Мой криптокошелек</h1>
                        <p className="secondary-text-color p-2">Обзор ваших криптоактивов</p>
                    </div>
                </div>
                <hr/>
                <div className="row justify-content-between align-items-center">
                    <div className="col-12 col-sm-6 mb-4">
                        <div className="balance-card p-4 d-flex align-items-center justify-content-between placeholder-glow">
                            <div>
                                <h5 className="text-white">Общий баланс</h5>
                                <h2 className={`text-white fw-bolder ${loading ? "placeholder":"" }`}>24,499.59</h2>
                            </div>
                            <div className="pe-4">
                                <span className="fs-1 text-white-50 fw-light">₽</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                        <div className="d-flex align-items-center justify-content-center">
                            <button className="btn btn-success fs-1" onClick={createBalanceHandler}>Депнуть</button>
                        </div>
                    </div>
                    {currencies.map((currency) =>
                        (
                            (currency?.available !== 0 || currency?.locked !== 0)
                                    ?( <CurrencyItem currency={currency} key={currency.id} loading={loading} />)
                                    : <></>

                        )
                    )}




                    <div className="col-12 col-md-6 currency-card"></div>
                    <div className="col-12 col-md-6 currency-card"></div>
                    <div className="col-12 col-md-6 currency-card"></div>
                    <div className="col-12 col-md-6 currency-card"></div>
                </div>

            </div>
            <Footer/>
        </>
    )
}

export default observer(WalletPage)