import {observer} from 'mobx-react-lite';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Context} from '../index.js';
import Footer from "../components/Footer/Footer";
import ResponseDetailsActive from "../components/ResponseDetailsActive";
import ResponseDetailsConfirmationTaker from "../components/ResponseDetailsConfirmationTaker";
import ResponseDetailsConfirmationMaker from "../components/ResponseDetailsConfirmationMaker";
import ResponseDetailsComplete from "../components/ResponseDetailsComplete";
import ResponseDetailsCancelled from "../components/ResponseDetailsCancelled";
import ResponseDetailsWaiting from "../components/ResponseDetailsWaiting";
import {useSubscription} from "../websocket/hooks";
import ChatComponent from "../components/ChatComponent";

const ResponseDetails = () => {
    const {store} = useContext(Context)
    const navigate = useNavigate()
    const {responseId} = useParams();
    const [isLoading, setIsLoading] = useState()
    const [isForbidden, setIsForbidden] = useState(false)
    const [response, setResponse] = useState(null)
    const [responseTimer, setResponseTimer] = useState(null)
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(900);
    const [status, setStatus] = useState(null)
    const [contragent, setContragent] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        const ans = store.getResponse(responseId)
        ans.then(function (er) {
            setIsLoading(false)
            if (er.success) {
                setIsForbidden(false)
                setResponse(er.content)
                setResponseTimer(calculateTimeLeft(new Date(), er.content.statusChangingTime))
                setStatus(er.content.status)
                if (er.content.maker.id === store.id) {
                    setContragent(er.content.taker)
                } else {
                    setContragent(er.content.maker)
                }
            } else {
                if (er.status === 403) {
                    setIsForbidden(true)
                }
                console.log("some error: " + er.status)
            }
        })
    }, [responseId, navigate]);

    const calculateTimeLeft = (now, statusChangingArray) => {
        if (statusChangingArray === null) {
            return
        }
        const [year, month, day, hours, minutes, seconds] = statusChangingArray;

        const statusTime = new Date(year, month - 1, day, hours, minutes, seconds);

        if (isNaN(statusTime.getTime())) {
            console.error('Invalid date from array:', statusChangingArray);
            return 0;
        }

        const timePassed = Math.floor((now - statusTime) / 1000); // разница в секундах
        const totalTime = 15 * 60; // 15 минут в секундах
        return Math.max(0, totalTime - timePassed); // не меньше 0
    };

    useSubscription(`/user/queue/responses`, (msg) => {
        try {

            if (msg.id === Number(responseId)) {
                setStatus(msg.status)
                setResponseTimer(calculateTimeLeft(new Date(), msg.statusChangingTime))
                console.log(response);
            }
        } catch (error) {
            console.error("Error updating response status:", error);
        }
    }, [responseId, navigate, store.id]);


    const handleSendMessage = () => {

    }

    const ResponseComponent = useMemo(() => {

        if (status === null || response === null) return null;
        if (status === "ACTIVE") {
            if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
                return <ResponseDetailsActive response={response} statusHandler={setStatus} responseTimer={responseTimer}/>
            } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
                return <ResponseDetailsWaiting response={response} statusHandler={setStatus} responseTimer={responseTimer}/>
            }
        } else if (status === "CONFIRMATION") {
            if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
                return <ResponseDetailsConfirmationTaker response={response} statusHandler={setStatus} responseTimer={responseTimer}/>
            } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
                return <ResponseDetailsConfirmationMaker response={response} statusHandler={setStatus} responseTimer={responseTimer}/>
            }
        } else if (status === "COMPLETED") {
            if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
                return <ResponseDetailsComplete response={response} statusHandler={setStatus} isSell={false} responseTimer={responseTimer}/>
            } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
                return <ResponseDetailsComplete response={response} statusHandler={setStatus} isSell={true} responseTimer={responseTimer}/>
            }
        } else if (status === "CANCELLED") {
            if ((response.taker.id === store.id && response.type === "SELL") || (response.maker.id === store.id && response.type === "BUY")) {
                return <ResponseDetailsCancelled response={response} statusHandler={setStatus} isSell={false} responseTimer={responseTimer}/>
            } else if ((response.taker.id === store.id && response.type === "BUY") || (response.maker.id === store.id && response.type === "SELL")) {
                return <ResponseDetailsCancelled response={response} statusHandler={setStatus} isSell={true} responseTimer={responseTimer}/>
            }
        }
    }, [status, response, store.id]);

    if (isForbidden) {
        return (
            <>Forbidden</>
        )
    } else if (response === null || status === null) {
        return (
            <>Loading..</>
        )
    } else {
        return (
            <>
                <div className="d-flex flex-column min-vh-100 pt-5 container">


                    <div className="container my-4 flex-grow-1 align-items-center d-flex w-100 justify-content-center">
                        <div className="row w-100 order-container">
                            <div className="col-md-6 mb-4 mb-md-0">
                                {ResponseComponent}
                            </div>

                            <div className="col-md-6">
                                <ChatComponent contragent={contragent}/>
                            </div>
                        </div>
                    </div>

                    <Footer/>
                </div>
            </>
        )
    }

}

export default observer(ResponseDetails)