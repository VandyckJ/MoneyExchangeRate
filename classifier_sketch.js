var classifier; // variable that will contain our trained model
var imageModelURL = 'https://teachablemachine.withgoogle.com/models/2FIAanakI/'; // variable of our trained model's URL
var video; // variable that will contain our videostream
var flippedImage; // variable that will contain our flipped image of our videostream (because a webcam stream needs to be flipped - it's like a mirror)
var label = ""; // placeholder for the label, the thing we want to classify, the output of our model



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
    label = results[0].label;
    // Classifiy again! So we keep on looping
    classifyImage();
}
