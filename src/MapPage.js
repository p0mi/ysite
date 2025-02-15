import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import { YMapDefaultMarker } from '@yandex/ymaps3-default-ui-theme'
import {YMapHint, YMapHintContext} from '@yandex/ymaps3-hint'
import { LOCATION,MARKERS_COORDINATES,MARKER_PROPS,HINTS} from "./variables";
import "./styles/Hint.css"
// Массив с координатами маркеров (например, для музеев)


const MapComponent = ({ x_cord, y_cord }) => {



    const [mapInitialized, setMapInitialized] = useState(false);

    useEffect(() => {
        async function initMap({ x_cord, y_cord }) {
            if (!window.ymaps3) {
                console.error('Yandex Maps API not loaded');
                return;
            }

            await ymaps3.ready;

            const { YMap, YMapDefaultFeaturesLayer, YMapDefaultSchemeLayer } = ymaps3;

            const mapContainer = document.getElementById('map');
            if (!mapContainer) {
                console.error('Map container not found');
                return;
            }

            const map = new YMap(mapContainer, {
                location: {
                    center: [x_cord, y_cord],
                    zoom: 10,
                },
                controls: [],
                behaviors: ["scrollZoom","drag"],
            });

            map.addChild(new YMapDefaultSchemeLayer());
            const defaultFeatures = new YMapDefaultFeaturesLayer();
            map.addChild(defaultFeatures);

            const hint = new YMapHint({hint: (object) => object?.properties?.hint});
            map.addChild(hint);

            // Класс HintWindow
            class HintWindow extends ymaps3.YMapComplexEntity {
                _element = null;
                _detachDom = () => {};
                _unwatchSearchContext = () => {};

                _createElement() {
                    const windowElement = document.createElement('div');
                    windowElement.classList.add('hint_window'); // Применение стиля

                    const windowElementTitle = document.createElement('div');
                    windowElementTitle.classList.add('hint_window__title'); // Применение стиля для заголовка

                    const windowElementText = document.createElement('div');
                    windowElementText.classList.add('hint_window__text'); // Применение стиля для текста подсказки

                    windowElement.appendChild(windowElementTitle);
                    windowElement.appendChild(windowElementText);
                    return windowElement;
                }

                _searchContextListener() {
                    const hintContext = this._consumeContext(YMapHintContext)?.hint;
                    this._element.firstChild.textContent = hintContext?.title;
                    this._element.lastChild.textContent = hintContext?.text;
                }

                _onAttach() {
                    this._element = this._createElement();
                    this._unwatchSearchContext = this._watchContext(YMapHintContext, this._searchContextListener.bind(this));
                    this._detachDom = ymaps3.useDomContext(this, this._element, this._element);
                }

                _onDetach() {
                    this._unwatchSearchContext();
                    this._detachDom();
                }
            }

            hint.addChild(new HintWindow({}));

            MARKERS_COORDINATES.forEach((coords,index) => {
                const marker = new YMapDefaultMarker({
                    coordinates: coords,  // Устанавливаем координаты маркера
                    color: 'lavender',  // Цвет маркера
                    size: 'normal',  // Размер маркера
                    iconName: 'museum',
                    title: (HINTS[index]?.[0]),
                    properties: {
                        hint: {
                            title: HINTS[index]?.[0],
                            text: HINTS[index]?.[1],



                        }
                    }

                });
                console.log(marker);
                map.addChild(marker);  // Добавляем маркер на карту
            });
            map.addChild(new YMapDefaultMarker({...MARKER_PROPS}))


            setMapInitialized(true);
        }

        initMap({ x_cord, y_cord });

        return () => {
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.innerHTML = '';
            }
        };
    }, [x_cord, y_cord, mapInitialized]);

    return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

const MapPage = () => {
    const { id } = useParams();
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        const index = parseInt(id);
        if (index >= 0 && index < MARKERS_COORDINATES.length) {
            setCoordinates(MARKERS_COORDINATES[index]);
        }
    }, [id]);

    // const handleReviewChange = (event) => {
    //     setReviewText(event.target.value);
    // };
    //
    // const handleReviewSubmit = (event) => {
    //     event.preventDefault();
    //     if (reviewText.trim() !== "") {
    //         setReviews([...reviews, reviewText]);
    //         setReviewText("");
    //     }
    // };

    return (
        <div>

            {/* Отображение карты с маркерами */}
            <MapComponent x_cord={LOCATION.center[0]} y_cord={LOCATION.center[1]} />

        </div>
    );
};

export default MapPage;