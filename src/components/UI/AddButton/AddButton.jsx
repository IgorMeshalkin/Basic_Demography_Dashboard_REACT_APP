import React from 'react';
import './AddButton.css'

//Кнопка добавления. Во время выполнения действия вместо плюса в кнопке крутится лоадер.
const AddButton = ({title, isLoading, onClick}) => {
    return (
        <div className="abMain" title={title} onClick={onClick}>
            {
                isLoading ?
                    <div className="abLoaderContainer">
                        <div className="abLoader">
                            <div className="adLoaderEmptyPoint"/>
                        </div>
                    </div> :
                    <>
                        <div className="adPlusFirst"/>
                        <div className="adPlusSecond"/>
                    </>
            }
        </div>
    );
};

export default AddButton;