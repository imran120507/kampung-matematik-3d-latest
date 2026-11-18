# Kampung Matematik 3D (Milestone 1)
React + Vite + Three.js + React Three Fiber + Drei + GSAP. Malay UI.

## Run
```
npm install        # if peer-dependency errors: npm install --legacy-peer-deps
npm run dev        # http://localhost:5173
npm run build && npm run preview
```
Node 20+.

## Deploy to Netlify
1. Push this folder to GitHub/GitLab.
2. Netlify > Add new site > Import from Git. `netlify.toml` already sets build `npm run build`, publish `dist`, Node 20.
3. Or CLI: `npm run build && npx netlify deploy --prod --dir=dist`.
4. Or drag the built `dist/` folder onto app.netlify.com/drop.

## What is in Milestone 1
3D village (Malay stilt houses, palms, paddy field, stalls, gate sign, garden, stage, path, terrain hills), cinematic intro + GSAP camera moves, ambient animation (palms, clouds, bunting, butterflies, scarecrow, sign), clickable Garden/Stalls/Stage and characters, Start Adventure dialogue, 5-question diagnostic with instant feedback, garden worked example that colours the 3D garden, Teacher's Corner (`#guru`).
Performance: Mod Ringan (auto on phones/low memory, auto when frame rate drops), DPR cap, instancing, small shadow map. Accessibility: reduced motion, large text, full keyboard use, DOM alternatives for every 3D action, no-WebGL/crash fallback.

## NOT finished
See `docs/ASSET_GUIDE.md`: no real character GLB models or animation clips (temporary placeholders shown), no music video, no audio, no Bab 1-5. Not tested with pupils.
Note: this was written without being able to run `npm install` or view it in a browser, so first run may need small visual tuning (camera framing, sizes).
