// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;
let isDragging = false;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the position of the index finger (keypoint 8)
        let indexFinger = hand.keypoints[8];

        // Check if the index finger is touching the circle
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          isDragging = true;
        }

        // If dragging, move the circle with the index finger
        if (isDragging) {
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }
      }
    }
  }

  // Reset dragging state when no hands are detected
  if (hands.length === 0) {
    isDragging = false;
  }
}
