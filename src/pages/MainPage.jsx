import React, {useEffect, useRef, useState} from 'react';
import DistrictsAPI from "../API/DistrictsAPI";
import {selectBackgroundImageBySeason} from "../utils/usefullFunctions";
import emblem from "../images/Герб.png";
import Loader from "../components/Loader/Loader";
import SlowTransition from "../components/Transitions/SlowTransition/SlowTransition";
import InfoBoard from "../components/InfoBoard/InfoBoard";
import HoneycombsMap from "../components/HoneycombsMap/HoneycombsMap";
import Modal from "../components/Modal/Modal";
import AuthBoard from "../components/AuthBoard/AuthBoard";

//Главная страница
const MainPage = ({setIsMainPage, setAuthPassword, authPassword}) => {
    //Первая ли это загрузка
    const [isFirstLoading, setIsFirstLoading] = useState(true)

    //Список районов(содержит все данные по периодам) и выбранный в данный момент район
    const [districtsList, setDistrictsList] = useState()
    const [selectedDistrict, setSelectedDistrict] = useState({})

    //Продолжается ли в данный момент начальная загрузка страницы.
    const [isStartLoading, setIsStartLoading] = useState(true)

    //Открыто ли модальное окно для введения пароля при переходе к форме заполнения данных
    const [isAuthModal, setIsAuthModal] = useState(false)
    const [isAuth, setIsAuth] = useState(false)

    //Первоначальная загрузка районов со всеми данными.
    useEffect(() => {
        if (isFirstLoading) {
            DistrictsAPI.get().then(res => {
                setDistrictsList(res.data)
            })
        }
        setIsFirstLoading(false)
    }, [])

    //После изменения списка районов.
    useEffect(() => {
        if (districtsList) {
            setSelectedDistrict(districtsList[0]) //назначаю выбранным по умолчанию первый район(ХК)
            setIsStartLoading(false) //выключаю лоадер(показываю карту с сотами)
        }
    }, [districtsList])

    //После каждого удачного ввода пароля меняется страница.
    useEffect(() => {
        if (isAuth) {
            setIsMainPage(false)
        }
    }, [isAuth])

    //Изменяет выбранный район.
    function selectDistrict(mo) {
        setSelectedDistrict(mo)
    }

    return (
        <div className={selectBackgroundImageBySeason()}>
            <div className="backgroundShadow"/>

            <div className="header">
                <div className="headerBackground">
                    <img src={emblem} className="emblem"/>
                    <div className="titleContainer">
                        <div className="title">
                            Хабаровский край
                        </div>
                        <div className="annotation">
                            Основные демографические показатели <br/> (оперативные данные)
                        </div>
                    </div>
                </div>
            </div>

            <div className="body">
                {
                    isStartLoading ?
                        <Loader/> :
                        <>
                            <div className="bodyInfoContainer">
                                {
                                    districtsList &&
                                    <SlowTransition>
                                        <InfoBoard
                                            district={selectedDistrict}
                                            dfo={districtsList[1]}
                                            rf={districtsList[2]}
                                        />
                                    </SlowTransition>
                                }
                            </div>

                            <div className="bodyMapContainer">
                                {districtsList &&
                                    <HoneycombsMap
                                        DistrictsList={districtsList}
                                        selectDistricts={selectDistrict}
                                        selectedDistricts={selectedDistrict}
                                    />
                                }
                            </div>
                        </>
                }
            </div>
            <div className="pageHandler" onClick={() => setIsAuthModal(true)}>Обновить данные</div>

            <Modal active={isAuthModal} setActive={setIsAuthModal}>
                <AuthBoard
                    setIsAuth={setIsAuth}
                    isAuthModal={isAuthModal}
                    setIsAuthModal={setIsAuthModal}
                    setAuthPassword={setAuthPassword}
                />
            </Modal>
        </div>
    );
};

export default MainPage;