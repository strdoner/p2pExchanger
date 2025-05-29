import React from "react";
import {observer} from "mobx-react-lite";

const CurrencyItem = ({currency, loading, prices}) => {
    return (
        <div className="col-lg-6 mb-4">

            <div className="currency-card p-4">
                <div className="currency-header d-flex align-items-center">
                    <div className={`${currency.currency.toLowerCase()}-bg rounded-5 currency-icon`}>

                    </div>
                    <div className="ms-3">
                        <h5 className="m-0 fw-bolder">{currency?.currencyName}</h5>
                        <span className="secondary-text-color m-0">{currency?.currency}</span>
                    </div>
                </div>
                <div className="currency-body mt-3 d-flex align-items-center placeholder-glow">
                    <div className="me-3">
                        <h4 className={`fw-bolder m-0 ${loading ? "placeholder" : ""}`}>{currency?.available} {currency?.currency}</h4>
                        <div></div>
                        <span
                            className={`secondary-text-color  ${loading ? "placeholder" : ""}`}>≈ {(prices[currency?.currency] * currency?.available).toLocaleString()} RUB</span>
                    </div>
                    <div className="ps-3 border-start">
                        <h4 className={`fw-bolder second-accent-color m-0  ${loading ? "placeholder" : ""}`}>
                            <i className="bi bi-snow3 fs-4 second-accent-color me-1"></i>
                            {currency?.locked} {currency?.currency}
                        </h4>
                        <div></div>
                        <span
                            className={`secondary-text-color  ${loading ? "placeholder" : ""}`}>≈ {(prices[currency?.currency] * currency?.locked).toLocaleString()} RUB</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(CurrencyItem);