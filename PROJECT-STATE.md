PROJECT STATE
Project Overview

This project is an experimental procedural world simulation built using JavaScript and Babylon.js.

The project deliberately moves beyond conventional assumptions about Euclidean geometry, uniform time, fixed physical properties, and conventional world simulation.

The objective is to develop a general-purpose simulation architecture capable of representing unusual physical and mathematical environments.

The artistic and conceptual direction is driven by the project owner. Technical architecture, mathematical implementation, extensibility, and code integration are delegated to ChatGPT.

Guiding Architectural Philosophy

The architecture should be as general and extensible as reasonably possible.

Do not assume that conventional simulation models are permanent requirements.

Important principles:

Mathematical models should be independent of rendering.
Simulation systems should consume shared environmental fields.
Physical properties should be capable of influencing geometry.
Geometry and time should be spatially variable.
Multiple fields should be capable of overlapping and interacting.
New physical phenomena should be implementable without rewriting existing systems.
Existing project functionality should be preserved wherever possible.
Avoid unnecessary dependencies between simulation subsystems.
Prefer configurable mathematical models over hardcoded special cases.
Keep numerical stability and testability central to implementation decisions.
Existing Technology
JavaScript.
Babylon.js.
Procedural simulation.
Three-dimensional world coordinates.
Thin instance rendering through a custom ThinInstanceRenderer.
Existing Systems

The project includes or has discussed the following systems:

WorldManager
ThinInstanceRenderer
Forest
Tree
Genetics
Geology
Hydrology
Clouds
Temperature

The exact current implementations and directory structure must be verified against the actual project files before making modifications.

Major Architectural Initiative: WorldFieldSystem

The next major development objective is a centralized environmental field infrastructure.

Proposed entry point:

WorldFieldSystem

This system will coordinate independent fields describing the environment.

Initial components
WorldField: common field abstraction.
FieldRegistry: registration and discovery of fields.
FieldSampler: consistent sampling interface.
SpatialLattice: three-dimensional field storage and interpolation.
SpacetimeField: spatial geometry and temporal behavior.
MetricTensor: local spatial metric representation.
TemperatureField: environmental temperature distribution.
MaterialField: local material properties.
PhysicalProperties: shared physical property definitions.
Geometry models

Geometry should be modular and interchangeable.

Initial models:

EuclideanGeometry
PoincareGeometry
GeodesicSolver

The Poincare model should eventually support hyperbolic geometry and the associated metric.

Mathematical Direction
Spatial geometry

The initial implementation should support a general symmetric positive-definite three-dimensional spatial metric.

The metric must not be restricted to scalar scaling.

Temporal geometry

Local proper time should eventually be determined by a temporal metric component or lapse function.

Simulation systems should consume local proper time rather than assuming that coordinate time is equivalent to physical time.

Thermal geometry

Temperature should eventually influence local material properties and spatial geometry.

The precise constitutive relationship remains an open design decision.

Field composition

Multiple fields should be capable of contributing to the resulting environmental state.

Field composition must be designed carefully to preserve mathematical validity, especially for metric tensors.

Rendering Architecture

Babylon.js currently operates in conventional Euclidean rendering coordinates.

The eventual architecture should distinguish:

Simulation coordinates.
Physical geometry.
Rendering coordinates.

ThinInstanceRenderer should eventually receive transformed rendering matrices through a dedicated transformation interface.

Important limitation:

A single instance matrix cannot represent arbitrary nonlinear spatial deformation.

Nonlinear geometry will eventually require vertex transformations, geometry subdivision, or shader-based deformation.

Do not implement this prematurely.

Existing Integration Considerations

A previously identified potential integration issue concerns Forest.advance() and Tree.update().

Tree.update() reportedly supports a hydrology argument, while Forest.advance() may not currently pass it.

Verify the actual source code before modifying this behavior.

Future forest updates should use locally accumulated proper time rather than assuming uniform biological time.

Recommended Development Sequence
Inspect existing source files and project conventions.
Establish WorldFieldSystem.
Implement SpatialLattice and interpolation.
Implement the common field interfaces.
Implement SpacetimeField and MetricTensor.
Introduce temperature and material fields.
Implement Euclidean and Poincare geometry models.
Validate metric calculations and geodesic behavior.
Integrate local proper time into biological simulation.
Gradually extend the other simulation systems.
Develop nonlinear rendering transformations.
Current Development Status

