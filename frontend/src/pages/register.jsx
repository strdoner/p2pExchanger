import { observer } from 'mobx-react-lite';
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <>
            <Navbar />
            <div className='container pt-5 mt-5 d-flex align-items-center'>
                <div className='auth_form'>
                    <form action="/" method="post">
                        <h4 className='text-center'>Зарегистрироваться</h4>
                        <input className="form-control" type="text" placeholder='Имя пользователя' />
                        <input className="form-control" type="email" placeholder='Электронная почта' />
                        <input className="form-control" type="password" placeholder='Пароль' />
                        <input className="form-control" type="password" placeholder='Повторите пароль' />
                        <button className='btn btn-primary mt-4'>Зарегистрироваться</button>
                        <div className='d-flex'>
                            <p className=''>Уже зарегистрированы? </p>
                            <Link to={"/login"} className='second-accent-color ps-1'>Войти</Link>
                        </div>
                    </form>
                </div>
            </div>
        
        </>
    )
}

export default observer(RegisterPage)