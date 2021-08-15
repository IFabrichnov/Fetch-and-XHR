# Получение данных с сервера  без перезагрузки страницы

## Появление AJAX

Первоначальная загрузка страницы в Интернете была простой - мы отправляли запрос на сервер  web-сайта, и если всё работает, как и должно, то вся необходимая информация о странице будет загружена и отображена на нашем компьютере.

![1](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/1.jpg)

Проблема данной модели заключается в том, что всякий раз, когда мы хотитим обновить любую часть страницы, например, чтобы отобразить новый набор продуктов или загрузить новую страницу, нам нужно снова загрузить всю страницу.

Это привело к созданию технологий  позволяющих веб-страницам запрашивать небольшие фрагменты данных (например, HTML, XML, JSON или обычный текст) и отображать их только при необходимости, помогая решать проблему, описанную выше.

Это достигается с помощью таких API, как **XMLHttpRequest** или - более новой - **Fetch API.** Эти технологии позволяют веб-страницам напрямую обрабатывать запросы HTTP для определённых ресурсов, доступных на сервере, и форматировать результирующие данные по мере необходимости перед их отображением.

![2](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/2.jpg)

Справа AJAX модель. Вначале с помощью JavaScript создаем обработчик и отправяем данные через HTTP, далее, когда сервер их обработает, он отправляет пользователю ответ в виде XML, обработчик AJAX сразу обрабатывает ланные. 

## Использование XMLHttpRequest
**Метод 'GET'**

Для рассмотрения примеров, я использовал сервис JSONPlaceholder. Это фейк онлайн Rest api для тестирования и прототипирования.
То есть для нашей задачи: разобраться как мы можем отправлять различные запросы - это более чем подходит.

```javascript
const requestURL = 'https://jsonplaceholder.typicode.com/users'
```

Запросы будем делать по данному URL.

Создаем переменную **xhr** через конструктор глобального класск XMLHttpRequest. Дальше можем работать с инстансом данного класса и отправлять какие-либо запросы.
Для этого нам в первую очередь необходимо у объекта **xhr** вызвать метод **open**, который откроет новое соединение. 
Первым параметром нам сюда нужно передать метод по которому будем делать запрос - 'GET' (получаем данные).
Вторым параметром передаем URL. 

После того как открыли запрос, надо его отправить. Поэтому у объекта **xhr** вызываем метод **.send**. 
Но, чтобы обработать полученные данные, мы должны перед тем, как отправим определить функцию **onload**.

```javascript
const xhr = new XMLHttpRequest()

xhr.open('GET', requestURL)

xhr.onload = () => {
    console.log(xhr.response)
}
xhr.send() 
```

![3](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/3.jpg)

При просмотре консоли, получаем те данные, которые нам были нужны. Но получаем не объект, а строку. Поэтому, чтобы получить объект, нам надо передать объекту **xhr**, что надо распарсить ответ.


```javascript
const xhr = new XMLHttpRequest()

xhr.open('GET', requestURL)

xhr.responseType = 'json'

xhr.onload = () => {
    console.log(xhr.response)
}
xhr.send() 
```

Далее, чтобы обработать ошибки, у объекта **xhr** присутствует функция **onerror**. 

```javascript
xhr.onerror = () => {
        console.log(xhr.response)
}
```

Если ответ от сервера успешный - попадаем в **onload**, если ошибки есть, то в **onerror**.
Бывают ситуации, когда сервер отвечает без ошибки, но несет статус код, который говорит обратном. Но при этом мы  не попадаем в **onerror**, так как это другого типа ошибки.
Поэтому, чтобы универсально обрабатывать ошибки, мы можем обратиться к методу **onload**.

```javascript
const xhr = new XMLHttpRequest()

xhr.open('GET', requestURL)
		
xhr.responseType = 'json'
       
xhr.onload = () => {
    if (xhr.status >= 400) {
        console.error(xhr.response)
    } else {
        console.log(xhr.response)
	}
}
xhr.send() 	
```
Спрашиваем, если **xhr** и его статус больше 400 (все, что выше 400 - ошбика), то выкидываем ошибку.

Сейчас мы работаем с обычными колбэками, и это выглядит некрасиво и код неуниверсальный. Было бы неплохо внедрить промисы.
Пишем универсальную функцию **sendRequest**, где будем выполнять всю логику. Мы хотим, чтоб данная функция оборачивала всю логику в промис и возвращала промис.

```javascript
function sendRequest(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        xhr.responseType = 'json'

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }

        xhr.send()
    })
} 
```
Передаем в **sendRequest** параметры - method, url.
Теперь можно обратиться к **sendRequest** и вызвать его с методом **GET**. 

```javascript
sendRequest('GET', requestURL)
    .then(data => console.log(data))
    .catch(err => console.log(err))
```
![4](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/4.jpg)

Видим, что все работает и получаем нужные нам данные. 

**Метод 'POST'**

Для метода **POST** нужен третий параметр - body (то с чем отправляется запрос). Чтобы было наглядно понятно, создаем переменную **body** и записываем в нее данные.
Всё это передаём в **sendRequest**.

```javascript
const body = {
    name: 'Ivan',
    age: 28
}

sendRequest('POST', requestURL, body)
    .then(data => console.log(data))
    .catch(err => console.log(err))
```
Теперь, чтобы обработать данные **body** в методе **sendRequest**, мы можем передать их в метод **send**. Но, чтобы данные отправились корректно, надо отправлять не объект, а строку. Поэтому воспользуемся методом **JSON.stringify**.
```javascript
xhr.send(JSON.stringify(body))
```
Но чтобы получить валидный ответ, мы должны указать, что отправляем данные в формате JSON. Это делается с помощью хэдеров. Обращаемся к объекту **xhr** и вызываем метод **setRequestHeader** (установить хэдеры, которые отправляются с запросом).
```javascript
function sendRequest(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }

        xhr.send(JSON.stringify(body))
    })
}
```
Теперь все работает. Таким образом мы можем отправлять асинхронные запросы без библиотек, с базовым **XHR**.

