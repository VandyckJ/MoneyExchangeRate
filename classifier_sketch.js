let classifier; // variable that will contain our trained model
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/gdW3YkZff/'; // variable of our trained model's URL
let video; // variable that will contain our videostream
let flippedImage; // variable that will contain our flipped image of our videostream (because a webcam stream needs to be flipped - it's like a mirror)
let label = ""; // placeholder for the label, the thing we want to classify, the output of our model
let detectedAmount = document.getElementById('detectedAmount');
'use strict';

const freecurrencyapi = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_SJZ1VHADIu4kSUJwt9OPYNlWeRMVFlMqRhfxHffT&currencies=EUR';
const currencyTransfer = document.getElementById('currency');
const detectedAmountLabel = document.getElementById('detectedAmount');
const detectedCurrencyLabel = document.getElementById('detectedCurrency');
const amount = detectedAmountLabel.innerText;
const detectedCurrency = detectedCurrencyLabel.innerText;
let currencyCodes;
let currencyCode;
let exchangeRate;

fetch(freecurrencyapi)
    .then(response => response.json())
    .then(data => {
        // Gets the currency code from the API (USD, EUR, ...)
        currencyCodes = Object.keys(data.data);
        currencyCode = currencyCodes[0];

        const amount = detectedAmountLabel.value;
        const detectedCurrency = detectedCurrencyLabel.innerText;

        // Gets the currency exchange rate in this case the EUR exchange rate
        exchangeRate = data.data[currencyCode];
        console.log('Exchange rate: ', exchangeRate);

        // Checks if there is any exchange rate or not and will change the text from the index file (Not working atm, need to retrieve the currency from the AI Call ('label'))
        if (exchangeRate) {
            // splits the currency amount and its code (not working)
            console.log(amount)
            const exchange = exchangeRate * parseInt(amount);
            currencyTransfer.innerText = `${amount} ${detectedCurrency} is equal to ${exchange} EUR`;
            // amount and detectedCurrency not working mentioned above^^
        } else {
            console.log(`No exchange rate found for ${currencyCode}`);
        }
    });

detectedAmountLabel.addEventListener("change", fetch());

function changeAIResult() {
    console.log('changeAI Called')
    const amount = detectedAmountLabel.value;
    const detectedCurrency = detectedCurrencyLabel.innerText;
    currencyTransfer.innerText = `${amount} ${detectedCurrency} is equal to ${amount * exchangeRate} EUR`;
}

/*
	preload() function
	
	Preload the model via our TeachableMachine_URL, before we can draw our canvas and start modeling. 
	We use the imageClassifier function of ml5.js to load the model 
	Model can be pretty big, so it can take a while to load. That's why we need the asynchronous mode of preload instead of setup
	Documentation: https://p5js.org/reference/#/p5/preload
*/
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

/* 
	setup() function 
	Creating the canvas, and creating a videostream but hiding it (the draw function will continuously draw a captured frame).
	Call the classifyImage function, to get a prediction
	
	Note: the classifyImage function will use a callback function 'gotResult', which will call classifyImage again, so creating a continous loop for classifying whatever image is on the canvas at that moment
*/
function setup() {
    // Create the canvas
    createCanvas(320, 260);

    // Create the video / webcam stream
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    // Start classifying
    classifyImage();
}

function draw() {
    background(0);

    // Draw the video (flippedImage is already declaired as a variable, and given content in the classifyImage() function
    image(flippedImage, 0, 0);

    // Draw the label (label is already declaired as a variable, and given content in the gotResult() function
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyImage() {
    // capturing the video frame (making flipped image from webcam feed - flipped because of mirror effect of a webcam)	
    flippedImage = ml5.flipImage(video)
    // classifying the image, and getting result back from our model. Getting result, will do a callback to this function. So we keep on looping in the classification as well
    classifier.classify(flippedImage, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error: (to check the error, open the console window of your browser - in dev tools)
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence. If you want to view the entire returned value (including the confidence intervals, un-comment the line below
    //console.log(results);

    // we only want the label of the first element (the highest confidence prediction)
    if (results[0].label !== "None") {
        detectedAmount.value = results[0].label.split(' ')[0];

    } else {
        detectedAmount.value = 0;
    }
    changeAIResult();
    label = results[0].label;
    // Classify again! So we keep on looping
    classifyImage();
}