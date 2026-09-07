# Infinite Polyrhythm Visualizer Tutorial

- Channel [Bloop Loops](https://www.youtube.com/@BloopLoops)
- Tutorial video: [coming soon](#)

Create your own polyrhythm visualizer similar to the one seen here:

- [6:7 Infinite Polyrhythm](https://www.youtube.com/shorts/aV1DpeLeT9I)

This repo is a simplified version of a larger production pipeline for one of the several polyrhythm visualization engines
behind [Bloop Loops](#), a polyrhythm visualization project — built to walk through in
[this video](#) step by step.

## Requirements

- **Node.js** (v18+) — runs the script.
- **ffmpeg**, installed and available on your PATH — stitches the rendered
  frames and audio into the final video. Check with `ffmpeg -version`.
  - **macOS**: `brew install ffmpeg`
  - **Windows**: download from [ffmpeg.org](https://ffmpeg.org/download.html) and add it to your PATH
  - **Linux**: `sudo apt install ffmpeg` (or your distro's package manager)
- **npm packages**: `canvas`, `wav-encoder`, `wav-decoder` — installed per
  folder below via `npm install`.

> If `npm install` fails specifically on the `canvas` package, it usually
> means a missing system graphics library. On macOS:
> `brew install pkg-config cairo pango libpng jpeg giflib librsvg`, then
> re-run the install.

## Folder structure

- **`follow-along/`** — use this to code along with the tutorial video
  `config.js` has some bare bones values put in, but feel free to change to your liking!
  `generator.js` is blank. We will build this together
  together during the tutorial.
- **`complete/`** — If you'd rather just use the code as is, use this folder. It has the fully complete, runnable code.

Both folders have the same two samples in `instruments/`:

- `bassDrum.wav`
- `block.wav`

You can swap these out with any instruments you prefer. Just be sure to update the corresponding sample paths in the config.

## Quick start

```bash
cd complete
npm install
node generator.js
```

The finished video will be written to `complete/output/`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- YouTube channel: [Bloop Loops](https://www.youtube.com/@BloopLoops)
- Tutorial video: [coming soon](#)

## Contact

If you'd like to see more pipeline walkthroughs, contact me at [loopsbloop@gmail.com](mailto:loopsbloop@gmail.com) or leave a comment on [Bloop Loops](https://www.youtube.com/@BloopLoops)
