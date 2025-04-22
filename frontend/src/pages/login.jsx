import { observer } from 'mobx-react-lite';
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <>
            <Navbar />
            <div className='container pt-5 mt-5 d-flex align-items-center'>
                <div className='auth_form'>
                    <form action="/" method="post">
                        <h4 className='text-center'>Войти</h4>
                        <input className="form-control" type="text" placeholder='Имя пользователя' />
                        <input className="form-control" type="password" placeholder='Пароль' />
                        <input className="form-control" type="password" placeholder='Повторите пароль' />
                        <button className='btn btn-primary mt-4'>Войти</button>
                        <p>Еще не зарегистрированы? </p>
                        <Link  to={"/register"} className='second-accent-color ps-1'>Зарегистрироваться</Link>
                    </form>
                </div>
            </div>
        
        </>
    )
}

export default observer(LoginPage)