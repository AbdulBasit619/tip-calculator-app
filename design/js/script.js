////// Activating Strict Mode
'use strict';

///////////////////////////////////
///// SELECTING ELEMENTS

const inputBill = document.querySelector('#bill');
const inputTips = document.querySelectorAll('.input__tip');
const inputCustom = document.querySelector('.input__custom');
const inputPeople = document.querySelector('#people');

const containerBill = document.querySelector('.bill__container');
const containerPeople = document.querySelector('.people__container');

const messageError = document.querySelector('.message--error');

const outputTip = document.querySelector('.tip_per_person');
const outputTotal = document.querySelector('.total_bill');
const btnReset = document.querySelector('.reset');

///////////////////////////////////
///// IMPLEMENTING FUNCTIONALITY

inputBill.addEventListener(
  'focus',
  function () {
    containerBill.style.borderColor = 'hsl(172, 67%, 45%)';
  },
  true
);

inputBill.addEventListener(
  'blur',
  function () {
    containerBill.style.borderColor = '#fff';
  },
  true
);

inputPeople.addEventListener(
  'focus',
  function () {
    if (!inputPeople.value) {
      containerPeople.style.borderColor = 'hsl(0, 100%, 67%)';
      return;
    }

    containerPeople.style.borderColor = 'hsl(172, 67%, 45%)';
  },
  true
);

inputPeople.addEventListener(
  'blur',
  function () {
    if (!inputPeople.value) {
      containerPeople.style.borderColor = 'hsl(0, 100%, 67%)';
      return;
    }
    containerPeople.style.borderColor = '#fff';
  },
  true
);

const specialChars = ['-', '+', 'e'];
let inputData = [[0], [0], [1]];

const inputPeopleRegex = /\d/;

// Calculating the tip per person and net bill

let bill = inputData[0];
let tipPercent = inputData[1];
let numberOfPeople = inputData[2];

btnReset.addEventListener('click', function (e) {
  inputData[0].shift();
  inputData[0].push(0);
  inputData[1].shift();
  inputData[1].push(0);
  inputData[2].shift();
  inputData[2].push(1);
  outputTip.textContent = '0.00';
  outputTotal.textContent = '0.00';

  messageError.classList.remove('hidden');
  containerPeople.style.borderColor = 'hsl(0, 100%, 67%)';

  inputBill.value = '';
  inputCustom.value = '';
  inputPeople.value = '';
});

const calculateTotalTip = (tipPercent, bill) => (tipPercent / 100) * bill;

function calculateTipPerPerson(numberOfPersons) {
  const tipPerPerson =
    Math.trunc((calculateTotalTip(tipPercent, bill) / numberOfPersons) * 100) /
    100;
  return tipPerPerson || '0.00';
}

function calculateNetBill(bill) {
  const netBill = Number(bill) + Number(calculateTotalTip(tipPercent, bill));

  return Math.trunc(netBill * 100) / 100 || '0.00';
}

const calculateTotalPerPerson = () =>
  Math.trunc((calculateNetBill(bill) / numberOfPeople) * 100) / 100;

function calculateOutput() {
  const tipPerPerson = calculateTipPerPerson(numberOfPeople);
  const netTotalPerPerson = calculateTotalPerPerson();

  if (!numberOfPeople && !netTotalPerPerson && !tipPerPerson) {
    outputTip.textContent = '0.00';
    outputTotal.textContent = '0.00';
    btnReset.setAttribute('disabled');
    return;
  }

  if (numberOfPeople && netTotalPerPerson && tipPerPerson) {
    outputTip.textContent = tipPerPerson.toString();
    outputTotal.textContent = netTotalPerPerson.toString();
    btnReset.removeAttribute('disabled');
  }
}

// Reading values from inputs
inputBill.addEventListener('input', e => {
  let inputVal = inputBill.value;

  if (specialChars.includes(e.data)) {
    inputBill.value = inputVal.slice(0, -1);
    return;
  }

  if (inputVal.includes('.')) {
    const decimalPlaces = inputVal.split('.')[1].length;
    if (decimalPlaces > 2) {
      const factor = Math.pow(10, 2);
      inputBill.value = Math.trunc(inputVal * factor) / factor;
    }
  }

  inputData[0].shift();
  inputData[0].push(parseFloat(inputBill.value));
  calculateOutput();
});

inputTips.forEach(inputTip => {
  inputTip.addEventListener('click', function (e) {
    inputData[1].shift();
    inputData[1].push(parseInt(e.target.value));
    calculateOutput();
  });
});

inputCustom.addEventListener('input', function (e) {
  const inputVal = inputCustom.value;
  if (e.target.value === '') {
    inputCustom.value = inputVal.slice(0, -1);
    return;
  }

  inputData[1].shift();
  inputData[1].push(parseFloat(inputCustom.value));
  calculateOutput();
});

inputPeople.addEventListener('input', function (e) {
  const inputVal = inputPeople.value;

  if (!e.target.value) {
    containerPeople.style.borderColor = 'hsl(0, 100%, 67%)';
  }

  if (e.target.value === '') {
    inputPeople.value = inputVal.slice(0, -1);
    return;
  }

  if (e.target.value < 1) {
    messageError.classList.remove('hidden');
    return;
  }

  containerPeople.style.borderColor = 'hsl(172, 67%, 45%)';
  messageError.classList.add('hidden');
  inputData[2].shift();
  inputData[2].push(parseInt(inputPeople.value));
  calculateOutput();
});
