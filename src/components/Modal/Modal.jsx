import React from 'react';
import './Modal.css'

//Модальное окно
const Modal = ({active, setActive, children}) => {
    return (
        <div className={active ? 'background active' : 'background'} onClick={() => setActive(false)}>
            <div className={active ? 'window active' : 'window'} onClick={event => event.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;