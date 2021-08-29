import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './styles/styles.css';
import {ContextProvider} from './context/SocketIOContext';

ReactDOM.render(
    <ContextProvider>
      <App />
    </ContextProvider>,
    document.getElementById('root'),
);
