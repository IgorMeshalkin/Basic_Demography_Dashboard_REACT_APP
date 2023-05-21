import React, {useEffect, useState} from 'react';
import './UpdateBoard.css'
import DropDownList from "../UI/DropDownList/DropDownList";
import DistrictsAPI from "../../API/DistrictsAPI";
import PeriodAPI from "../../API/PeriodsAPI";
import {checkInvalidValues, getPeriodFullName, prepareDataForUpdate} from "../../utils/usefullFunctions";
import IndicatorsAPI from "../../API/IndicatorsAPI";
import DataAPI from "../../API/DataAPI";
import DataInput from "../UI/DataInput/DataInput";
import Modal from "../Modal/Modal";
import DataLossWarning from "../DataLossWarning/DataLossWarning";
import LineLoader from "../LineLoader/LineLoader";
import UpdateFailedBoard from "./UpdateFailedBoard/UpdateFailedBoard";
import Loader from "../Loader/Loader";
import AddButton from "../UI/AddButton/AddButton";
import NextPeriodBoard from "../NextPeriodBoard/NextPeriodBoard";

const UpdateBoard = ({authPassword}) => {
    //состояние хранящее информацию о том первый раз загружается данная страница или нет
    const [isFirstRender, setIsFirstRender] = useState(true)

    //загружается ли страница в данный момент
    const [isPageLoading, setIsPageLoading] = useState(true)

    //список районов и выбранный в данный момент район
    const [districtList, setDistrictList] = useState()
    const [selectedDistrict, setSelectedDistrict] = useState()

    //список периодов и выбранный в данный момент период
    const [periodsFromAPI, setPeriodsFromAPI] = useState() //периоды такие какими они пришли из API для работы с добавлением нового периода
    const [periodList, setPeriodList] = useState() //периоды в формате для отображения в таблице
    const [selectedPeriod, setSelectedPeriod] = useState()

    //список индикаторов
    const [indicatorList, setIndicatorList] = useState([])
    const [selectedIndicator, setSelectedIndicator] = useState({}) //индикатор в инпуте которого стоит курсор

    //состояния для работы с загрузкой данных с сервера
    const [lastData, setLastData] = useState() //предыдущие данные (полученные от API) в этом же состоянии хранятся изменения которые вносит пользователь до того как сработает функция submit()
    const [isDataLoading, setIsDataLoading] = useState(true) //загружаются ли данные в настоящий момент

    //состояния необходимые для того что бы предупредить юзера о не сохранённых данных когда он пытается изменить район или период.
    const [dataIsChanged, setDataIsChanged] = useState(false) //изменялись ли данные, если нет то изменить район или период можно без предупреждений
    const [isOfferToSaveModal, setIsOfferToSaveModal] = useState(false) //активно ли модальное окно с предупреждением о возможной потере данных

    //состояния для работы с обновлением данных и предупреждении об ошибках во время обновления данных
    const [isDataUpdating, setIsDataUpdating] = useState(false) //обновляются ли данные в настоящий момент
    const [updateStatus, setUpdateStatus] = useState(0) //Статус обновления где -1 - данные не удалось сохранить, 1 - данные успешно сохранены, 0 - информация о статусе отсутствует
    const [invalidValues, setInvalidValues] = useState([]) //Массив содержащий значения которые невозможно распарсить в числа, в случае если таковые есть.
    const [updateFailedModal, setUpdateFailedModal] = useState(false) //активно ли модальное окно с информацией о неудавшейся попытке обновить данные

    //состояния для работы с созданием нового периода
    const [isNextPeriodModal, setIsNextPeriodModal] = useState(false) //открыто ли модальное окно для создания нового периода

    //Первоначальная загрузка списков из API
    useEffect(() => {
        if (isFirstRender) {
            let districtArray = []
            DistrictsAPI.getWithoutData().then(res => {
                res.data.map(item =>
                    districtArray.push({id: item.Id, name: item.FullName})
                )
                setDistrictList(districtArray)
                setSelectedDistrict(districtArray[0])
            })
            let periodArray = []
            PeriodAPI.get().then(res => {
                setPeriodsFromAPI(res.data)
                res.data.map(item =>
                    periodArray.push({id: item.Id, name: getPeriodFullName(item)})
                )
                periodArray.sort((x, y) =>
                    x.id > y.id ? -1 : 1
                )
                setPeriodList(periodArray)
                setSelectedPeriod(periodArray[0])
            })
            IndicatorsAPI.get().then(res => {
                setIndicatorList(res.data)
            })
        }
        setIsFirstRender(false)
    }, [])

    //Изменяет состояние isPageLoading после загрузки всех первоначальных списков(пропадает лоадер, появляется страница)
    useEffect(() => {
        if (districtList && selectedDistrict && periodList && selectedPeriod && indicatorList) {
            setIsPageLoading(false)
        }
    }, [districtList, selectedDistrict, periodList, selectedPeriod, indicatorList])

    //Загрузка данных при каждом изменении района или периода
    useEffect(() => {
        setUpdateStatus(0) //ставлю "пустой" статус обновления при каждом изменении района или периода
        if (selectedDistrict && selectedPeriod) {
            setIsDataLoading(true) //ставлю флажок, что началась загрузка данных(в инпутах появляется лоадер)
            DataAPI.get(selectedDistrict.id, selectedPeriod.id).then(res => {
                    setLastData(res.data)
                    setDataIsChanged(false) //ставлю флажок, что данные не изменялись.
                    setIsDataLoading(false) //ставлю флажок, что данные больше не загружаются(в инпутах пропадают лоадеры и появляются данные)
                }
            )
        }
    }, [selectedDistrict, selectedPeriod])

    //Поднимает выбранный район на верх списка (нужно для выпадающего списка)
    useEffect(() => {
        if (!isFirstRender) {
            setDistrictList([...districtList].sort((x, y) =>
                x.id === selectedDistrict.id ? -1 : 1
            ))
        }
    }, [selectedDistrict])

    //Поднимает выбранный период на верх списка (нужно для выпадающего списка)
    useEffect(() => {
        if (!isFirstRender) {
            setPeriodList([...periodList].sort((x, y) =>
                x.id === selectedPeriod.id ? -1 : 1
            ))
        }
    }, [selectedPeriod])

    //При каждом изменении статуса обновления, в зависимости от статуса открывает или закрывает модальное окно с информацией о неудавшейся попытке обновить данные.
    useEffect(() => {
        if (updateStatus === -1) {
            setUpdateFailedModal(true)
        } else {
            setUpdateFailedModal(false)
        }
    }, [updateStatus])

    //Открывает окно предупреждения о не сохранённых данных при переходе к другому району или периоду
    function activateDataLossWarning() {
        setIsOfferToSaveModal(true)
    }

    //Сохраняет форму или возвращает ошибку не позволяющую сохранить форму
    function submit() {
        const invalidValuesList = checkInvalidValues(lastData, indicatorList)
        if (invalidValuesList.length > 0) {
            setInvalidValues(invalidValuesList)
            setUpdateStatus(-1)
            return
        }

        setIsDataUpdating(true)
        setDataIsChanged(false)

        const preparedData = prepareDataForUpdate(lastData, indicatorList)

        DataAPI.update({...preparedData, Password: authPassword}).then(res => {
            if (res.status === 200) {
                setUpdateStatus(1)
            }
            setIsDataUpdating(false)
        }).catch(() => {
            setUpdateStatus(-1)
            setIsDataUpdating(false)
        })
    }

    //Вызывает модальное окно содержащее меню добавления нового периода.
    function addNewPeriod() {
        setIsNextPeriodModal(true)
    }
    const toNextInput = (event) => {
        if (event.key === 'Enter') {
            const currentIndex = indicatorList.indexOf(selectedIndicator)
            if (currentIndex < indicatorList.length - 1) {
                setSelectedIndicator(indicatorList[currentIndex + 1])
            }
        }
    };

    return (
        <div className="upbMain">
            <div className="updBoard">
                {
                    isPageLoading ?
                        <Loader/> :
                        <div className="upbPageContent">
                            <div className="upbTitle">Форма заполнения данных</div>
                            <div className="updDropDownListsContainer">
                                <div className="updDropDownListContainer">
                                    {
                                        districtList &&
                                        <DropDownList
                                            list={districtList}
                                            setSelectedItem={setSelectedDistrict}
                                            dataIsChanged={dataIsChanged}
                                            activateDataLossWarning={activateDataLossWarning}
                                        />
                                    }
                                </div>
                                <div className="updDropDownListContainer">
                                    {
                                        periodList &&
                                        <DropDownList
                                            list={periodList}
                                            setSelectedItem={setSelectedPeriod}
                                            dataIsChanged={dataIsChanged}
                                            activateDataLossWarning={activateDataLossWarning}
                                        />
                                    }
                                    <div className="updAddPeriodButtonContainer">
                                        <AddButton
                                            title={"Создать новый период"}
                                            isLoading={false}
                                            onClick={addNewPeriod}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="upbTableContainer">
                                <table className="upbTable">
                                    <thead></thead>
                                    <tbody className="upbTableBody">
                                    {indicatorList &&
                                        indicatorList.map(ind =>
                                            <tr key={ind.Id}>
                                                <td className="upbTableLeftColumn" title={ind.Title}>
                                                    {ind.RussianName}
                                                </td>
                                                <td className="upbTableRightColumn">
                                                    <DataInput
                                                        indicator={ind}
                                                        data={lastData}
                                                        setData={setLastData}
                                                        setDataIsChanged={setDataIsChanged}
                                                        setUpdateStatus={setUpdateStatus}
                                                        isDataLoading={isDataLoading}
                                                        selectedIndicator={selectedIndicator}
                                                        setSelectedIndicator={setSelectedIndicator}
                                                        toNext={toNextInput}
                                                        selectedPeriod={selectedPeriod}
                                                        selectedDistrict={selectedDistrict}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>

                            <div className="upbSubmitButtonContainer">
                                {dataIsChanged &&
                                    <div className="upbSubmitButton" onClick={submit}>Сохранить</div>
                                }
                                {
                                    isDataUpdating &&
                                    <LineLoader
                                        isSmall={false}
                                    />
                                }
                                {
                                    updateStatus === 1 &&
                                    <span className="ubSuccessfulUpdated">Данные успешно сохранены</span>
                                }
                            </div>
                        </div>
                }
                <Modal
                    active={isOfferToSaveModal}
                    setActive={setIsOfferToSaveModal}
                >
                    <DataLossWarning
                        submit={submit}
                        setDataIsChanged={setDataIsChanged}
                        setIsOfferToSaveModal={setIsOfferToSaveModal}
                    />
                </Modal>

                <Modal
                    active={updateFailedModal}
                    setActive={setUpdateFailedModal}
                >
                    <UpdateFailedBoard
                        invalidValuesList={invalidValues}
                        setUpdateStatus={setUpdateStatus}
                    />
                </Modal>

                <Modal
                    active={isNextPeriodModal}
                    setActive={setIsNextPeriodModal}
                >
                    <NextPeriodBoard
                        periods={periodsFromAPI}
                        isNextPeriodModal={isNextPeriodModal}
                        setIsNextPeriodModal={setIsNextPeriodModal}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default UpdateBoard;