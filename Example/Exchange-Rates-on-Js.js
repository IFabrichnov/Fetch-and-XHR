const url = "https://api.coingecko.com/api/v3/coins/";

//первое получение данных и отрисовка
const apiData = () => {
    fetch(url)
        .then(data => {
            return data.json()
        })
        .then(data => {
            console.log(data);

            firstDataItems(data);
        });
};

//первое создание таблицы и наполнение контентом
const firstDataItems = (el) => {
    let key;

    for (key in el) {
        createTable(el, key);
    }
};

//создание таблицы с контентом
const createTable = (el, key) => {

    const row1 = document.createElement('td');

    const row2 = document.createElement('td');

    rowClass(row1, row2);

    createRow(el, key, row1, row2);

    createRowsData(el, key, row1, row2);

};

//присвоение классов
const rowClass = (firstRow, secondRow) => {
    firstRow.classList.add('row1');
    secondRow.classList.add('row2');
};

//создание строки
const createRow = (el, key, firstRow, secondRow) => {
    const tableItem = document.getElementById('table');
    const col = document.createElement('tr');
    col.classList.add('tr');
    //задал id строке
    col.setAttribute('id', el[key].id);

    col.append(firstRow, secondRow);
    tableItem.append(col);
};


//заполнение строки контентом
const createRowsData = (el, key, firstRow, secondRow) => {
    firstRow.textContent = el[key].id;
    secondRow.textContent = el[key].market_data.current_price.rub;
};


apiData();

//второе получение и замена данных
const apiDataSecond = () => {
    fetch(url)
        .then(data => {
            return data.json()
        })
        .then(data => {
            secondDataItems(data);
        });
};

//сравнение с старыми данными и их отрисовка
const secondDataItems = (el) => {
    let key;

    for (key in el) {
        matchingData(el, key);
    }
};

//нахождение старых и новых данных, с последующей отрисовкой новых
const matchingData = (el, key) => {
    //нахождение строки с старыми данными
    const colId = el[key].id;
    const colIdOld = document.getElementById(colId);
    //старое значение
    const oldRow = colIdOld.lastChild.textContent;
    const oldValue = parseInt(oldRow);
    //новая строка
    const row2 = colIdOld.lastChild;

    rowsDataAfterMatching(row2);

    //новое значение
    const newRow = parseInt(row2.textContent);

    //подсвет желтым, зеленым или красным, в зависимости от значения
    compare(oldValue, newRow, row2);
};

//отрисовка новых данных в строке
const rowsDataAfterMatching = (rowItem) => {
    // row2.textContent = el[key].market_data.current_price.rub;
    rowItem.textContent = Math.round(Math.random() * (100 - 1) + 1);
};

//подсвет
const compare = (valueOld, currentValue, lengthItem) => {
    if (valueOld == currentValue) {
        hightLight('yellow', lengthItem);
    } else if (valueOld < currentValue) {
        hightLight('green', lengthItem);
    } else {
        hightLight('red', lengthItem);
    }
};

//добавление и удаление класса
const hightLight = (color, lengthItem) => {
    lengthItem.classList.add(color);

    setTimeout(() => {
        lengthItem.classList.remove(color);
    }, 1000);
};

setInterval(apiDataSecond, 5000);
