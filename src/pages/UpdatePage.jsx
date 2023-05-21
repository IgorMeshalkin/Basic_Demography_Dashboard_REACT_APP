import React, {useEffect, useState} from 'react';
import {selectBackgroundImageBySeason} from "../utils/usefullFunctions";
import UpdateBoard from "../components/UpdateBoard/UpdateBoard";
import DistrictsAPI from "../API/DistrictsAPI";

//Страница содержащая форму заполнения данных.
const UpdatePage = ({setIsMainPage, authPassword, setAuthPassword}) => {
    function backToMain() {
        setAuthPassword('')
        setIsMainPage(true)
    }

    return (
        <div>
            <div className={selectBackgroundImageBySeason()}/>
            <div className="backgroundShadow"/>
            <UpdateBoard
                authPassword={authPassword}
            />
            <div className="pageHandler" onClick={backToMain}>Вернуться на главную</div>
        </div>
    );
};

export default UpdatePage;