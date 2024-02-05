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
const currencyTransfer = document.getElementById('currency')
fetch(freecurrencyapi)
.then(response => {
    console.log(response);
    response = response.json();
    
});