import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {App} from "./App";
import {AlertProvider} from '../src/utils/utilsAlerts';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <AlertProvider>
            <App/>
        </AlertProvider>
    </StrictMode>
);
