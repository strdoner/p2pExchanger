import React, {useState} from 'react';
import Toast from 'react-bootstrap/Toast';
import {observer} from "mobx-react-lite";
import {Link, useNavigate} from "react-router-dom";

const Notification = ({notification}) => {
    const [show, setShow] = useState(true);
    const date = new Date(notification?.createdAt * 1000 || Date.now());
    const localTime = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const navigate = useNavigate()

    const handleAction = () => {
        navigate(`/response/${notification.responseId}`)
    }
    return (
        <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={10000}
            autohide
            className="shadow-lg notification"
            style={{
                backdropFilter: 'blur(5px)'
            }}
        >
            <Toast.Header
                closeButton={true}
                className="d-flex justify-content-between align-items-center"
                style={{

                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                <Link
                    to={`/response/${notification.responseId}`}
                    className="me-auto fw-bold text-decoration-none text-color"

                >
                    {notification?.title}
                </Link>
                <small className="secondary-text-color" style={{fontSize: '0.75rem'}}>
                    {localTime}
                </small>
            </Toast.Header>
            <Toast.Body
                className="py-3"
            >
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1 secondary-text-color">
                        {notification?.message}
                    </div>
                </div>
                {notification?.action && (
                    <div className="mt-2 pt-2 border-top">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleAction(notification)}
                        >
                            {notification.action}
                        </button>
                    </div>
                )}
            </Toast.Body>
        </Toast>
    );
}

export default observer(Notification);