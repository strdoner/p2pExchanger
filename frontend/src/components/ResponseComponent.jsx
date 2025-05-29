import React, {useContext} from "react";
import ResponseDetailsActive from "./ResponseDetailsActive";
import ResponseDetailsWaiting from "./ResponseDetailsWaiting";
import ResponseDetailsConfirmationTaker from "./ResponseDetailsConfirmationTaker";
import ResponseDetailsConfirmationMaker from "./ResponseDetailsConfirmationMaker";
import ResponseDetailsComplete from "./ResponseDetailsComplete";
import ResponseDetailsCancelled from "./ResponseDetailsCancelled";
import {Context} from "../index";

const ResponseComponent = ({status, setStatus, response}) => {
    const {store} = useContext(Context)
    console.log(response)
    if (!status || !response) return null;
    if (status === "ACTIVE") {
        if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
            return <ResponseDetailsActive response={response} statusHandler={setStatus}/>
        } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
            return <ResponseDetailsWaiting response={response} statusHandler={setStatus}/>
        }
    } else if (status === "CONFIRMATION") {
        if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
            return <ResponseDetailsConfirmationTaker response={response} statusHandler={setStatus}/>
        } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
            return <ResponseDetailsConfirmationMaker response={response} statusHandler={setStatus}/>
        }
    } else if (status === "COMPLETED") {
        if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
            return <ResponseDetailsComplete response={response} statusHandler={setStatus} isSell={false}/>
        } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
            return <ResponseDetailsComplete response={response} statusHandler={setStatus} isSell={true}/>
        }
    } else if (status === "CANCELLED") {
        if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
            return <ResponseDetailsCancelled response={response} statusHandler={setStatus} isSell={false}/>
        } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
            return <ResponseDetailsCancelled response={response} statusHandler={setStatus} isSell={true}/>
        }
    }
}

export default ResponseComponent