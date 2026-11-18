# Asset Integration Guide

## Status: what is MISSING
| Asset | Status |
|---|---|
| Aiman, Mia, Tok Ketua animated 3D models (GLB) | **Missing.** The scene shows temporary procedural placeholders (labelled "model sementara"). They are not finished characters. |
| Character animation clips (Idle, Talk, Wave, Walk) | **Missing.** Placeholders use a simple code-driven bob/gesture only. |
| Original animated maths music video + captions (.vtt) | **Missing.** A stage and screen exist in the village as the slot. |
| Audio (music, SFX, voice) | **Missing.** No sound is implemented. |
| Chapters 1 to 5 | **Not built** (Milestone 1 only). |

## Characters (GLB)
Files: `public/models/aiman.glb`, `mia.glb`, `tok.glb`. They are detected at startup (HEAD request); a corrupt file falls back to the placeholder.

Requirements
- glTF 2.0 binary, **original** artwork only (no third-party IP). Keep licence records.
- Units: metres. Origin at the feet, centred. **Facing +Z**. Height: Aiman ~1.3, Mia ~1.25, Tok Ketua ~1.6 (scene units = metres).
- Skinned, one armature. Budget: <= 8k triangles each, <= 1 material or 2, textures <= 1024 px (mobile). Bake lighting into flat/painted colour; the scene applies shadows itself.
- Cartoon style: flat or simple painted colours, soft rounded forms, large eyes, same line weight across all three. Outlines are not required.
- Required clips (names matched case-insensitively): `Idle` (loop, required), `Talk` (loop), `Wave` (one-shot), optional `Walk`, `Happy`, `Think`. Idle plays on load; Talk plays while that character speaks.
- Reduced motion: Idle is frozen on frame 0 automatically.

Compress before shipping:
```
npx @gltf-transform/cli optimize aiman.glb aiman.glb --compress draco --texture-compress webp
```
Draco decoding loads its decoder from a CDN by default. For offline/school networks copy `node_modules/three/examples/jsm/libs/draco/gltf/` to `public/draco/` and add `useGLTF.setDecoderPath(import.meta.env.BASE_URL + 'draco/')` in `Characters.jsx`. Or ship uncompressed GLBs and drop `--compress draco` from the command.

Suggested pipeline: model/rig in Blender, export glTF Binary with "Apply Modifiers" and "Animation: NLA/Actions as separate clips", then check in https://gltf-viewer.donmccurdy.com.

To reposition characters edit the `<Character>` lines in `src/three/Scene.jsx`. Names, colours and dialogue are in `src/data.js`.

## Music video
`public/video/muzik-matematik.mp4` (H.264/AAC, 720p, < 25 MB) and `muzik-matematik.ms.vtt` captions (required for accessibility). Click the stage in the village or "Pentas Muzik". Create it with original lyrics, music and animation only.

## Replacing village props
Everything in `src/three/` is code-built. To swap in GLB props, load with `useGLTF` as in `GLBChar` and keep the toon look.
