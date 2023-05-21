import React, {useEffect, useState} from 'react';
import {checkLastPeriod} from "../../utils/usefullFunctions";
import './NextPeriodBoard.css'
import LineLoader from "../LineLoader/LineLoader";
import PeriodsAPI from "../../API/PeriodsAPI";

//Меню создания нового периода. Применяется в форме заполнения данных.
const NextPeriodBoard = ({periods, isNextPeriodModal, setIsNextPeriodModal}) => {

    //Содержит следующий, исходя из текущей даты, период для создания.
    //Это всегда последний завершённый календарный квартал.
    //Так же содержит булевое поле result, говорящее есть ли уже в системе такой период.
    const [nextPeriod, setNextPeriod] = useState()

    //Создаётся ли период в данный момент(для лоадера)
    const [isCreating, setIsCreating] = useState(false)

    //При открытии модального окна, на основании списка периодов обновляется следующий период для создания.
    useEffect(() => {
        if (isNextPeriodModal) {
            setNextPeriod(checkLastPeriod(periods))
        }
    }, [isNextPeriodModal])

    //Создаёт новый период и в случае успеха перезагружает форму заполнения данных.
    function createPeriod() {
        setIsCreating(true)
        PeriodsAPI.post(nextPeriod)
            .then(res => {
                if (res.status === 200) {
                    setIsNextPeriodModal(false)
                    localStorage.setItem("isMainPage", false);
                    setTimeout(() => {
                        window.location.reload()
                        alert('Период успешно создан, текущая страница будет перезагружена')
                    }, 100)
                } else {
                    alert('Ошибка сервера, не удалось создать период')
                }
            })
            .catch(ex => {
                alert('Не удалось создать период. Ошибка: ' + ex)
            })
    }

    return (
        <div>
            {nextPeriod &&
                <>
                    {
                        nextPeriod.result ?
                            <div className="npbMain">
                                <div className="npbTitle">Внимание!</div>
                                <div className="npbBody">
                                    {
                                        isCreating ?
                                            <>
                                                <span className="npbBodySpan">Период создаётся. Это может занять некоторое время.</span>
                                                <LineLoader/>
                                                <span className="npbBodySpan">Данное окно можно закрывать</span>
                                            </>
                                            :
                                            <>
                                                <span className="npbBodySpan">Вами будет создан новый период</span>
                                                <span
                                                    className="npbBodySpanBold">{nextPeriod.quarter}-й квартал {nextPeriod.year}-го года.</span>
                                            </>
                                    }
                                </div>
                                {
                                    isCreating ?
                                        <div className="npbButtonContainer"
                                             onClick={() => setIsNextPeriodModal(false)}>Закрыть
                                        </div> :
                                        <div className="npbButtonContainer"
                                             onClick={createPeriod}>Создать
                                        </div>
                                }
                            </div> :
                            <div className="npbMain">
                                <div className="npbTitle">Вы не можете создать новый период</div>
                                <div className="npbBody">
                                    <span className="npbBodySpan">Последним завершённым кварталом на сегодня был</span>
                                    <span className="npbBodySpanBold">{nextPeriod.quarter}-й квартал {nextPeriod.year}-го года.</span>
                                    <span className="npbBodySpan">Этот период уже есть в системе</span>
                                </div>
                                <div className="npbButtonContainer"
                                     onClick={() => setIsNextPeriodModal(false)}>Понятно
                                </div>
                            </div>
                    }
                </>
            }
        </div>
    );
};

export default NextPeriodBoard;