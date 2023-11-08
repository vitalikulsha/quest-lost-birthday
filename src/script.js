const state = [
	{
		id: 1,
		name: 'stage1-01',
		answer: ['2611', '0000'],
		message: 'И так, начнем!',
		hints: [
			'Код состоит из 4-х цифр',
			'Когда у тебя День рождения?'
		]
	},
	{
		id: 2,
		name: 'stage1-02',
		answer: ['БЕРЕЗА', 'БЕРЁЗА', 'БЕРЕЗОВЫЙ', 'БЕРЁЗОВЫЙ', '0000'],
		message: "Сохраняй все подсказки и находки, они тебе помогут!",
		hints: [
			'В каком классе учится девочка? (подсказка для поиска)',
			'Из какого дерева можно сделать сок? (подсказка для решения задания)'
		]
	},
	{
		id: 3,
		name: 'stage1-03',
		answer: ['789', '0000'],
		message: 'Мы опоздали.... но у нас есть возможность их догнать.',
		hints: ['Воспользуйся подсказками, найденными в коробке, для поиска кода']
	},
	{
		id: 4,
		name: 'stage1-04',
		answer: ['АВТО', 'АВТОМОБИЛЬ', 'МАШИНА', '0000'],
		message: 'Без чего нельзя управлять автомобилем?',
		hints: ['На чем мы можем поехать за злыми волшебниками?']
	},
	{
		id: 5,
		name: 'stage1-05',
		answer: ['ОВА269739', 'ОВА 269739', 'OBA269739', 'OBA 269739', '0000'],
		message: 'Ну наконец-то! Торопись!',
		hints: [
			'Количество символов в коде соответсвует номеру класса, в котором учится Светка Стрекозина.',
			'А может в документах ты что-то можешь найти?',
			'Каждый автомобиль, как и человек, имеет документ, удостоверяющий личность.'
		]
	},
	{
		id: 6,
		name: 'stage1-06',
		answer: ['250', '0000'],
		message: 'Молодец, ты такая сообразительная!',
		hints: ['На каком поезде можно добраться в Санкт-Петербург?']
	},
	{
		id: 7,
		name: 'stage1-07',
		answer: ['КАБАРАТНА ВЕРНИ ОБРАТНО', '0000'],
		message: "УРА-А-А-А! Мы справились!",
		hints: []
	},
	{
		id: 8,
		name: 'stage1-08',
		answer: [],
		message: "",
		hints: []
	}
];

const HELP_TITLE = '<span class="help__title">Подсказка: </span><br>';
const TIME_OUT = 120000;

const stages = document.querySelectorAll('.stage');
const alert = document.querySelector('.alert');
const alertMsg = document.querySelector('.alert__msg');
const overlay = document.querySelector('.overlay');
const btnAlert = document.querySelector('.btn.btn_alert');

//инициализация параметров
function init() {
	localStorage.stateNum = localStorage.stateNum || 1;
	localStorage.hintNum = 0;
}
init();

//обновляет этап согласно состоянию квеста
function updateStages() {
	for (let i = 0; i < localStorage.stateNum - 1; i++) {
		stages[i].querySelector('.btn_help').disabled = true;
		stages[i].querySelector('.btn_answer').disabled = true;
		stages[i].querySelector('.answer__input').disabled = true;
		stages[i].querySelector('.answer__input').value = state[i].answer[0];
	}

	for (let i = 0; i < localStorage.hintNum; i++) {
		let hint = createHint(localStorage.stateNum - 1, i);
		addHint(stages[localStorage.stateNum - 1], hint);
	}

	for (let i = localStorage.stateNum; i < stages.length; i++) {
		stages[i].style.display = 'none';
	}

	for (let i = 0; i < state.length; i++) {
		if (state[i].hints.length === 0) {
			stages[i].querySelector('.btn_help').style.display = 'none';
		}
	}
	if (+localStorage.stateNum === state.length + 1) return;
	stages[localStorage.stateNum - 1].querySelector('.btn_help').disabled = true;
	setTimeout(() => stages[localStorage.stateNum - 1].querySelector('.btn_help').disabled = false, TIME_OUT);
}
updateStages();

//создает подсказку в теге li
function createHint(stateNum, hintNum) {
	let hint = document.createElement('li');
	hint.classList.add('help__text');
	hint.innerHTML = HELP_TITLE + state[stateNum].hints[hintNum];
	return hint;
}

//добавляет подсказку к списку подсказок
function addHint(stage, hint) {
	const hintList = stage.querySelector('.help');
	hintList.append(hint);
}

//обновляет счетчик подсказок
function updateHintNum(stage) {
	const maxHintNum = state[localStorage.stateNum - 1].hints.length - 1;
	stage.querySelector('.btn_help').disabled = true;
	if (localStorage.hintNum < maxHintNum) {
		localStorage.hintNum++;
		setTimeout(() => stage.querySelector('.btn_help').disabled = false, TIME_OUT);
	}
}

//событие - добавление подсказки
for (let stage of stages) {
	stage.querySelector('.btn_help').addEventListener('click', function () {
		let hint = createHint(localStorage.stateNum - 1, localStorage.hintNum);
		addHint(stage, hint);
		updateHintNum(stage);
	});
}

//проверяет ответ
function checkAnswer(stage) {
	const answer = stage.querySelector('.answer__input').value.toUpperCase().trim();
	return state[localStorage.stateNum - 1].answer.includes(answer);
}

//обрабатывает ответ и меняет состояние
function changeState(stage) {
	generatorMessage(state[localStorage.stateNum - 1].message);
	localStorage.stateNum++;
	localStorage.hintNum = 0;
	stage.querySelector('.btn_help').disabled = true;
	stage.querySelector('.btn_answer').disabled = true;
	stage.querySelector('.answer__input').disabled = true;
	if (+localStorage.stateNum === state.length + 1) return;
	if (localStorage.stateNum - 1 < stages.length) {
		stages[localStorage.stateNum - 1].style.display = 'flex';
		stages[localStorage.stateNum - 1].querySelector('.btn_help').disabled = true;
		setTimeout(() => stages[localStorage.stateNum - 1].querySelector('.btn_help').disabled = false, TIME_OUT);
	}
}

//генерирует сообщение в модальном окне
function generatorMessage(msg) {
	alertMsg.textContent = msg;
}

//переключение предупреждающего сообщения
function toggleAlert() {
	alert.classList.toggle('active');
	overlay.classList.toggle('active');
}

//событие - отправить ответ по клику по кнопке
for (let stage of stages) {
	stage.querySelector('.btn_answer').addEventListener('click', function () {
		if (checkAnswer(stage)) {
			changeState(stage);
		} else {
			generatorMessage('Неправильно! Подумай еще или воспользуйся подсказкой.');
		};
		toggleAlert();
	});
}

//при нажатии на logo обнуляется localStorage
document.querySelector('.logo').addEventListener('click', function () {
	localStorage.stateNum = 1;
	localStorage.hintNum = 0;
	location.reload();
});

//закрытие предупреждающего сообщения
btnAlert.addEventListener('click', toggleAlert);

let isPlay = false;

//переключения всплывающего сообщения
function toggleFotoMsg() {
	fotoMsg.classList.toggle('active');
	overlay.classList.toggle('active');
}