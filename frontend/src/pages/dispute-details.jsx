import React, {useContext, useEffect, useState} from "react"
import {observer} from "mobx-react-lite";
import {useNavigate, useParams} from "react-router-dom";
import ChatComponent from "../components/ChatComponent";
import Footer from "../components/Footer/Footer";
import {Context} from "../index";
import DisputeOrderResponseDetails from "../components/DisputeOrderResponseDetails";
import ChatTabsComponent from "../components/ChatTabsComponent";

const DisputeDetails = () => {
    const navigate = useNavigate()
    const {disputeId} = useParams();
    const {store} = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const [isForbidden, setIsForbidden] = useState(true);
    const [response, setResponse] = useState(null);
    const [contragent, setContragent] = useState(null);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setIsLoading(true)
        const ans = store.getDispute(disputeId)
        ans.then(function (er) {
            setIsLoading(false)
            if (er.success) {
                setIsForbidden(false)
                setResponse(er.content.response)
                setContragent(er.content.response.buyer)
                setStatus(er.content.status)
            } else {
                if (er.status === 403) {
                    setIsForbidden(true)
                }
                console.log("some error: " + er.status)
            }
        })
    }, [disputeId, navigate]);

    const isValid = () => {
        if (comment.length < 5) {
            setError("Длина комментария слишком мала!")
            return false;
        }
        return true;
    }

    const completeResponseHandler = () => {
        setError("")
        if (!isValid()) {
            return;
        }

        const ans = store.completeDispute(disputeId, comment)
        ans.then(function (er) {
            if (er.success) {
                setStatus({name: "Решен", color: "green"})
            }
            else {
                console.log("error");
            }
        })
    }

    const cancelResponseHandler = () => {
        const ans = store.cancelDispute(disputeId, comment)
        ans.then(function (er) {
            if (er.success) {
                setStatus({name: "Решен", color: "green"})
            }
            else {
                console.log("error");
            }
        })
    }


    if (isForbidden) {
        return (
            <>Запрещено</>
        )
    }
    return (
        <>
            <div className="d-flex flex-column min-vh-100 pt-5 container row">


                    <div className="container my-4 flex-grow-1 align-items-center d-flex w-100 justify-content-center">
                        <div className="row w-100 order-container">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <DisputeOrderResponseDetails response={response} status={status} />
                            </div>

                            <div className="col-md-6 h-100">
                                <ChatTabsComponent responseId={response.id} contragents={[{...response.buyer, isAdmin:false}, {...response.seller, isAdmin:false}]}/>
                            </div>
                            {status.name !== "Решен" ? (
                                <div className="col-12 mt-3">
                                    <div className="card">
                                        <div className="card-header">
                                            <i className="bi bi-gavel"></i> Принять решение
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-9">
                                    <textarea
                                        className="form-control mb-3"
                                        placeholder="Комментарий к решению..."
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                                    <div className="danger-color">{error}</div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="d-grid gap-2">
                                                        <button className="btn btn-success" onClick={completeResponseHandler}>
                                                            <i className="bi bi-check-circle"></i> В пользу покупателя
                                                        </button>
                                                        <button className="btn btn-danger" onClick={cancelResponseHandler}>
                                                            <i className="bi bi-x-circle"></i> В пользу продавца
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}

                        </div>

                    </div>

                    <Footer/>
            </div>

        </>
    )
}

            export default observer(DisputeDetails);