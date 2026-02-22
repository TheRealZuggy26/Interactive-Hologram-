# Interactive-Hologram-

Abstract

This project presents the design and implementation of a four-sided holographic projection system using a trapezoidal pyramid reflector and a real-time WebGL rendering engine. The objective was to create a floating 3D helmet hologram using a single display source and reflective geometry. The system integrates mathematical modeling, 3D transformations, viewport segmentation, multi-camera rendering, and physical hardware fabrication. The final outcome demonstrates a synchronized holographic illusion achieved through precise geometric calibration and software control.

1. Introduction

Holographic pyramid displays simulate volumetric projections using reflective surfaces angled at precise degrees. Instead of true volumetric light projection, the illusion is created by rendering multiple synchronized perspectives of a 3D model and reflecting them inward toward a central viewing axis.

The goal of this project was:

To design and construct a physical hologram pyramid

To develop a web-based real-time 3D rendering system

To mathematically align digital projections with physical reflection geometry

To calibrate viewport alignment for perfect holographic illusion

2. Hardware Design
   
2.1 The Pyramid Structure

The hologram pyramid consists of four transparent trapezoidal panels arranged into an inverted pyramid.

Geometry Properties:

4 identical trapezoidal faces

Angled inward at approximately 45°

Smaller top opening

Larger base

Transparent acrylic material

This shape reflects light from a flat screen into the center, forming a floating image.

2.2 Trapezoid Mathematics

Each face of the pyramid is a trapezoid defined by:

Top width (a)

Bottom width (b)

Height (h)

The side angle θ determines reflection alignment:

tan(0) = (b-a)/2 / h

For optimal holographic reflection:

tan(0) = 45 degree

This ensures symmetric reflection from all four faces.

Precise measurements were required so that:

The digital projection area matched the trapezoid footprint

The center of reflection aligned with the 3D model origin

3. Software Architecture

The software system was built using:

JavaScript

WebGL

Multi-camera rendering

Viewport segmentation

Real-time 3D transformations

The hologram is rendered inside main.js.

4. Multi-Camera Rendering System

The illusion requires four synchronized perspectives:

Front camera

Back camera

Left camera

Right camera

Each camera observes the same 3D model but from a 90° rotated position.

Example conceptual setup:

Front:  (0, 0, +d)
Back:   (0, 0, -d)
Left:   (-d, 0, 0)
Right:  (+d, 0, 0)

Where d is camera distance from origin.

Each camera renders into a quadrant of the screen.

5. Viewport Segmentation Mathematics

The screen is divided into four regions:

Top
Bottom
Left
Right

Using:

renderer.setViewport(x, y, width, height);
renderer.setScissor(x, y, width, height);

Key insight:

0 = bottom of canvas

Increasing Y moves rendering upward

Negative Y moves rendering downward

Example calibration:

renderer.setViewport(w / 4, -150, vw, vh);

This shifts the bottom projection downward.

This was used to align digital output with the physical trapezoid reflection height.

Viewport offset ≠ moving 3D object
Viewport offset = screen-space correction

6. 3D Model Transformation

The helmet hologram is stored in modelGroup.

Three key transformations control alignment:

modelGroup.scale.y = HOLOGRAM_Y_STRETCH;
modelGroup.position.y = HOLOGRAM_Y_OFFSET;
modelGroup.position.z = -0.3;

Meaning:

scale.y → vertical distortion compensation

position.y → vertical centering

position.z → depth shift relative to cameras

Because the cameras remain symmetric, moving the model along Z affects all projections consistently.

7. Rendering Process

Each frame:

Update camera aspect ratio

Set viewport region

Apply scissor test

Render scene with specific camera

Repeat 4 times

Pseudo-structure:

render(front camera)
render(back camera)
render(left camera)
render(right camera)

This creates the cross-shaped projection needed for pyramid reflection.

8. Calibration Phase

Calibration involved:

Step 1 — Hardware Measurement

Measure trapezoid dimensions precisely.

Step 2 — Camera Distance Tuning

Adjust camera distance for correct model scaling.

Step 3 — Model Centering

Adjust:

modelGroup.position.y
modelGroup.position.z

Step 4 — Viewport Alignment

Use:

renderer.setViewport()
renderer.setScissor()

To compensate for physical assembly tolerances.

Step 5 — Symmetry Testing

Ensure:

Top matches bottom

Left matches right

Reflection convergence aligns at center

Fine adjustments such as:

BOTTOM_OFFSET = -150;
TOP_OFFSET = +150;

Allowed precise correction.

9. Engineering Challenges

Aligning digital coordinate space with physical reflection space

Compensating for perspective distortion

Matching viewport regions to trapezoid shape

Maintaining symmetry

Avoiding scissor clipping artifacts

Managing camera projection matrices

Each issue required mathematical reasoning and iterative testing.

10. Final Outcome

The completed system successfully:

Projects a floating 3D helmet

Maintains symmetric reflections

Preserves correct proportions

Operates in real time via WebGL

Aligns precisely with physical pyramid geometry

The project demonstrates:

Applied trigonometry

Real-time graphics programming

Coordinate system transformation

Physical-digital integration

Systems engineering principles

11. Project Significance

This project bridges:

Mathematics

Computer graphics

Hardware fabrication

Optical illusion physics

Interactive rendering systems

It demonstrates how geometric theory, when combined with programmable rendering pipelines, can produce compelling volumetric illusions using minimal hardware.

Conclusion

The hologram pyramid system represents a complete integration of:

Mathematical modeling

3D transformation control

Multi-camera rendering architecture

Viewport manipulation

Physical reflection geometry

Through iterative debugging, mathematical calibration, and structured engineering methodology, the final system achieves a stable and visually convincing holographic projection.

This project illustrates the power of combining theoretical mathematics with real-time graphics programming to transform abstract coordinate systems into tangible visual experiences.
