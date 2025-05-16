import React, {useContext, useEffect, useRef, useState} from "react"
import {observer} from "mobx-react-lite";
import {useSubscription} from "../websocket/hooks";
import {Context} from "../index";
import {useParams} from "react-router-dom";
import FileUploadButton from "./FileUploadButton";
import MessageFileComponent from "./MessageFileComponent";

const ChatComponent = ({contragent}) => {
    const {store} = useContext(Context)
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null)
    const messagesEndRef = useRef(null);


    const {responseId} = useParams();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    const fileSelectHandler = (file) => {
        console.log(file)
        console.log('Выбран файл:', file?.name);
        setFile(file)
    };

    const downloadFileHandler = (fileId, fileName) => {
        const response = store.downloadFile(fileId, fileName)
            .then((e) => {
                if (e.success) {
                    console.log("down")
                } else {
                    console.log("error")
                }
            })
    }

    const cancelFilePickingHandler = () => {
        setFile(null)
    }


    useEffect(() => {
        const response = store.getResponseMessages(responseId)
        response.then((er) => {
            if (er.success) {
                setChatMessages(er.content)
            } else {
                console.log(er)
            }
        })
    }, [responseId])

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useSubscription(`/user/queue/messages`, (msg) => {

        try {
            console.log(msg)
            if (msg.orderResponseId === Number(responseId)) {
                setChatMessages(prev => [...prev, msg]);
            }
        } catch (error) {
            console.error("Error via getting new messages:", error);
        }
    }, [responseId, store.id]);

    const handleSendMessage = () => {
        if (message.length === 0) {
            return
        }
        const formData = new FormData();
        const messageData = {
            recipientId: contragent.id,
            senderId: store.id,
            content: message,
            orderResponseId: Number(responseId)
        };
        formData.append("data", new Blob([
            JSON.stringify(messageData)
        ], {type: "application/json"}))
        if (file !== null) {
            formData.append('file', file);
        }

        const response = store.sendMessage(formData)
        response.then((er) => {
            if (er.success) {
                console.log("sended")
                setMessage("")
                setChatMessages(prev => [...prev, er.content]);
            }
        })
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header">
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                        <h5 className="mb-0 text-color">Чат с {contragent.username}</h5>
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
                    <div className="chat-container p-3">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={`${msg.id}-${index}`}
                                className={`message-wrapper mb-3 d-flex ${msg.senderId === store.id ? 'justify-content-end' : 'justify-content-start'}`}
                            >
                                <div
                                    className={`message-item p-3 rounded-3 position-relative ${msg.senderId === store.id
                                        ? 'bg-primary text-white sender-message'
                                        : 'receiver-message'}`}

                                >
                                    <div className={`d-flex justify-content-between align-items-center small mb-2`}>
                                      <span
                                          className={`fw-bold ${msg.senderId === store.id ? 'text-white' : 'text-color'}`}>
                                        {msg.senderId === store.id ? 'Вы' : contragent.username}
                                      </span>
                                        <span
                                            className={`ms-2 ${msg.senderId === store.id ? 'text-white-50' : 'secondary-text-color'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                      </span>
                                    </div>

                                    <div className="message-content" style={{wordWrap: 'break-word'}}>
                                        {msg.content}
                                    </div>
                                    <div className="message-content" style={{wordWrap: 'break-word'}}>
                                        {msg.files.map((file) => (
                                            <MessageFileComponent file={file} downloadHandler={downloadFileHandler}/>

                                        ))}
                                    </div>
                                    {msg.senderId === store.id && (
                                        <div className="position-absolute end-0 bottom-0 me-2 mb-1"
                                             style={{fontSize: '0.7rem'}}>
                                            {msg.isRead ? '✓✓' : '✓'}
                                        </div>
                                    )}
                                </div>
                                <div ref={messagesEndRef}/>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="card-footer">
                <div className="input-group d-flex justify-content-between">
                    <FileUploadButton onFileSelect={fileSelectHandler}/>
                    <div className="d-flex flex-fill">
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
                <div className="pt-2 px-2">
                    {file === null
                        ? (
                            ""
                        )

                        : (
                            <div
                                className=" p-2 rounded-3 me-2 d-flex align-items-center justify-content-center file-icon text-center bg-secondary position-relative"
                                style={{width: 50, height: 50}}>
                                <span className="position-absolute top-0 end-0"
                                      onClick={cancelFilePickingHandler}>
                                    <button className="bi bi-x btn-toolbar btn p-0 text-white"></button>
                                </span>
                                <span className="small text-white">
                                    {file.name.slice(file.name.lastIndexOf(".") + 1)}
                                </span>
                            </div>
                        )

                    }
                </div>
            </div>
        </div>
    )
}


export default observer(ChatComponent);