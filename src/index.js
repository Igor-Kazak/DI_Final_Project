import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './redux/reducers';
import thunk from 'redux-thunk';
//import { logger } from 'redux-logger';  // only for debugging

const store = createStore(reducer, applyMiddleware(thunk));  //(thunk, logger) - only for debugging

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store} >
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// reportWebVitals(console.log)) https://bit.ly/CRA-vitals
reportWebVitals();
