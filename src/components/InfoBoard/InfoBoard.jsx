import React, {useEffect, useState} from 'react';
import './InfoBoard.css'
import YearBlock from "./YearBlock/YearBlock";
import ThreeInOneCell from "./ThreeInOneCell/ThreeInOneCell";
import IndicatorsAPI from "../../API/IndicatorsAPI";
import PeriodsAPI from "../../API/PeriodsAPI";
import {conditionalNumber} from "../../utils/usefullFunctions";
import Loader from "../Loader/Loader";

//Панель отображения данных. (Левая часть главной страницы).
const InfoBoard = ({district, dfo, rf}) => {
    //Состояния для работы с периодами
    const [periods, setPeriods] = useState() //список периодов
    const [currentPeriod, setCurrentPeriod] = useState(); //текущий(выбранный в данный момент период)
    const [isFirstPeriod, setIsFirstPeriod] = useState(false); //является ли текущий период первым в списке
    const [isLastPeriod, setIsLastPeriod] = useState(true); //является ли текущий период последним в списке

    //Список индикаторов
    const [indicators, setIndicators] = useState()

    //Состояние хранящее информацию загружается ли информационная панель в данный момент
    const [isInfoBoardLoading, setIsInfoBoardLoading] = useState(true)

    //Состояние для передачи разным объектам одного и того же класса с анимацией, в зависимости от контекста(вправо или влево)
    const [valueClassName, setValueClassName] = useState('')

    //Данный компонент запускается впервые или нет
    const [isFirstRender, setIsFirstRender] = useState(true)

    //Загрузка списков периодов из API при первом запуске компонента
    useEffect(() => {
        if (isFirstRender) {
            IndicatorsAPI.get().then(res => {
                setIndicators(res.data)
            })
            PeriodsAPI.getUnited().then(res => {
                setPeriods(res.data)
                setCurrentPeriod(res.data[res.data.length - 1])
            })
        }
        setIsFirstRender(false)
    }, [])

    //При изменении списка периодов, текущим периодом присваивается последний из списка.
    useEffect(() => {
        if (isFirstPeriod) {
            setCurrentPeriod(periods[periods.length - 1])
        }
    }, [periods])

    //При изменении района текущим периодом объявляется последний период из списка, а соответствующим состояниям присваиваются значения о том что текущий период является последним в списке.
    useEffect(() => {
        if (!isFirstRender) {
            setCurrentPeriod(periods[periods.length - 1])
            setIsFirstPeriod(false)
            setIsLastPeriod(true)
        }
    }, [district])


    //Когда все списки загружены и текущий период назначен(по умолчанию последний) выключается флаг о том что компонент загружается(пропадает лоадер, появляется компонент)
    useEffect(() => {
        if (periods && indicators && currentPeriod) {
            setIsInfoBoardLoading(false)
        }
    }, [periods, indicators, currentPeriod])

    //При изменении текущего периода меняются значения состояний хранящих информацию последний это период в списке, первый или ни то не другое.
    useEffect(() => {
        if (!isFirstRender) {
            const index = district.ShortName === 'ХК' ? periods.indexOf(currentPeriod) : periods.indexOf(currentPeriod) - 2
            if (index === 0) {
                setIsFirstPeriod(true)
            } else if (index === periods.length - 1 && district.ShortName === 'ХК') {
                setIsLastPeriod(true)
            } else if (index === periods.length - 3 && district.ShortName !== 'ХК') {
                setIsLastPeriod(true)
            }
        }
    }, [currentPeriod])

    //Событие нажатия на стрелку(изменение периода) задаёт общий класс анимации как значению периода, так и данным в таблице.
    function onArrowClick(direction) {
        const index = periods.indexOf(currentPeriod)
        if (direction === 'left') {
            setValueClassName('ibValueToRight')
            setTimeout(() => setCurrentPeriod(periods[index - 1]), 150)
            setTimeout(() => setValueClassName(''), 300)
            if (isLastPeriod) setIsLastPeriod(false)
        } else {
            setValueClassName('ibValueToLeft')
            setTimeout(() => setCurrentPeriod(periods[index + 1]), 150)
            setTimeout(() => setValueClassName(''), 300)
            if (isFirstPeriod) setIsFirstPeriod(false)
        }
    }

    return (
        <div className="moibContainer">
            {isInfoBoardLoading ?
                <Loader/> :
                <div className="moibMain">
                    <div className="moibMONameContainer">
                        {district.FullName}
                    </div>


                    <div className="moibAllInfoContainer">
                        <div className="moibYearBlockOuterContainer">
                            <div
                                className={district.ShortName !== 'ХК' ? 'anyColumnHeader big fixed' : 'anyColumnHeader'}>
                                <YearBlock
                                    firstPeriod={periods[periods.indexOf(currentPeriod) - 2]}
                                    secondPeriod={periods[periods.indexOf(currentPeriod) - 1]}
                                    thirdPeriod={currentPeriod}
                                    isFirst={isFirstPeriod}
                                    isLast={isLastPeriod}
                                    isKhabKray={district.ShortName === 'ХК'}
                                    onArrowClick={onArrowClick}
                                    animationClass={valueClassName}
                                />
                            </div>
                        </div>

                        <div className="moibYearBlockOuterContainer">
                            {
                                district.ShortName === 'ХК' &&
                                <div className="anyColumnHeader">
                                    <ThreeInOneCell
                                        first={'ХК'}
                                        second={'ДФО'}
                                        third={'РФ'}
                                        isHeader={true}
                                        animationClass={''}
                                    />
                                </div>
                            }
                        </div>

                        <div className={district.ShortName === 'ХК' ? 'tableContainer' : 'tableContainer big'}>
                            <table className="ibTable">
                                <thead>
                                </thead>
                                <tbody className="ibTableBody">
                                {
                                    indicators.map(ind =>
                                        <tr key={ind.Id}>
                                            <td className={district.ShortName === 'ХК' ? 'firstColumn big' : 'firstColumn'}
                                                title={ind.Title}>
                                                {ind.RussianName}
                                            </td>
                                            <td className={district.ShortName === 'ХК' ? 'anyColumnValue' : 'anyColumnValue big'}>
                                                {
                                                    district.ShortName === 'ХК' ?
                                                        <ThreeInOneCell
                                                            first={district.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName] > conditionalNumber
                                                                ? parseFloat(district.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName].toFixed(2)) : '-'}
                                                            second={dfo.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName] > conditionalNumber
                                                                ? parseFloat(dfo.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName].toFixed(2)) : '-'}
                                                            third={rf.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName] > conditionalNumber
                                                                ? parseFloat(rf.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName].toFixed(2)) : '-'}
                                                            isHeader={false}
                                                            title={ind.Title}
                                                            animationClass={valueClassName}
                                                        /> :
                                                        <div className="anyColumnsContainer">
                                                            {periods.indexOf(currentPeriod) >= 2 &&
                                                                <ThreeInOneCell
                                                                    first={district.Data.find(d => d.PeriodSequenceNumber === periods[periods.indexOf(currentPeriod) - 2].SequenceNumber)[ind.EnglishName] > conditionalNumber
                                                                        ? parseFloat(district.Data.find(d => d.PeriodSequenceNumber === periods[periods.indexOf(currentPeriod) - 2].SequenceNumber)[ind.EnglishName].toFixed(2)) : '-'}
                                                                    second={district.Data.find(d => d.PeriodSequenceNumber === periods[periods.indexOf(currentPeriod) - 1].SequenceNumber)[ind.EnglishName] > conditionalNumber
                                                                        ? parseFloat(district.Data.find(d => d.PeriodSequenceNumber === periods[periods.indexOf(currentPeriod) - 1].SequenceNumber)[ind.EnglishName].toFixed(2)) : '-'}
                                                                    third={district.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName] > conditionalNumber
                                                                        ? parseFloat(district.Data.find(d => d.PeriodSequenceNumber === currentPeriod.SequenceNumber)[ind.EnglishName].toFixed(2)) : '-'}
                                                                    isHeader={false}
                                                                    title={ind.Title}
                                                                    animationClass={valueClassName}
                                                                />
                                                            }
                                                        </div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default InfoBoard;