![5](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/5.jpg)

## Fetch

**Метод 'GET'**

По аналогии в **XHR** начнем с **GET** запроса. 
Первым параметром метод **fetch** принимает в себя url, и впринципе этого достаточно, чтобы выполнить метод **GET**. 
```javascript
function sendRequest(method, url, body = null) {
    return fetch(url)
}

sendRequest('GET', requestURL)
    .then(data => console.log(data))
    .catch(err => console.log(err))
```
Смотрим, что сейчас выдает консоль.

![6](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/6.jpg)

На данный момент мы получаем не совсем то, что хотели бы видеть (массив пользователей), а объект **Response**. 
Чтобы это исправить, можно *зачейнить* метод **fetch** с помощью **.then**, получить *response* (то, что получили и сервера, но обернуто в Fetch API) и у *response* можем вызываем метод **json** который распарсит наши данные в нужный нам формат.

```javascript
function sendRequest(method, url, body = null) {
    return fetch(url).then(response => {
        return response.json()
    })
}
```
Теперь получаем готовый набор объектов.

![7](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/7.jpg)

**Метод 'POST'**

Аналогично с **XHR** передается параметр *body*, котоырй нам необходимо обработать.
Чтобы это осуществить, в метод **fetch** вторым параметром передаем объект конфигурации: method, body, headers. Но для того, чтоб указать *хэдэры* нам нужно создать переменную **headers**.
```javascript
function sendRequest(method, url, body = null) {
    const headers = {
        'Content-Type': 'application/json'
    }

    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers
    }).then(response => {
        return response.json()
    })
}


const body = {
    name: 'Ivan',
    age: 28
}

sendRequest('POST', requestURL, body)
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

И если мы заглянем в консоль, то увидим, что метод **POST** работает.

![8](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/8.jpg)


## Пример получения данных с сервера без перезагрузки страницы с помощью Fetch

*Чтобы запустить проект, нужно перейти по ссылке на gh-pages:* [ссылка на проект](https://ifabrichnov.github.io/Dynamic-rate-of-cryptocurrencies/ "ссылка на проект")

![9](https://github.com/IFabrichnov/Fetch-and-XHR/tree/main/README-IMG/9.jpg)

## Пошаговое написание кода

**1.** Изначально написана функция apiData для получения и отрисовки данных с помощью fetch(). 

**2.** Далее пишу функцию для первой отрисовки таблицы и наполнения ее данными полученными через fetch().

```javascript
const firstDataItems = (el) => {
  let key;

  for (key in el) {
    createTable(el, key);
  }
};
```

**3.** Далее создается функция отрисовки таблицы с контентом 

```javascript
const createTable = (el, key) => {
  const row1 = document.createElement('td');
  const row2 = document.createElement('td');
  rowClass(row1, row2);
  createRow(el, key, row1, row2);
  createRowsData(el, key, row1, row2);
};
 
```

**4.** Для строк таблицы надо присвоить классы (rowClass), создаю данную функцию

```javascript
const rowClass = (firstRow, secondRow) => {
  firstRow.classList.add('row1');
  secondRow.classList.add('row2');
};
```

**5.** Создание строки 

```javascript
const createRow = (el, key, firstRow, secondRow) => {
  const tableItem = document.getElementById('table');
  const col = document.createElement('tr');
  col.classList.add('tr');
  //задал id строке
  col.setAttribute('id', el[key].id);
  col.append(firstRow, secondRow);
  tableItem.append(col);
};
```

**6.** Заполнение строки контентом (первая клетка название валюты, вторая – значение).

```javascript
const createRowsData = (el, key, firstRow, secondRow) => {
  firstRow.textContent = el[key].id;
  secondRow.textContent = el[key].market_data.current_price.rub;
};
```

**7.** После первой отрисовки – нужно получить новые данные и перерисовать их в таблице.

```javascript
const apiDataSecond = () => {
  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(data => {
      secondDataItems(data);
    });
};
```

**8.** Тут будет происходить сравнение с старыми данными и их замена в случае изменения

```javascript
const secondDataItems = (el) => {
  let key;
  for (key in el) {
    matchingData(el, key);
  }
};
```


**9.** Нахождение старых и новых данных, с последующей отрисовкой новых

```javascript
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
```

Также присутствует функция rowsDataAfterMatching, которая помещает новое значение в ячейку номер 2

```javascript
//отрисовка новых данных в строке
const rowsDataAfterMatching = (rowItem) => {
  // row2.textContent = el[key].market_data.current_price.rub;
  rowItem.textContent = Math.round(Math.random() * (100 - 1) + 1);
};
```

Функция compare, которая сравнивает цвета и выбирает в какой цвет покрасить ячейку.

```javascript
const compare = (valueOld, currentValue, lengthItem) => {
  if (valueOld == currentValue) {
    hightLight('yellow', lengthItem);
  } else if (valueOld < currentValue) {
    hightLight('green', lengthItem);
  } else {
    hightLight('red', lengthItem);
  }
};
```
В compare в свою очередь включает в себя функцию hightLight которая добавляет класс с цветом и через 1 секунду убирает его

```javascript
const hightLight = (color, lengthItem) => {
  lengthItem.classList.add(color);
  setTimeout(() => {
    lengthItem.classList.remove(color);
  }, 1000);
};
```

В завершении вызываю setInterval, который вызывает функцию apiDataSecond каждые 5 секунд.

```javascript
setInterval(apiDataSecond, 5000);
```
