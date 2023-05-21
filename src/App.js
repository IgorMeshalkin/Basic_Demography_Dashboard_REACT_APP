import './App.css';
import React, {useEffect, useState} from "react";
import MainPage from "./pages/MainPage";
import UpdatePage from "./pages/UpdatePage";

function App() {
    //Активна ли в данный момент главная страница.
    //localStorage применяется в случае создания нового периода, тогда нужно после обновления открыть форму заполнения данных, а не главную страницу.
    const [isMainPage, setIsMainPage] = useState(localStorage.getItem('isMainPage') !== null ? false : true)
    //react-router-dom не применяется в связи с политикой информационной безопасности КГБУЗ "МИАЦ" МЗ ХК
    //проблемы с загрузкой библиотек, т.к. в приложении всего две страницы было принято решение обойтись таким способом.

    //При каждом обновлении очищается локальное хранилище.
    useEffect(() => {
        localStorage.clear();
    }, [])

    //Состояние которое хранит пароль аунтифицированного юзера
    const [authPassword, setAuthPassword] = useState('')

    return (
        <>
            {
                isMainPage ?
                    <MainPage
                        setIsMainPage={setIsMainPage}
                        setAuthPassword={setAuthPassword}
                        authPassword={authPassword}
                    /> :
                    <UpdatePage
                        setIsMainPage={setIsMainPage}
                        authPassword={authPassword}
                        setAuthPassword={setAuthPassword}
                    />
            }
        </>
    );
}

export default App;
