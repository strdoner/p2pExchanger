import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Context} from "../index";
import Button from "../components/Button";

const RegisterPage = () => {
    const navigate = useNavigate();
    const {store} = useContext(Context)
    const [form, setForm] = useState({username: '', email: '', password: '', password2: ''})
    const [error, setError] = useState({username: '', email: '', password: '', password2: ''})
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)

    const registerHandler = () => {
        setIsRegisterLoading(true)


        if (!isValid()) {
            setIsRegisterLoading(false)
            return
        }

        const response = store.registerUser(form.username, form.email, form.password, form.password2)
        response.then(function (er) {
            setIsRegisterLoading(false);
            if (er.success) {
                const loginResp = store.loginUser(form.username, form.password)
                loginResp.then(function (er) {
                    if (er.success) {
                        navigate('/')
                    } else {
                        navigate('/login')
                    }
                })
            } else {
                setError({...error, password2: er.error})
            }
        })


    }

    const isValid = () => {
        setError({username: '', email: '', password: '', password2: ''})
        if (form.password !== form.password2) {
            setError({...error, password2: "Пароли не совпадают!"})
            return false;
        }

        if (form.username.length < 5) {
            setError({...error, username: "Никнейм слишком короткий"})
            return false;
        }

        if (form.password.length < 5) {
            setError({...error, password: "Пароль слишком короткий"})
            return false;
        }

        return true;
    }

    return (
        <>
            <div className='container pt-5 mt-5 d-flex align-items-center'>
                <div className='auth_form'>
                    <div className="form">
                        <h4 className='text-center'>Зарегистрироваться</h4>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='Имя пользователя'
                            onChange={e => setForm({...form, username: e.target.value})}
                        />
                        <div className="danger-color m-2 text-center">{error.username}</div>
                        <input
                            className="form-control"
                            type="email"
                            placeholder='Электронная почта'
                            onChange={e => setForm({...form, email: e.target.value})}
                        />
                        <div className="danger-color m-2 text-center">{error.email}</div>
                        <input
                            className="form-control"
                            type="password"
                            placeholder='Пароль'
                            onChange={e => setForm({...form, password: e.target.value})}
                        />
                        <div className="danger-color m-2 text-center">{error.password}</div>
                        <input
                            className="form-control"
                            type="password"
                            placeholder='Повторите пароль'
                            onChange={e => setForm({...form, password2: e.target.value})}
                        />
                        <div className="danger-color m-2 text-center">{error.password2}</div>
                        <Button onClick={registerHandler} btnType={"primary mt-4"}
                                isloading={isRegisterLoading ? 1 : 0}>Зарегистрироваться</Button>

                        <div className='d-flex'>
                            <p className=''>Уже зарегистрированы? </p>
                            <Link to={"/login"} className='second-accent-color ps-1'>Войти</Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default observer(RegisterPage)