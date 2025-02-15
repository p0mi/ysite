import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapPage from './MapPage'; // Импортируем компонент страницы с картой

function App() {
    return (
        <Router>
            <div className="App">
                <h1>Карта музеев с отзывами</h1>

                <Routes>
                    {/* Добавляем маршрут для отображения карты по ID */}
                    <Route path="/map/:id" element={<MapPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
