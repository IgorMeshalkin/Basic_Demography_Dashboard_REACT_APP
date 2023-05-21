import React, {useEffect, useState} from 'react';
import './DropDownList.css'
import Arrow from "../Arrow/Arrow";

//Кнопка открытия/закрытия выпадающего списка.
const DropDownOpenCloseButton = ({onClick, isOpen}) => {
    function clickFunction() {
        onClick()
    }

    return (
        <div className={isOpen ? 'ddbMain up' : 'ddbMain'}>
            <Arrow
                direction={"left"}
                isVisible={true}
                onClick={clickFunction}
            />
        </div>
    );
};

export default DropDownOpenCloseButton;