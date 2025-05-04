import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";

const Notification = ({notification}) => {
    const [show, setShow] = useState(true);

    return (
        <Toast onClose={() => setShow(false)} show={show} delay={10000} autohide>
            <Toast.Header>
                <Link className="me-auto text-color" to={`/response/${notification.responseId}`}>{notification?.title}</Link>
                <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
                {notification?.message}
            </Toast.Body>
        </Toast>
    );
}

export default observer(Notification);