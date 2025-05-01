import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import {Context} from '../index.js';
import Footer from "../components/Footer/Footer";
import Button from "../components/Button";
import ResponseDetailsActive from "../components/ResponseDetailsActive";
import ResponseDetailsConfirmationTaker from "../components/ResponseDetailsConfirmationTaker";
import ResponseDetailsConfirmationMaker from "../components/ResponseDetailsConfirmationMaker";

const ResponseDetails = () => {
    const {store} = useContext(Context)
    const navigate = useNavigate()
    const { responseId } = useParams();
    const [isLoading, setIsLoading] = useState()
    const [response, setResponse] = useState(null)

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(900);
    const [status, setStatus] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        const ans = store.getResponse(responseId)
        ans.then(function(er) {
            setIsLoading(false)
            if (er.success) {
                setResponse(er.content)
                setStatus(er.content.status)
            }
            else {
                console.log("some error: " + er.error)
            }
        })
    }, [responseId, navigate]);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);



    const handleSendMessage = () => {

    }

    const getResponseComponent = () => {
        if (status === null) {
            return null
        }
        if (status === "ACTIVE") {
            if (response.taker.id === store.id) {
                return <ResponseDetailsActive response={response} statusHandler={setStatus}/>
            }
            else if (response.maker.id === store.id) {
                return <div>Пока нет</div>
            }
        }
        else if (status === "CONFIRMATION") {
            if (response.taker.id === store.id) {
                return <ResponseDetailsConfirmationTaker response={response} statusHandler={setStatus}/>
            }
            else if (response.maker.id === store.id) {
                return <ResponseDetailsConfirmationMaker response={response} statusHandler={setStatus}/>
            }
        }
        else if (status === "COMPLETED") {
            return <div>Completed</div>
        }
        else if (status === "CANCELLED") {
            return <div>cancelled</div>
        }
    }



    if (response === null || status === null) {
        return (
            <>Loading..</>
        )
    }

    else {
        return (
            <>
                <Navbar />
                <div className="d-flex flex-column min-vh-100 pt-5 container">


                    <div className="container my-4 flex-grow-1 align-items-center d-flex w-100 justify-content-center">
                        <div className="row">
                            <div className="col-md-6 mb-4 mb-md-0">

                                {getResponseComponent()}
                            </div>

                            <div className="col-md-6">
                                <div className="card shadow-sm h-100">
                                    <div className="card-header">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="mb-0 text-color">Чат с {response.taker.username}</h5>
                                            </div>
                                            <div className="badge bg-primary rounded-pill">
                                                <i className="bi bi-shield-check me-1 text-white"></i>
                                                P2P сделка
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="card-body p-0"
                                        style={{
                                            height: '400px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {chatMessages.length === 0 ? (
                                            <div className="d-flex justify-content-center align-items-center h-100">
                                                <div className="text-center secondary-text-color">
                                                    <i className="bi bi-chat-left-text fs-1"></i>
                                                    <p>Начните общение с контрагентом</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3">
                                                {chatMessages.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        className={`mb-3 d-flex ${msg.sender === 'YOU' ? 'justify-content-end' : 'justify-content-start'}`}
                                                    >
                                                        <div
                                                            className={`p-3 rounded-3 ${msg.sender === 'YOU' ? 'bg-primary text-white' : 'bg-light'}`}
                                                            style={{ maxWidth: '70%' }}
                                                        >
                                                            <div className="d-flex justify-content-between small mb-1">
                                                        <span className="fw-bold">
                                                            {msg.sender === 'YOU' ? 'Вы' : response.maker.username}
                                                        </span>
                                                                <span className="secondary-text-color">
                                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                            </div>
                                                            <div>{msg.text}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-footer">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Написать сообщение..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleSendMessage}
                                                disabled={!message.trim()}
                                            >
                                                <i className="bi bi-send-fill text-white"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        )
    }

}

export default observer(ResponseDetails)