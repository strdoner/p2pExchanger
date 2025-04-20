import {observer} from 'mobx-react-lite'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import { ThemeContext } from '../../contexts/ThemeContext'
import { themes } from '../../contexts/ThemeContext'

function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg container fixed-top">
            <div class="container-fluid">
                <h1 className="navbar-brand main-accent-color">Exchanger</h1>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Главная</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">P2P-торговля</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">Мои сделки</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">Кошелек</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <ThemeContext.Consumer>
                                {({ theme, setTheme }) => (
                                    
                                    <ToggleTheme
                                        onChange={() => {
                                        if (theme === themes.light) setTheme(themes.dark)
                                        if (theme === themes.dark) setTheme(themes.light)
                                        }}
                                        value={theme === themes.dark? 1 : 0}
                                    />
                                )}
                            </ThemeContext.Consumer>
                        </li>
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
                        <li className="nav-item">
                            <a className="nav-link">
                                <i class="bi bi-person-fill m-1"></i>
                                strdoner
                            </a>
                        </li>
                    </ul>
                </div>
                
                
            </div>
            
        </nav>
    )
}



export default observer(Navbar);