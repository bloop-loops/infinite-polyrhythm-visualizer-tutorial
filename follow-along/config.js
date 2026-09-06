// We store the shapes in an array. Each value is the number of corners the shape will have.
// E.g. 3 = triangle, 4 = square, 5 = pentagon, etc. The number of corners also determines how often the shape is "hit" per lap. A triangle hits 3 times per lap, a square 4 times, etc.
export const RHYTHMS = [4, 9];

// How long one trip around a shape takes, in seconds.
// Both shapes share this same lap time — it's their different corner
export const SECONDS_PER_LAP = 2;

// Total length of the finished video, in seconds.
// To create a perfect, infinite loop this number should be a multiple of SECONDS_PER_LAP. In this case, 8 seconds is 4 laps of the shapes.
export const DURATION = 8;

// Frames per second — how many still images make up one second of video.
// For more fluid motion, increase this number. But keep in mind this will increase processing time.
export const FPS = 30;

// Audio sample rate — how many numbers-per-second represent the sound.
// 44100 is the standard rate.
export const SAMPLE_RATE = 44100;

// RHYTHMS[0] (the 5-cornered shape) plays SAMPLE_PATHS[0] (bassDrum),
// RHYTHMS[1] (the 3-cornered shape) plays SAMPLE_PATHS[1] (click).
// You can change these samples to use different sounds.
export const SAMPLE_PATHS = [
  "./instruments/bassDrum.wav",
  "./instruments/block.wav",
];

// One color per entry in RHYTHMS, matched up the same way as SAMPLE_PATHS —
// SHAPE_COLORS[0] colors the first shape, SHAPE_COLORS[1] the second.
export const SHAPE_COLORS = ["#d61479", "#20bb20"];

// Background color behind everything.
export const BG_COLOR = "#08011b";

// Color of the center number text.
// Make sure this color has enough contrast with BG_COLOR.
export const TEXT_COLOR = "#efdcdc";
