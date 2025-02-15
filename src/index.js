import React from 'react';
import ReactDOM from 'react-dom/client';  // Для React 18 используем 'react-dom/client'
import './styles/index.css';  // Импортируем глобальные стили
import App from './App';  // Импортируем основной компонент

// Создаем корневой элемент и рендерим приложение в него
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);