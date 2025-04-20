import {observer} from 'mobx-react-lite'
import ToggleTheme from '../components/ToggleTheme/ToggleTheme'
import { ThemeContext } from '../contexts/ThemeContext'
import { themes } from '../contexts/ThemeContext'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

function P2pTrade() {
    return (
        <>
            <Navbar />
            <div className='container pt-5'>
                <div className='header__block p-5'>
                    <h1 className='text-center'>P2P-торговля</h1>
                    <p className='pt-3'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium, porro incidunt? Quae, id deserunt fugiat reprehenderit, numquam repellendus tenetur exercitationem modi consequuntur eos vitae accusamus explicabo iste quas perferendis aspernatur.</p>
                </div>
                <div className='orders__list'>
                    <div className='orders__list_header'>
                        <div className='d-flex mb-3'>
                            <h2 className='me-3 choosen p-1'>Купить</h2>
                            <h2 className='p-1'>Продать</h2>
                        </div>
                        <hr />
                        <div className='d-flex orders__list_choose'>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">
                                    <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" width="24" height="24" alt="BTC" />
                                    USDT
                                </option>
                                <option value="2">
                                    <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" width="24" height="24" alt="BTC" />
                                    BTC
                                </option>
                                <option value="3">
                                    <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" width="24" height="24" alt="BTC" />
                                    ETH
                                </option>
                            </select>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">RUB</option>
                                <option value="2">USD</option>
                            </select>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Все платежные системы</option>
                                <option value="1">Сбербанк</option>
                                <option value="2">Т-банк</option>
                                <option value="3">ВТБ</option>
                                <option value="4">Россельхозбанк</option>

                            </select>
                        </div>
                    </div>
                </div>
            </div>




            <Footer />
        </>

    )
}

export default observer(P2pTrade);