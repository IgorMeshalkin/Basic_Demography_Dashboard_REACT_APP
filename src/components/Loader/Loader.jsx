import React, {useEffect, useRef, useState} from 'react';
import './Loader.css'
import {changeVisible} from "../../utils/usefullFunctions";

//Основной индикатор загрузки. В виде трёх кругов.
const Loader = () => {
    const [firstIsVisible, setFirstIsVisible] = useState(false)
    const [secondIsVisible, setSecondIsVisible] = useState(false)
    const [thirdIsVisible, setThirdIsVisible] = useState(false)

    useEffect(() => {
        const firstTimeout = setTimeout(() => {
            setFirstIsVisible(true)
        }, 200)
        const secondTimeout = setTimeout(() => {
            setSecondIsVisible(true)
        }, 800)
        const thirdTimeout = setTimeout(() => {
            setThirdIsVisible(true)
        }, 1400)

        return () => {
            clearTimeout(firstTimeout)
            clearTimeout(secondTimeout)
            clearTimeout(thirdTimeout)
        }
    }, [])

    useEffect(() => {
        changeVisible(firstIsVisible, setFirstIsVisible, 1800);
    }, [firstIsVisible])

    useEffect(() => {
        changeVisible(secondIsVisible, setSecondIsVisible, 1800);
    }, [secondIsVisible])

    useEffect(() => {
        changeVisible(thirdIsVisible, setThirdIsVisible, 1800);
    }, [thirdIsVisible])

    return (
        <div className="loaderBody">

            <div className="circleContainer">
                    <div className={firstIsVisible ? 'loaderCircle visible' : 'loaderCircle'}/>
            </div>

            <div className="circleContainer">
                    <div className={secondIsVisible ? 'loaderCircle visible' : 'loaderCircle'}/>
            </div>

            <div className="circleContainer">
                <div className={thirdIsVisible ? 'loaderCircle visible' : 'loaderCircle'}/>
            </div>

        </div>
    );
};

export default Loader;