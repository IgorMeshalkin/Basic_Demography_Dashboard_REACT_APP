import React, {useEffect, useRef, useState} from 'react';
import './DataInput.css'
import {backParsePeriodFullName, conditionalNumber, isInputsMustReadOnly} from "../../../utils/usefullFunctions";
import LineLoader from "../../LineLoader/LineLoader";

//Поле ввода для формы заполнения данных.
const DataInput = ({
                       indicator,
                       data,
                       setData,
                       setDataIsChanged,
                       setUpdateStatus,
                       isDataLoading,
                       selectedIndicator,
                       setSelectedIndicator,
                       toNext,
                       selectedPeriod,
                       selectedDistrict
                   }) => {
    //Можно ли редактировать этот инпут
    const [isReadOnly, setIsReadOnly] = useState(false)

    //При каждом изменении района или периода инпуты становятся не редактируемыми или редактируемыми.
    useEffect(() => {
        if (isInputsMustReadOnly(selectedDistrict, selectedPeriod)) {
            setIsReadOnly(true)
        } else {
            setIsReadOnly(false)
        }
    }, [selectedPeriod, selectedDistrict])

    //Реф для управления фокусом инпута
    const inputRef = useRef()

    //При смене индикатора инпут становится активным, если выбран его индикатор.
    useEffect(() => {
        if (selectedIndicator.Id === indicator.Id) {
            inputRef.current.focus()
        }
    }, [selectedIndicator])

    //Значение которое отображается в инпуте.
    const [displayValue, setDisplayValue] = useState()

    //При каждом изменении данных изменяется отображаемое в инпуте значение.
    useEffect(() => {
        if (data) {
            if (typeof data[indicator.EnglishName] === 'string') {
                setDisplayValue(data[indicator.EnglishName])
            } else {
                setDisplayValue(data[indicator.EnglishName] > conditionalNumber ? parseFloat(data[indicator.EnglishName].toFixed(2)) : '')
            }
        }
    }, [data])

    //При каждом изменении в инпуте(если изменяет юзер) обновляются данные.
    function handleChange(event) {
        setDataIsChanged(true) //ставлю флажок о том, что данные изменены юзером
        setUpdateStatus(0) //ставлю "пустой" статус обновления при каждом изменении данных юзером
        setData({...data, [indicator.EnglishName]: event.target.value.replace(',', '.')})
    }

    return (
        <div className="diMain">
            {isDataLoading ?
                <LineLoader
                    isSmall={true}
                /> :
                <input
                    readOnly={isReadOnly}
                    ref={inputRef}
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    className="diInput"
                    onFocus={() => setSelectedIndicator(indicator)}
                    onKeyPress={(event) => toNext(event)}
                />
            }
        </div>
    );
};

export default DataInput;