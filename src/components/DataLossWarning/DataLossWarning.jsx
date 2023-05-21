import React from 'react';
import './DataLossWarning.css'

//Меню предупреждения о возможной потере данных. Применяется в форме заполнения данных.
const DataLossWarning = ({submit, setDataIsChanged, setIsOfferToSaveModal}) => {

    function save() {
        setIsOfferToSaveModal(false)
        submit()
    }

    function continueAnyThing() {
        setDataIsChanged(false)
        setIsOfferToSaveModal(false)
    }

    return (
        <div className="dlwMain">
            <div className="dlwTitle">
                Внимание!
            </div>
            <div className="dlwMessage">
                Форма содержит не сохранённые данные. Если изменить район или период они будут утеряны.
            </div>
            <div className="dlwButtonsContainer">
                <div className="dlwSaveButton" onClick={save}>Сохранить</div>
                <div className="dlwChangeDataButton" onClick={continueAnyThing}>Всё равно продолжить</div>
            </div>
        </div>
    );
};

export default DataLossWarning;