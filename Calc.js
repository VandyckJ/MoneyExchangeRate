'use strict';

class Freecurrencyapi {
    baseUrl = 'https://api.freecurrencyapi.com/v1/';

    constructor(apiKey = '') {
        this.headers = {
            apikey: apiKey
        };
    }

    call (endpoint, params = {}) {
        const paramString = new URLSearchParams({
            ...params
        }).toString();

        return fetch(`${this.baseUrl}${endpoint}?${paramString}`, { headers: this.headers })
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    status () {
        return this.call('status');
    }

    currencies (params) {
        return this.call('currencies', params);
    }

    latest (params) {
        return this.call('latest', params);
    }

    historical (params) {
        return this.call('historical', params);
    }

}

const freecurrencyapi = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_SJZ1VHADIu4kSUJwt9OPYNlWeRMVFlMqRhfxHffT&currencies=EUR';
const currencyTransfer = document.getElementById('currency');
const detectedAmountLabel = document.getElementById('detectedAmount');
const detectedCurrencyLabel = document.getElementById('detectedCurrency');
var amount = detectedAmountLabel.innerText;
var detectedCurrency = detectedCurrencyLabel.innerText;
var currencyCodes;
var currencyCode;
var exchangeRate;

fetch(freecurrencyapi)
    .then(response => response.json())
    .then(data => {
        // Gets the currency code from the API (USD, EUR, ...)
        currencyCodes = Object.keys(data.data);
        currencyCode = currencyCodes[0];

        // Gets the currency exchange rate in this case the EUR exchange rate
        exchangeRate = data.data[currencyCode];
        console.log('Exchange rate: ', exchangeRate);

        // Checks if there is any exchange rate or not and will change the text from the index file (Not working atm, need to retrieve the currency from the AI Call ('label'))
        if (exchangeRate) {
                 // splits the currency amount and its code (not working)
            console.log(amount)
                 // amount and detectedCurrency not working mentioned above^^
        } else {
            console.log(`No exchange rate found for ${currencyCode}`);
        }
    });

detectedAmountLabel.addEventListener("change", changeAIResult());
    function changeAIResult() {
        console.log('changeAI Called')
        var amount = detectedAmountLabel.value; 
        var detectedCurrency = detectedCurrencyLabel.innerText;
        currencyTransfer.innerText = `${amount} ${detectedCurrency} is equal to ${exchangeRate * amount} EUR`;
    }

