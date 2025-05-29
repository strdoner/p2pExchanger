import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import Footer from "../components/Footer/Footer";
import {Context} from "../index";
import CurrencyItem from "../components/CurrencyItem";
import ModalWindowDeposit from "../components/ModalWindowDeposit";

const WalletPage = () => {
    const {store} = useContext(Context)
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const prices = {"USDT": 80, "BTC": 8351747, "USDC": 80, "BNB": 52609, "ETH": 206108}
    const [totalPrice, setTotalPrice] = useState(0)

    const getUserBalances = () => {
        const response = store.getUserBalances()
        response.then((e) => {
            if (e.success) {
                setCurrencies(e.content)

                setLoading(false)
            }

        })
    }

    const totalAmountHandler = () => {
        let price = 0;
        for (let i = 0; i < currencies.length; i++) {
            console.log(prices[currencies[i].currency])
            price += prices[currencies[i].currency] * (currencies[i].available + currencies[i].locked)
        }
        console.log(price)
        setTotalPrice(price)
    }

    useEffect(() => {
        totalAmountHandler()
    }, [currencies]);

    useEffect(() => {
        setLoading(true)
        getUserBalances()
    }, [store]);

    const createBalanceHandler = () => {
        setShowForm(true)
    }

    return (
        <>
            <ModalWindowDeposit modalShow={showForm} setModalShow={setShowForm}
                                getUserBalancesHandler={getUserBalances}/>
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
                        <div
                            className="balance-card p-4 d-flex align-items-center justify-content-between placeholder-glow">
                            <div>
                                <h5 className="text-white">Общий баланс</h5>
                                <h2 className={`text-white fw-bolder ${loading ? "placeholder" : ""}`}>{totalPrice.toLocaleString()}</h2>
                            </div>
                            <div className="pe-4">
                                <span className="fs-1 text-white-50 fw-light">₽</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                        <div className="d-flex justify-content-lg-end justify-content-center">
                            <div className="currency-card p-4 w-100 ">
                                <button
                                    className="text-center w-100 btn btn-deposit px-5 py-3 rounded-3 fw-bold d-flex align-items-center"
                                    onClick={createBalanceHandler}
                                >
                                    <div className="m-auto d-flex align-items-center">
                                        <i className="bi bi-plus-circle me-3 fs-4"></i>
                                        Внести депозит
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>
                    {currencies.map((currency) =>
                        (
                            (currency?.available !== 0 || currency?.locked !== 0)
                                ? (
                                    <CurrencyItem currency={currency} key={currency.id} loading={loading} prices={prices}/>)
                                : <></>

                        )
                    )}

                </div>

            </div>
            <Footer/>
        </>
    )
}

export default observer(WalletPage)