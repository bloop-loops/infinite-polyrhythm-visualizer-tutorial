import fs from "fs";
import { execSync } from "child_process";
import { createCanvas } from "canvas";
import WavEncoder from "wav-encoder";
import WavDecoder from "wav-decoder";

import {
  RHYTHMS,
  SECONDS_PER_LAP,
  DURATION,
  FPS,
  SAMPLE_RATE,
  SAMPLE_PATHS,
  BG_COLOR,
  SHAPE_COLORS,
  TEXT_COLOR,
} from "./config.js";

const videoWidth = 1080;
const videoHeight = 1920;
const centerX = videoWidth / 2;
const centerY = videoHeight / 2;

const minRadius = 180;
const maxRadius = 380;

async function loadSample(path) {
  const sample = fs.readFileSync(path);
  const decoded = await WavDecoder.decode(sample);
  return {
    data: decoded.channelData[0],
    rate: decoded.sampleRate,
  };
}

function polygonCorners(sides, radius) {
  const corners = [];
  const startingAngle = -Math.PI / 2;

  for (let cornerIndex = 0; cornerIndex < sides; cornerIndex++) {
    const angle = startingAngle + (cornerIndex / sides) * Math.PI * 2;
    corners.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }
  return corners;
}

async function generate() {
  const samples = await Promise.all(SAMPLE_PATHS.map(loadSample));

  const totalSamples = SAMPLE_RATE * DURATION;
  const leftChannel = new Float32Array(totalSamples);
  const rightChannel = new Float32Array(totalSamples);

  function playHit(currentTime, sample) {
    const startSample = Math.floor(currentTime * SAMPLE_RATE);
    const speedRatio = sample.rate / SAMPLE_RATE;

    let readPosition = 0;
    for (
      let sampleOffset = 0;
      startSample + sampleOffset < totalSamples &&
      readPosition < sample.data.length;
      sampleOffset++
    ) {
      const sampleValue = sample.data[Math.floor(readPosition)] || 0;
      leftChannel[startSample + sampleOffset] += sampleValue;
      rightChannel[startSample + sampleOffset] += sampleValue;
      readPosition += speedRatio;
    }
  }

  const shapeCount = RHYTHMS.length;

  function radiusForShape(shapeIndex, shapeCount) {
    if (shapeCount === 1) return maxRadius;
    const spacing = (maxRadius - minRadius) / (shapeCount - 1);
    return minRadius + shapeIndex * spacing;
  }

  const shapes = RHYTHMS.map((cornerCount, shapeIndex) => ({
    cornerCount,
    radius: radiusForShape(shapeIndex, shapeCount),
    color: SHAPE_COLORS[shapeIndex % SHAPE_COLORS.length],
    sample: samples[shapeIndex % samples.length],
    lastHitCount: -1,
    glowFramesRemaining: 0,
  }));

  const glowDurationFrames = 10;

  const canvas = createCanvas(videoWidth, videoHeight);
  const ctx = canvas.getContext("2d");

  fs.rmSync("./output/frames", { recursive: true, force: true });
  fs.mkdirSync("./output/frames");

  const totalFrames = FPS * DURATION;

  for (let frame = 0; frame < totalFrames; frame++) {
    const currentTime = frame / FPS;
    const lapsCompleted = currentTime / SECONDS_PER_LAP;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, videoWidth, videoHeight);

    shapes.forEach((shape) => {
      const corners = polygonCorners(shape.cornerCount, shape.radius);

      const positionAlongPerimeter =
        (lapsCompleted * shape.cornerCount) % shape.cornerCount;
      const edgeIndex = Math.floor(positionAlongPerimeter) % shape.cornerCount;
      const edgeProgress =
        positionAlongPerimeter - Math.floor(positionAlongPerimeter);

      const cornerA = corners[edgeIndex];
      const cornerB = corners[(edgeIndex + 1) % shape.cornerCount];

      const dotX = cornerA.x + (cornerB.x - cornerA.x) * edgeProgress;
      const dotY = cornerA.y + (cornerB.y - cornerA.y) * edgeProgress;

      const hitCount = Math.floor(lapsCompleted * shape.cornerCount);
      if (hitCount !== shape.lastHitCount) {
        shape.lastHitCount = hitCount;
        playHit(currentTime, shape.sample);
        shape.glowFramesRemaining = glowDurationFrames;
      }

      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      corners.forEach((corner, index) =>
        index ? ctx.lineTo(corner.x, corner.y) : ctx.moveTo(corner.x, corner.y),
      );
      ctx.closePath();
      ctx.stroke();

      if (shape.glowFramesRemaining > 0) {
        ctx.globalAlpha = shape.glowFramesRemaining / glowDurationFrames;
        ctx.fillStyle = shape.color;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        shape.glowFramesRemaining--;
      }

      ctx.fillStyle = shape.color;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    const textY = centerY - maxRadius - 80;

    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "center";
    ctx.font = "100px sans-serif";
    ctx.fillText(RHYTHMS.join(" : "), centerX, textY);

    fs.writeFileSync(
      `./output/frames/frame_${String(frame).padStart(5, "0")}.png`,
      canvas.toBuffer("image/png"),
    );
  }

  const encodedAudio = await WavEncoder.encode({
    sampleRate: SAMPLE_RATE,
    channelData: [leftChannel, rightChannel],
  });
  fs.writeFileSync("./output/audio.wav", Buffer.from(encodedAudio));

  console.log("Combining frames and audio...");
  const outputFilename = `./output/${RHYTHMS.join("_")}_polyrhythm.mp4`;

  execSync(
    `ffmpeg -y -framerate ${FPS} -i ./output/frames/frame_%05d.png -i ./output/audio.wav -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest ${outputFilename}`,
  );
  console.log(`Done — check ${outputFilename}`);
}

generate();
