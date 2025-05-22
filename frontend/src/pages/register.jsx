import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Context} from "../index";
import Button from "../components/Button";

const RegisterPage = () => {
    const navigate = useNavigate();
    const {store} = useContext(Context)
    const [form, setForm] = useState({username: '', email: '', password: '', password2: ''})
    const [error, setError] = useState("")
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
                setError(er.error)
            }
        })


    }

    const isValid = () => {
        if (form.password !== form.password2) {
            setError("Пароли не совпадают!")
            return false;
        }

        if (form.username.length < 5) {
            setError("Никнейм слишком короткий")
            return false;
        }

        if (/[^a-zA-Z0-9]/.test(form.username)) {
            setError("Введите валидный username")
            return false;
        }

        if (!/([a-zA-Z0-9_.-]+)@([a-zA-Z]+)([.])([a-zA-Z]+)/.test(form.email)) {
            setError("Введите валидную электронную почту")
            return false;
        }

        if (form.password.length < 5) {
            setError("Пароль слишком короткий")
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
                        <input
                            className="form-control"
                            type="email"
                            placeholder='Электронная почта'
                            onChange={e => setForm({...form, email: e.target.value})}
                        />
                        <input
                            className="form-control"
                            type="password"
                            placeholder='Пароль'
                            onChange={e => setForm({...form, password: e.target.value})}
                        />
                        <input
                            className="form-control"
                            type="password"
                            placeholder='Повторите пароль'
                            onChange={e => setForm({...form, password2: e.target.value})}
                        />
                        <div className="danger-color m-2 text-center">{error}</div>
                        <Button onClick={registerHandler} btnType={"primary"}
                                isloading={isRegisterLoading ? 1 : 0}>Зарегистрироваться</Button>
                        <div className='d-flex align-items-center'>
                            <hr className='flex-grow-1'/>
                            <span className='px-2 small secondary-text-color'>или</span>
                            <hr className='flex-grow-1'/>
                        </div>
                        <div className='text-center'>
                            <span className='secondary-text-color'>Уже зарегистрированы? </span>
                            <Link to={"/login"}
                                  className='main-accent-color text-decoration-none fw-medium'>Войти</Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default observer(RegisterPage)