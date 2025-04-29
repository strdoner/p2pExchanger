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
                        <h4 className='text-center'>Войти</h4>
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
                        <div className="danger-color m-2 text-center">{error}</div>
                        <Button onClick={loginHandler} btnType={"primary mt-4"} isloading={isAuthLoading ? 1 : 0}>Войти</Button>
                       
                        <p>Еще не зарегистрированы? </p>
                        <Link  to={"/register"} className='second-accent-color ps-1'>Зарегистрироваться</Link>
                    </div>
                </div>
            </div>
        
        </>
    )
}

export default observer(LoginPage)