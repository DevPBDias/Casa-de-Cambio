import Alert from 'sweetalert2';
import './styles.css';

const searchBtn = document.querySelector('.btnSearch');
const inputCoin = document.querySelector('#coin-input');
const titleBlock = document.querySelector('.titleBlock');
const coinsList = document.querySelector('.coins');

function resetText() {
  coinsList.innerHTML = '';
  titleBlock.textContent = '';
  inputCoin.value = '';
}

function fetchApi(coin) {
  const urlApi = `https://api.exchangerate.host/latest?base=${coin}`;
  return fetch(urlApi)
    .then((response) => response.json())
    .then((data) => {
      if (data.base !== coin.toUpperCase()) {
        throw new Error('Moeda não existente');
      }
      return data.rates;
    });
}

function renderCoins(coins) {
  resetText();

  const coinsArray = Object.entries(coins);

  coinsArray.forEach((coin) => {
    const [coinName, coinValue] = coin;

    const li = document.createElement('li');
    li.textContent = `${coinName} - ${coinValue.toFixed(2)}`;

    coinsList.appendChild(li);
  });
}

function handleSearch(event) {
  event.preventDefault();
  const inputText = inputCoin.value.toUpperCase();

  if (!inputText) {
    resetText();

    Alert.fire({
      icon: 'error',
      title: 'Ops ...',
      text: 'Voce precisa passar uma moeda',
    });
    return;
  }

  titleBlock.textContent = `Valores referentes a 1 ${inputText}`;

  fetchApi(inputText)
    .then(renderCoins)
    .catch((error) => {
      resetText();

      Alert.fire({
        icon: 'error',
        title: 'Ops ...',
        text: error.message,
      });
    }); // results => renderCoins(results)
}

searchBtn.addEventListener('click', handleSearch);
