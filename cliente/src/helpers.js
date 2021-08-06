const { CURRENCY_CODES } = require('./constants');

function formatDate(date) {
    const newDate = new Date(date);
    const day =
        newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();

    const month =
        newDate.getMonth() + 1 < 10
            ? `0${newDate.getMonth() + 1}`
            : newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${year}-${month}-${day}`;
}

function dateIsPrevious(date_1, date_2) {
    if (date_1 === null || date_2 === null || date_1 === '' || date_2 === '')
        return false;
    if (date_1.getFullYear() > date_2.getFullYear()) return false;
    if (date_1.getFullYear() < date_2.getFullYear()) return true;
    if (date_1.getFullYear() === date_2.getFullYear()) {
        if (date_1.getMonth() > date_2.getMonth()) return false;
        if (date_1.getMonth() < date_2.getMonth()) return true;
        if (date_1.getMonth() === date_2.getMonth()) {
            if (date_1.getDate() > date_2.getDate()) return false;
            if (date_1.getDate() < date_2.getDate()) return true;
        }
    }
    return true;
}

function handleClickOptionsSearch(button, setOptionSearch, setOneWay) {
    const button_1 = document.querySelector('.oneway-option-1');
    const button_2 = document.querySelector('.oneway-option-2');

    if (button.value === 'Solo ida') {
        setOptionSearch({
            soloIda: true,
            idaYvuelta: false,
        });
        setOneWay(true);

        button_1.style.backgroundColor = '#132C33';
        button_1.style.color = '#fff';
        button_2.style.backgroundColor = 'rgb(255,255,255,.8)';
        button_2.style.color = '#132C33';
    }

    if (button.value === 'Ida y vuelta') {
        setOptionSearch({
            soloIda: false,
            idaYvuelta: true,
        });
        setOneWay(false);
        button_2.style.backgroundColor = '#132C33';
        button_2.style.color = '#fff';
        button_1.style.backgroundColor = 'rgb(255,255,255,.8)';
        button_1.style.color = '#132C33';
    }
}

function getSymbol(exchange) {
    const currency = CURRENCY_CODES.find(
        ({ currency }) => currency === exchange
    );
    return currency.symbol;
}

module.exports = {
    dateIsPrevious,
    handleClickOptionsSearch,
    formatDate,
    getSymbol,
};
