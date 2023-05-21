//Условная величина, заменяющая null (необходимость связана с особенносями REST API на ASP.NET)

export const conditionalNumber = -1001;

//Возвращает URL для обращения к API
export const getURL = () => {
    // return 'https://basic-dmg-api.medkhv.ru/';
    return 'https://basic-dmg.medkhv.ru/api';
}

//меняет фоновое изображение в зависимости от времени года
export const selectBackgroundImageBySeason = () => {
    const currentMonth = new Date().getMonth();
    if ((currentMonth >= 0 && currentMonth < 2) || currentMonth === 11) {
        return 'App winter'
    } else if (currentMonth >= 2 && currentMonth < 5) {
        return 'App spring'
    } else if (currentMonth >= 5 && currentMonth < 8) {
        return 'App summer'
    } else {
        return 'App autumn'
    }
}

//изменяет видимость элементов лоадера
export const changeVisible = (isVisible, setIsVisible, time) => {
    if (isVisible) {
        const timeout = setTimeout(() => {
            setIsVisible(false)
        }, time)
        return () => {
            clearTimeout(timeout);
        }
    } else {
        const timeout = setTimeout(() => {
            setIsVisible(true)
        }, time)
        return () => {
            clearTimeout(timeout);
        }
    }
}

//возвращает название периода в строке вида: "ГГГГ(КВ)"
export const getPeriodName = (period) => {
    if (period) {
        if (String(period.SequenceNumber).length === 4) {
            return period.SequenceNumber
        } else {
            const string = String(period.SequenceNumber);
            let year = string.substring(0, 4)
            let quarter = ''
            // eslint-disable-next-line default-case
            switch (string.substring(4)) {
                case '1':
                    quarter = '(I)'
                    break;
                case '2':
                    quarter = '(II)'
                    break;
                case '3':
                    quarter = '(III)'
                    break;
                case '4':
                    quarter = '(IV)'
                    break;
            }
            return year + quarter;
        }
    }
}

//возвращает название периода в строке вида: "ГГГГ год. КВ квартал."
export const getPeriodFullName = (period) => {
    let quarter;
    // eslint-disable-next-line default-case
    switch (period.Quarter) {
        case 1:
            quarter = ' год. 1-й квартал'
            break;
        case 2:
            quarter = ' год. 2-й квартал'
            break;
        case 3:
            quarter = ' год. 3-й квартал'
            break;
        case 4:
            quarter = ' год. 4-й квартал'
            break;
    }
    return period.Year + quarter;
}

//Проверяет есть ли в форме данные которые невозможно преобразовать в число и возвращает массив этих данных
export const checkInvalidValues = (data, indicatorsList) => {
    let result = []
    indicatorsList.forEach(ind => {
        if (data[ind.EnglishName] !== '') {
            const float = parseFloat(data[ind.EnglishName])
            if (isNaN(float)) {
                result.push({name: ind.RussianName, value: data[ind.EnglishName]})
            }
        }
    })
    return result;
}

//Готовит данные к отправке на обновление по API. Подготовка заключается в парсинге всех значений в числа.
export const prepareDataForUpdate = (data, indicatorsList) => {
    let result = {...data}

    indicatorsList.forEach(ind => {
        let value;
        if (result[ind.EnglishName] === '') {
            value = conditionalNumber
        } else {
            value = parseFloat(result[ind.EnglishName])
        }
        result = {...result, [ind.EnglishName]: value}
    })

    return result;
}

//возвращает период содержащий последний завершённый квартал исходя из текущей даты и информацию о том есть такой период в системе или нет.
export const checkLastPeriod = (periods) => {
    const lastPeriod = getLastPeriod(periods)
    const nextPeriod = getNextPeriod()
    if (lastPeriod.year === nextPeriod.year && lastPeriod.quarter === nextPeriod.quarter) {
        return {...nextPeriod, result: false} //возвращаю новый период со свойством result:false, которое говорит о том что новый период создан не будет т.к. такой уже есть
    } else {
        return {...nextPeriod, result: true} //возвращаю новый период со свойством result:true, которое говорит о том что новый период нужно создать т.к. такого периода ещё нет.
    }
}

//возвращает последний период из списка
const getLastPeriod = (periods) => {
    // periods = periods.filter(p => p.Year !== 2023)
    periods.sort((x, y) =>
        x.Year > y.Year ? -1 : 1
    )
    const lastYearPeriods = periods.filter(per => per.Year === periods[0].Year)
    lastYearPeriods.sort((x, y) =>
        x.Quarter > y.Quarter ? -1 : 1
    )
    return {year: lastYearPeriods[0].Year, quarter: lastYearPeriods[0].Quarter}
}

//возвращает период который должен быть создан на данный момент исходя из текущей даты.
const getNextPeriod = () => {
    const currentDate = new Date();
    let nextPeriodsQuarter;
    const currentMonth = currentDate.getMonth()
    if (currentMonth === 0 || currentMonth === 1 || currentMonth === 2) {
        nextPeriodsQuarter = 4
    } else if (currentMonth === 3 || currentMonth === 4 || currentMonth === 5) {
        nextPeriodsQuarter = 1
    } else if (currentMonth === 6 || currentMonth === 7 || currentMonth === 8) {
        nextPeriodsQuarter = 2
    } else {
        nextPeriodsQuarter = 3
    }

    const nextPeriodsYear = nextPeriodsQuarter === 4 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    return {year: nextPeriodsYear, quarter: nextPeriodsQuarter}
}

export const isInputsMustReadOnly = (district, period) => {
    let result = false

    if (district.name !== 'Дальневосточный федеральный округ' && district.name !== 'Российская Федерация') {
        const yearAndQuarter = backParsePeriodFullName(period.name)
        const currentDate = new Date()
        if (currentDate.getFullYear() > yearAndQuarter[0] && yearAndQuarter[1] < 4) {
            result = true;
        } else if (currentDate.getFullYear() > yearAndQuarter[0] && yearAndQuarter[1] === 4 && currentDate.getMonth() > 2) {
            result = true;
        } else if ((currentDate.getFullYear() === yearAndQuarter[0] && yearAndQuarter[1] === 1 && currentDate.getMonth() > 5)
            || (currentDate.getFullYear() === yearAndQuarter[0] && yearAndQuarter[1] === 2 && currentDate.getMonth() > 8)) {
            result = true;
        }
    }

    return result;
}

//функция обратная getPeriodFullName(). Получает строку созданную этим методом и возвращает массив из двух чисел в формате [ГГГГ, КВ]
const backParsePeriodFullName = (string) => {
    let array = string.split(' год. ')
    array[1] = Array.from(array[1])[0]
    return [Number.parseInt(array[0]), Number.parseInt(array[1])];
}
