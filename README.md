# Development of a Four-Sided Pyramid Hologram Projection System Using Web-Based 3D Rendering
# Abstract

This project presents the design and implementation of a four-sided holographic projection system using a trapezoidal pyramid reflector and a real-time WebGL rendering engine. The objective was to create a floating three-dimensional helmet hologram using a single display source and reflective geometry. The system integrates mathematical modeling, 3D transformations, viewport segmentation, multi-camera rendering, and physical hardware fabrication. The final outcome demonstrates a synchronized holographic illusion achieved through precise geometric calibration and software control.

# 1. Introduction

Holographic pyramid displays simulate volumetric projections using reflective surfaces angled at precise degrees. Rather than projecting true volumetric light into space, the illusion is created by rendering multiple synchronized perspectives of a 3D model and reflecting them inward toward a central viewing axis. The goal of this project was to design and construct a physical hologram pyramid, develop a web-based real-time 3D rendering system, mathematically align digital projections with physical reflection geometry, and calibrate viewport alignment to produce a stable and convincing holographic illusion.

# 2. Hardware Design

The hardware component of the project consisted of constructing a four-sided transparent pyramid made from trapezoidal acrylic panels. Each face was cut into an identical trapezoid and assembled inward at approximately 45 degrees to form an inverted pyramid. The structure features a smaller top opening and a larger base, allowing light from a flat digital display to reflect inward and converge at the center. Precise measurements were critical, as any angular deviation would distort the reflected image. The physical build required careful cutting, alignment, and bonding to ensure symmetry and consistent reflection angles across all four faces.

# 3. Trapezoid Geometry and Mathematical Foundation

The geometric foundation of the pyramid was based on trapezoidal mathematics. Each face is defined by a top width, bottom width, and vertical height. The inward angle of the trapezoid determines the reflection path of the projected image. Using trigonometric relationships, the angle θ can be approximated by tan(θ) = ((b − a)/2) / h, where a and b represent the top and bottom widths, respectively, and h is the height. For optimal holographic symmetry, the angle was designed to be approximately 45 degrees. This ensured that reflections from all four panels converged toward a central axis, producing the floating holographic effect.

# 4. Software Architecture

The software system was developed using JavaScript and WebGL, structured primarily within the main rendering file. The architecture consisted of a 3D scene containing a model group representing the helmet hologram, four independent cameras positioned orthogonally around the model, and a rendering loop that updated transformations and projections in real time. The system was designed to maintain consistent coordinate alignment between the digital 3D space and the physical reflective structure, requiring careful management of projection matrices and aspect ratios.

# 5. Multi-Camera Rendering System

To generate the holographic illusion, four synchronized cameras were implemented: front, back, left, and right. Each camera observed the same 3D model from a 90-degree rotated perspective around the origin. The cameras were positioned symmetrically at equal distances from the center to preserve geometric consistency. During each frame, the system rendered the scene four times, once per camera, ensuring that each perspective corresponded to one trapezoidal face of the pyramid. This multi-camera system is fundamental to the illusion, as each reflection must represent a correct viewpoint of the same object.

# 6. Viewport Segmentation and Screen-Space Mapping

The digital display was divided into four viewport regions corresponding to the four reflective faces of the pyramid. Using the functions renderer.setViewport() and renderer.setScissor(), each camera’s output was confined to a specific quadrant of the screen. The Y-coordinate system of the canvas required careful handling, as zero represents the bottom of the canvas and increasing values move upward. Adjustments such as negative viewport offsets were used to shift rendered projections downward when necessary. These adjustments allowed precise alignment between the digital projection and the physical trapezoid placement without altering the 3D model’s spatial position.

# 7. 3D Model Transformation and Calibration

The holographic helmet was managed as a model group within the scene. Its transformation properties were adjusted to achieve proper alignment within the pyramid. Vertical scaling was applied to compensate for reflective distortion, while position adjustments along the Y-axis centered the hologram vertically. Depth adjustments along the Z-axis shifted the model relative to the cameras, affecting how the reflections converged. Because all cameras were symmetrically positioned, moving the model in the Z direction altered all projections uniformly, maintaining consistency across the four faces.

# 8. Rendering Pipeline and Frame Execution

The rendering process operated within a continuous animation loop. During each frame, the system updated camera aspect ratios, refreshed projection matrices, set viewport and scissor regions, and rendered the scene sequentially from each camera’s perspective. This four-pass rendering cycle ensured that each trapezoidal face displayed the correct perspective simultaneously. The synchronization of these renders was essential for maintaining the illusion of a unified floating object rather than four disconnected reflections.

# 9. Calibration and Iterative Refinement

Achieving accurate alignment required iterative calibration. The process began with precise measurement of the trapezoidal panels and verification of angular symmetry. Camera distances were then adjusted to achieve proportional scaling of the model. Subsequent fine-tuning involved modifying the model’s vertical and depth offsets to align reflections at the center of the pyramid. Finally, viewport offsets were introduced to compensate for minor physical assembly tolerances. This iterative debugging process combined mathematical reasoning with empirical visual testing to achieve accurate convergence.

# 10. Engineering Challenges

Several engineering challenges arose during development. Aligning digital coordinate space with physical reflective geometry required careful spatial reasoning. Perspective distortion had to be compensated through scaling adjustments. Viewport misalignment could result in clipping artifacts if scissor regions were not synchronized correctly. Additionally, maintaining symmetry across all four camera perspectives required strict adherence to equal distances and orthogonal positioning. Each challenge demanded systematic testing and analytical problem-solving.

# 11. Final Outcome and Significance

The completed system successfully projects a stable, symmetrical, real-time floating 3D helmet hologram using only a flat display and reflective geometry. The project demonstrates the integration of applied trigonometry, real-time computer graphics, coordinate transformation theory, hardware fabrication, and optical illusion principles. By combining mathematical modeling with programmable rendering pipelines, the system transforms abstract coordinate calculations into a tangible volumetric illusion. This project highlights the interdisciplinary nature of engineering, bridging mathematics, physics, and software development to create a functional and visually compelling holographic display.
