import {useContext, useState} from 'react';
import {Badge, OverlayTrigger, Popover} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {Context} from "../index";

const NotificationsIcon = ({listNotifications = [], setListNotifications}) => {
    const {store} = useContext(Context)
    const [showPopover, setShowPopover] = useState(false);

    const unreadCount = listNotifications.filter(n => !n.read).length;

    const formatTime = (dateString) => {
        console.log(dateString)
        return new Date(dateString * 1000).toLocaleString([], {hour: '2-digit', minute: '2-digit'});
    };

    const readNotificationHandler = (notificationId) => {
        const response = store.markNotificationAsRead(notificationId)
        response.then(e => {
            if (e.success) {
                setListNotifications(prevNotifications =>
                    prevNotifications.map(item =>
                        item.id === notificationId ? {...item, read: true} : item
                    )
                );
            }
        })
    }

    const popover = (
        <Popover className="notification-popover">
            <Popover.Header as="h3" className="d-flex justify-content-between align-items-center p-2">
                <span>Уведомления</span>
                {unreadCount > 0 && (
                    <Badge pill bg="danger" className="ms-2">
                        {unreadCount}
                    </Badge>
                )}
            </Popover.Header>
            <Popover.Body className="p-0">
                {listNotifications.length > 0 ? (
                    <div className="notification-list" style={{overflowY: 'auto'}}>
                        {listNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification-item p-2 ${!notification.read ? 'unread' : ''}`}
                                onClick={() => readNotificationHandler(notification.id)}
                            >
                                <div className="d-flex justify-content-between">
                                    <div style={{width: '95%'}}>
                                        <h6 className="mb-0 fw-bold text-color">{notification.title}</h6>
                                        <p className="mb-0 secondary-text-color">{notification.message}</p>
                                    </div>
                                    <small className="secondary-text-color">
                                        {formatTime(notification.createdAt)}
                                    </small>
                                </div>
                                {notification?.responseId && (
                                    <Link
                                        to={`/response/${notification?.responseId}`}
                                        className="btn btn-link p-0 small"
                                        onClick={() => setShowPopover(false)}
                                    >
                                        Подробнее
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-2 small secondary-text-color">
                        Нет новых уведомлений
                    </div>
                )}
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="position-relative">
            <OverlayTrigger
                trigger="click"
                placement="bottom-end"
                show={showPopover}
                onToggle={setShowPopover}
                overlay={popover}
                rootClose
            >
                <div className="nav-link" style={{cursor: 'pointer'}}>
                    <i className={"bi bi-bell-fill"}>
                        {unreadCount > 0 && (
                            <span
                                className="position-absolute translate-middle p-1 bg-danger rounded-circle"
                                style={{top: 12, start: 50}}>
                            <span className="visually-hidden">New alerts</span>
                        </span>
                        )}
                    </i>
                </div>
            </OverlayTrigger>


        </div>
    );
};

export default NotificationsIcon;