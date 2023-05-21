import React from 'react';
import './Arrow.css'

//Кнопка-стрелка.
const Arrow = ({direction, isVisible, onClick}) => {

    function getStyle() {
        if (!isVisible) {
            return 'notVisible'
        } else if (direction === 'left') {
            return 'arrow'
        } else {
            return 'arrow right'
        }
    }

    return (
        <div className={getStyle()} onClick={() => onClick(direction)}/>
    );
};

export default Arrow;