import {observer} from 'mobx-react-lite'
import ToggleTheme from '../components/ToggleTheme/ToggleTheme'
import { ThemeContext } from '../contexts/ThemeContext'
import { themes } from '../contexts/ThemeContext'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

function WelcomePage() {
    return (
        <>
            <Navbar />
            <div className='container pt-5'>
                 <div className="header__block pt-5 mt-5 text-center">
                    <h1>P2P-обменник криптовалюты</h1>
                    <p>Покупайте и продавайте BTC, USDT и другие активы напрямую у других пользователей.</p>
                    <button className='btn btn-primary mt-5'>Начать торговать</button>
                 </div>
                 <div className="howto__block text-center">
                    <h1>Как это работает?</h1>
                    <div className='row mt-5'>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-card-checklist'></i>
                            <h5>Выберите заявку</h5>
                            <p>Покупатель/продавец выставляет условия.</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-currency-exchange'></i>
                            <h5>Совершите сделку</h5>
                            <p>Криптовалюта резервируется, фиат переводится напрямую.</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-check-circle'></i>
                            <h5>Подтвердите оплату</h5>
                            <p>Продавец проверяет поступление денег.</p>
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <i className='bi-coin'></i>
                            <h5>Получите активы</h5>
                            <p>Система разблокирует криптовалюту.</p>
                        </div>
                    </div>
                    
                 </div>
                 <div className='preferences__block'>
                    <h1 className='text-center'>Наши преимущества</h1>
                    <div className='preferences_security row justify-content-around'>
                        <div className="col-4 text-left align-content-center">
                            <h2>Гарантия безопасности</h2>
                            <p>Криптовалюта резервируется системой до подтверждения оплаты.</p>
                        </div>
                        <div className="col-4 text-center">
                            <i className='bi-shield-lock'></i>
                        </div>
                    </div>

                    <div className='preferences_comissions row justify-content-around'>
                        <div className="col-4 text-center">
                            <i className='bi-percent'></i>
                        </div>
                        <div className="col-4 text-end align-content-center">
                            <h2>Низкие комиссии</h2>
                            <p>Платите только за успешные сделки.</p>
                        </div>
                    </div>
                    <div className='preferences_fast row justify-content-around'>
                        <div className="col-4 text-left align-content-center">
                            <h2>Быстрые сделки</h2>
                            <p>Выбирайте контрагентов с мгновенными платежами (СБП, карты).</p>
                        </div>
                        <div className="col-4 text-center">
                            <i className='bi-rocket'></i>
                        </div>
                    </div>
                    <div className='preferences_truly_course row justify-content-around'>
                        <div className="col-4 text-center">
                            <i className='bi-eye'></i>
                        </div>
                        <div className="col-4 text-end align-content-center">
                            <h2>Честный курс</h2>
                            <p>Свободное ценообразование без скрытых надбавок.</p>
                        </div>
                    </div>
                 </div>
                 <div className='start__block text-center'>
                    <h1>Готовы к первой сделке?</h1>
                    <button className='btn btn-primary mt-4'>Зарегистрироваться</button>
                 </div>
                 <Footer />
             </div>
        </>

    )
}

export default observer(WelcomePage);