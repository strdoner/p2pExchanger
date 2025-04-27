import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.scss';
import App from './App';
import ThemeProvider from './providers/ThemeProvider';
import Store from './store/store.ts';
const store = new Store()

export const Context = createContext({
  store,
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{store}}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Context.Provider>
  </React.StrictMode>
);


