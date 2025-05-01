import { observer } from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {Context} from '../index.js';
import Button from "../components/Button";

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isAuthLoading, setIsAuthLoading] = useState(false)
    const navigate = useNavigate();
    const {store} = useContext(Context)
    if (store.isAuth) {
        return <Navigate to={'/'} />

    }

    const loginHandler = () => {
        setIsAuthLoading(true)
        if (!isValid()) {
            setIsAuthLoading(false)
            return;
        }

        const response = store.loginUser(username, password)
        response.then(function(e) {
            setIsAuthLoading(false)
            if (e.success) {
                navigate('/')
            }
            else {
                setError(e.error)
            }
        })
    }

    const isValid = () => {
        setError("")
        if (username === "" || password === ""){
            setError("Имя пользователя и пароль не могут быть пусты")
            return false;
        }
        if (username.length < 4) {
            setError("Имя пользователя не может быть меньше 3 символов")
            return false;
        }
        if (password.length < 5) {
            setError("Пароль слишком короткий")
        }
        return true;
    }

    return (
        <>
            <Navbar />
            <div className='container pt-5 mt-5 d-flex align-items-center'>
                <div className='auth_form'>
                    <div className="form">
                        <div className={"d-flex justify-content-center align-items-center"}>
                            <i className={"bi bi-person-circle fs-4 pe-2"}></i>
                            <h4 className='text-center m-0'>
                                Войти
                            </h4>
                        </div>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='Имя пользователя'
                            onChange={(event)=>{setUsername(event.target.value)}}
                        />
                        <input 
                            className="form-control" 
                            type="password" 
                            placeholder='Пароль' 
                            onChange={(event)=>{setPassword(event.target.value)}}   
                            
                        />
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>{error}</div>
                            </div>
                        )}
                        <Button onClick={loginHandler} btnType={"primary mt-4 text-white"} isloading={isAuthLoading ? 1 : 0}>Войти</Button>
                        <div className='d-flex align-items-center my-3'>
                            <hr className='flex-grow-1'/>
                            <span className='px-2 small secondary-text-color'>или</span>
                            <hr className='flex-grow-1'/>
                        </div>
                        <div className='text-center'>
                            <span className='secondary-text-color'>Еще не зарегистрированы? </span>
                            <Link to="/register" className='main-accent-color text-decoration-none fw-medium'>
                                Создать аккаунт
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}

export default observer(LoginPage)