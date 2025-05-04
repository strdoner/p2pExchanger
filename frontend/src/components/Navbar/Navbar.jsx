import {observer} from 'mobx-react-lite'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import { ThemeContext } from '../../contexts/ThemeContext'
import { themes } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {connectWebSocket} from "../../websocket";
import Notification from "../Notification";
import NotificationList from "../NotificationList";
import {useSubscription} from "../../websocket/hooks";

function Navbar() {
    const {store} = useContext(Context)
    const [notifications, setNotifications] = useState([]);

    // Хук ДОЛЖЕН вызываться на верхнем уровне, без try/catch
    useSubscription(`/user/${store.id}/queue/notifications`, (msg) => {
        try {
            setNotifications(prev => [...prev, msg]);
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
                                <Link className="nav-link" to="#">Кошелек</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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
                                    <div className="d-flex">
                                        <li className="nav-item">
                                            <a className='nav-link'>
                                                <i className="bi bi-bell-fill"></i>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link">
                                                <i className="bi bi-chat-fill"></i>
                                            </a>
                                        </li>
                                    </div>
                                )
                                : (
                                    <></>
                                )
                            }

                            <li className="nav-item">
                                {store.isAuth
                                    ?
                                    (
                                        <a className="nav-link d-flex username-link">
                                            <i className="bi bi-person-fill me-1"></i>
                                            <p className="m-0">{store.username}</p>
                                            <i className="bi bi-box-arrow-right ms-2 danger-color" onClick={() => {
                                                store.logoutUser();
                                                store.setAuth(false)
                                            }}></i>
                                        </a>

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