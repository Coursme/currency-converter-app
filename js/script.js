const dropList = document.querySelectorAll("form select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        // По умолчанию выбираем USD как валюту ИЗ и NPR как валюту В
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "NPR" ? "selected" : "";
        // Создаем тег option, устанавливая код валюты как текст и значение
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // Вставляем тег option внутрь тега select
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); // Вызываем loadFlag, передавая целевой элемент как аргумент
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ // Если код валюты из списка стран равен значению выбранной опции
            let imgTag = element.parentElement.querySelector("img"); // Выбираем тег img соответствующего списка
            // Устанавливаем флаг, используя код страны выбранной валюты
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=> {
    getExchangeRate(); // Получаем обменный курс при загрузке страницы
});

getButton.addEventListener("click", e => {
    e.preventDefault(); // Предотвращаем отправку формы
    getExchangeRate(); // Получаем обменный курс при нажатии кнопки
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=> {
    let tempCode = fromCurrency.value; // Временный код валюты ИЗ
    fromCurrency.value = toCurrency.value; // Устанавливаем код валюты В в качестве кода валюты ИЗ
    toCurrency.value = tempCode; // Устанавливаем временный код валюты в качестве кода валюты В
    loadFlag(fromCurrency); // Вызываем loadFlag для элемента из списка ИЗ
    loadFlag(toCurrency); // Вызываем loadFlag для элемента из списка В
    getExchangeRate(); // Получаем обменный курс
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    // Если пользователь не ввел значение или ввел 0, то по умолчанию ставим 1
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    // API-key можно получить - https://app.exchangerate-api.com/
    const apiKey = 'f2cd93cc5c526e3204de8e90';
    exchangeRateTxt.innerText = "Получаем обменный курс...";
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    // Получаем ответ от API и обрабатываем его, преобразуя в объект JS
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value]; // Получаем курс обмена для выбранной валюты В
        let totalExRate = (amountVal * exchangeRate).toFixed(2); // Умножаем введенную пользователем сумму на курс выбранной валюты В
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{ // Если произошла ошибка (например, пользователь офлайн), выполняется эта часть
        exchangeRateTxt.innerText = "Что-то пошло не так";
    });
}
