import {observer} from 'mobx-react-lite'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import {ThemeContext, themes} from '../../contexts/ThemeContext'
import {Link} from 'react-router-dom'
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Context} from "../../index";
import NotificationList from "../NotificationList";
import {useSubscription} from "../../websocket/hooks";
import NotificationsIcon from "../NotificationsIcon";

function Navbar() {
    const {store} = useContext(Context)
    const [notifications, setNotifications] = useState([]);
    const [listNotifications, setListNotifications] = useState([])

    const isNotifications = useMemo(() => {
        return listNotifications.some(notification => !notification?.read);
    }, [listNotifications]);

    useEffect(() => {
        if (store.isAuth) {
            const response = store.getUserNotifications();
            response.then(e => {
                if (e.success) {
                    setListNotifications(e.content);
                }
            });
        }
    }, [store.isAuth]);

    useSubscription(`/user/queue/notifications`, (msg) => {
        try {

            setNotifications(prev => [...prev, msg]);
            setListNotifications(prev => [msg, ...prev])
        } catch (error) {
            console.error("Error updating notifications:", error);
        }
    }, [store.id]);


    return (
        <>
            <NotificationList list={notifications}/>
            <nav className="navbar navbar-expand-lg container fixed-top">
                <div className="container-fluid">
                    <h1 className="navbar-brand main-accent-color">Exchanger</h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list fs-2"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Главная</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/p2p-trade/buy">P2P-торговля</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders-history">Мои сделки</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/wallet">Кошелек</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <div className="d-flex justify-content-center align-items-center">

                                <li className="nav-item">
                                    <ThemeContext.Consumer>
                                        {({theme, setTheme}) => (

                                            <ToggleTheme
                                                onChange={() => {
                                                    if (theme === themes.light) setTheme(themes.dark)
                                                    if (theme === themes.dark) setTheme(themes.light)
                                                }}
                                                value={theme === themes.dark ? 1 : 0}
                                            />
                                        )}
                                    </ThemeContext.Consumer>
                                </li>
                                {store.isAuth
                                    ? (
                                        <div className="d-flex ms-2 ms-md-0">
                                            <NotificationsIcon listNotifications={listNotifications}
                                                               setListNotifications={setListNotifications}/>
                                            <li className="nav-item ms-2 ms-md-0">
                                                <div className="nav-link">
                                                    <i className="bi bi-chat-fill position-relative">
                                                        {isNotifications
                                                            ? (
                                                                <span
                                                                    className="position-absolute start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                                                                    style={{top: 3}}>
                                                                <span className="visually-hidden">New alerts</span>
                                                            </span>
                                                            )
                                                            :
                                                            <></>
                                                        }
                                                    </i>
                                                </div>
                                            </li>
                                        </div>
                                    )
                                    : (
                                        <></>
                                    )
                                }
                            </div>

                            <li className="nav-item">
                                {store.isAuth
                                    ?
                                    (
                                        <div className="nav-link d-flex username-link justify-content-center align-items-center">
                                            <div className="rounded-circle bg-secondary me-1 d-flex align-items-center justify-content-center"
                                                 style={{ width: '30px', height: '30px'}}>
                                                <p className="m-0 p-0 mb-1 text-white">{store.username.charAt(0)}</p>
                                            </div>
                                            <Link to={`/user/${store.id}`} className="m-0">{store.username}</Link>
                                            <i className="bi bi-box-arrow-right ms-2 danger-color" onClick={() => {
                                                store.logoutUser();
                                                store.setAuth(false)
                                            }}></i>
                                        </div>

                                    )
                                    :
                                    (
                                        <div className=" placeholder-glow"><Link
                                            className={`nav-link ${store.isAuthLoading ? "placeholder" : ""}`}
                                            to="/login">Войти</Link></div>
                                    )
                                }

                            </li>
                        </ul>
                    </div>


                </div>

            </nav>
        </>
    )
}


export default observer(Navbar);