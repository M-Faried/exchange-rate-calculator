const apiHttpReq =
  'https://prime.exchangerate-api.com/v5/3f694a2ff121b0dec9d11386/latest/';

const selectCurrencyOne = document.getElementById('currency-one');
const ammountOne = document.getElementById('ammount-one');

const selectCurrencyTwo = document.getElementById('currency-two');
const ammountTwo = document.getElementById('ammount-two');

const rate = document.getElementById('rate');
const btnSwap = document.getElementById('swap');
const btnCalc = document.getElementById('calculate');

/////////////////////////////////////////////////////////////// Load Methods

loadSavedData();

selectCurrencyOne.addEventListener('change', clearResult);
selectCurrencyTwo.addEventListener('change', clearResult);
ammountOne.addEventListener('input', clearResult);
// ammountTwo.addEventListener('input', clearResult);

btnSwap.addEventListener('click', swapFields);
btnCalc.addEventListener('click', calculate);

/////////////////////////////////////////////////////////////// Helper Functions

/**
 * Loads data that may be saved into the local storage.
 */
function loadSavedData() {
  const stored_currency_one = localStorage.getItem('curr_one');
  const stored_currency_two = localStorage.getItem('curr_two');
  const stored_input_ammount = localStorage.getItem('ammount');

  if (stored_currency_one !== null)
    selectCurrencyOne.value = stored_currency_one;

  if (stored_currency_two !== null)
    selectCurrencyTwo.value = stored_currency_two;

  if (stored_input_ammount !== null) ammountOne.value = stored_input_ammount;

  if (
    stored_currency_one !== null &&
    stored_currency_two !== null &&
    stored_input_ammount !== null
  )
    calculate();
}

/**
 * Saves the current user inputs to the local storage.
 */
function saveData() {
  localStorage.setItem('curr_one', selectCurrencyOne.value);
  localStorage.setItem('curr_two', selectCurrencyTwo.value);
  localStorage.setItem('ammount', ammountOne.value);
}

/**
 * Swaps selected currencies.
 */
function swapFields() {
  const currency_one = selectCurrencyOne.value;
  const currency_two = selectCurrencyTwo.value;

  selectCurrencyOne.value = currency_two;
  selectCurrencyTwo.value = currency_one;

  calculate();
}

/**
 * Fetches the exchange rates from the API and updates the dom with converterd ammount.
 */
function calculate() {
  const currency_one = selectCurrencyOne.value;
  const currency_two = selectCurrencyTwo.value;

  fetch(`${apiHttpReq}${currency_one}`)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      if (data.result === 'success') {
        //Clearing any previous errors
        setError(false);

        const rateValue = +data.conversion_rates[currency_two];
        rate.innerText = `1 ${currency_one} = ${rateValue} ${currency_two}`;
        ammountTwo.value = (rateValue * +ammountOne.value).toFixed(3);

        //Saving user selected data.
        saveData();
      } else {
        setError(true, 'API is not responding.');
      }
    })
    .catch((error) => setError(true, 'Network Failure.'));
}

/**
 * Clears the output results when the user makes a change
 */
function clearResult() {
  ammountTwo.value = null;
  ammountTwo.placeholder = '0...';
  rate.innerHTML = '';
}

/**
 * Clears or displays the error message format and text.
 * @param {Boolean} error A flag indicates whether the error should be cleared or not.
 * @param {String} message The error message to be printed in case of error flag is true.
 */
function setError(error, message) {
  if (error) {
    rate.classList.add('error');
    rate.innerHTML = 'Failed to get exchange rates. ' + message;
  } else {
    rate.classList.remove('error');
  }
}
