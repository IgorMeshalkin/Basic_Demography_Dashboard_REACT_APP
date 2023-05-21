import React, {useEffect, useState} from 'react';
import './AuthBoard.css';
import PasswordInput from "../UI/PasswordInput/PasswordInput";
import LineLoader from "../LineLoader/LineLoader";
import AuthAPI from "../../API/AuthAPI";

const AuthBoard = ({setIsAuth, isAuthModal, setIsAuthModal, setAuthPassword}) => {
    //Введённый пользователем пароль
    const [password, setPassword] = useState('')

    //Проверяется ли пароль в данный момент
    const [isLoading, setIsLoading] = useState(false)

    //Были ли неудачные попытки отправки пароля
    const [isWereFailedAttempts, setIsWereFailedAttempts] = useState(false)

    //При каждом закрытии модального окна все настройки данного меню возвращаются в первоначальное состояние
    useEffect(() => {
        if (!isAuthModal) {
            setPassword('')
            setIsLoading(false)
            setIsWereFailedAttempts(false)
        }
    }, [isAuthModal])

    //Закрывает модальное окно и позволяет открыть форму заполнения данных если пароль верный. И предлагает попробовать снова если не верный.
    function submit() {
        setIsLoading(true)
        AuthAPI.isCorrectPassword({Password: password}).then(res => {
            if (res.status === 200) {
                setAuthPassword(password)
                setIsAuth(true)
                setIsLoading(false)
                setIsAuthModal(false)
            } else {
                setIsLoading(false)
                setIsWereFailedAttempts(true)
            }
        }).catch(() => {
            setIsLoading(false)
            setIsWereFailedAttempts(true)
        })
    }

    function onKeyPress(event) {
        if (event.key === 'Enter') {
            submit();
        }
    }

    return (
        <div className="aubMain">
            <div className="aubTitle">
                {
                    isWereFailedAttempts ?
                        <>Вы ввели неверный пароль. Попробуйте ещё раз.</> :
                        <>Для изменения данных необходимо ввести пароль:</>
                }
            </div>
            <div className="aubInputContainer">
                {
                    isLoading ?
                        <LineLoader/> :
                        <PasswordInput
                            setPassword={setPassword}
                            keyPress={onKeyPress}
                        />
                }
            </div>
            <div className="aubSubmitContainer" onClick={submit}>
                Отправить
            </div>
        </div>
    );
};

export default AuthBoard;