The architecture has been conceptually planned.

The initial implementation has not yet been integrated into the actual project.

No assumptions about the existing source tree should be treated as verified until the project files have been inspected.

Instructions for Future ChatGPT Sessions

When continuing this project:

Read this document first.
Ask for the current project archive if source files are not available.
Inspect the existing architecture before modifying code.
Preserve existing functionality.
Provide complete files rather than isolated fragments when implementing new modules.
Specify the exact destination path of every new file.
Clearly identify modifications to existing files.
Explain significant mathematical and architectural decisions.
Avoid introducing arbitrary assumptions about physical behavior.
Maintain this document as the project evolves.
Project Philosophy

The objective is not merely to simulate a conventional world with additional effects.

The objective is to create a simulation environment in which geometry, time, matter, temperature, and physical behavior can become interconnected and variable.

The architecture should be capable of expressing phenomena that are not yet fully conceived.

Extensibility is a fundamental requirement, not an afterthought.

2026-11-04 11:36AM update

## WorldFieldSystem Implementation — Initial Version

Implementation status: Initial architecture integrated into source.

### New Directory

src/world/fields/

### Implemented Components

- WorldField: common environmental field abstraction.
- FieldRegistry: field registration and discovery.
- FieldSampler: centralized field sampling.
- SpatialLattice: three-dimensional storage and trilinear interpolation.
- MetricTensor: symmetric positive-definite 3D metric.
- SpacetimeField: spatial metric and temporal lapse.
- TemperatureField: configurable temperature distribution.
- MaterialField: geological material properties.
- PhysicalProperties: shared physical property definitions.
- WorldFieldSystem: central coordination interface.

### Geometry Models

- GeometryModel: common geometry interface.
- EuclideanGeometry: conventional Euclidean geometry.
- PoincareGeometry: three-dimensional hyperbolic ball model.
- GeodesicSolver: initial numerical path-relaxation implementation.

### Mathematical Decisions

Metric tensors are represented using symmetric 3x3 matrices.

Positive definiteness is validated through Cholesky decomposition.

Metric interpolation uses Cholesky factors to preserve positive definiteness.

The initial spacetime model uses:

dτ = N(x,t) dt

where N is the local temporal lapse function.

The initial lapse is 1.0.

The initial spatial geometry is Euclidean.

The Poincare model uses negative constant curvature and a configurable ball radius.

### Existing System Integration

Forest initializes WorldFieldSystem using its existing TerrainSampler and GeologicalField.

MaterialField consumes the existing GeologicalField rather than duplicating geological calculations.

Forest.advance() now passes Hydrology to Tree.update(), restoring the previously identified integration.

Existing rendering and simulation systems remain otherwise unchanged.

### Current Limitations

1. WorldFieldSystem is initialized but existing simulation systems have not yet migrated to consuming its fields.
2. SpatialLattice is implemented as an independent storage abstraction and is not yet populated automatically.
3. Temperature currently uses a configurable altitude lapse-rate model.
4. Material properties are initial configurable estimates, not calibrated physical measurements.
5. Temperature does not yet influence material properties or geometry.
6. The geodesic solver is an initial numerical approximation, not a validated general-purpose solver.
7. Temporal lapse currently does not influence biological aging.
8. Poincare geometry is a mathematical simulation model and is not connected to Babylon.js rendering.
9. Metric composition from multiple interacting fields remains unimplemented.

### Recommended Next Development Steps

1. Validate MetricTensor operations with automated numerical tests.
2. Improve and validate geodesic energy minimization.
3. Add SpatialLattice tests covering interpolation and boundaries.
4. Implement field composition with mathematically valid metric operations.
5. Introduce spatially varying metric providers.
6. Develop temperature-dependent material constitutive relationships.
7. Integrate local proper time into biological simulation.
8. Introduce a dedicated simulation-coordinate to rendering-coordinate interface.
9. Gradually migrate existing environmental systems to WorldFieldSystem.

### Architectural Principle

WorldFieldSystem is infrastructure, not an independent world simulation.

Environmental systems remain independently responsible for their own simulation processes.

The field infrastructure provides shared environmental information and mathematical relationships without imposing unnecessary dependencies between subsystems.

