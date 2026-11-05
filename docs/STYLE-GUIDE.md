SOMNIUM
Software Architecture & Development Style Guide

Version: 1.0
Status: Foundational / Progressive Adoption
Last updated: November 5, 2026

1. Foundational Philosophy

Somnium is intended to be a continuously extensible, technology-agnostic, high-performance interactive world system.

Its architecture should prioritize:

Abstraction.
Modularity.
Extensibility.
Separation of concerns.
Reusability.
Performance.
Robustness.
Persistence and reproducibility.
Interoperability.
Maintainability.

These principles should guide every new subsystem and every substantial modification to an existing subsystem.

1.1 Technology independence

Application architecture should describe what systems do, not how a particular technology accomplishes those tasks.

Examples:

Rendering systems should not determine authoritative world state.
Physics implementations should not own application-level entity definitions.
Persistence systems should not require knowledge of rendering objects.
User interfaces should communicate through stable application interfaces.
Procedural generation should not depend on a particular rendering engine.
Simulation should not depend on a particular visualization technique.

Technology-specific implementations should be replaceable without requiring widespread changes to unrelated systems.

1.2 Abstraction without unnecessary complexity

Always seek the highest useful level of abstraction.

However, abstraction should produce a concrete architectural benefit.

Do not introduce abstractions merely to increase the number of interfaces, classes, or files.

An abstraction is valuable when it:

Reduces coupling.
Enables interchangeable implementations.
Establishes reusable behavior.
Simplifies testing.
Protects authoritative data.
Enables optimization.
Makes future capabilities easier to introduce.

Prefer simple, composable abstractions over elaborate inheritance hierarchies.

1.3 Progressive architectural improvement

The codebase will evolve incrementally.

Existing implementations need not immediately conform to every principle in this document.

New code should follow the guide wherever practical. Existing code should be progressively refactored when it is modified or when architectural deficiencies become significant.

Avoid large-scale rewrites without a demonstrated benefit.

2. Architectural Organization
2.1 Separation of responsibilities

Organize the application into distinct conceptual layers.

Domain layer

Contains authoritative application concepts and their rules.

Examples:

Buildings.
Rooms.
Characters.
Terrain.
Vegetation.
World entities.
Materials.
Spatial relationships.

Domain objects should remain independent of external libraries.

Application layer

Coordinates domain operations and application workflows.

Examples:

Building creation.
World loading.
Entity management.
Procedural generation.
Scene initialization.
User commands.
Simulation orchestration.
Infrastructure layer

Provides implementation-specific services.

Examples:

Rendering engines.
Database adapters.
Browser storage.
Asset loading.
Network communication.
Physics engines.
File access.
Presentation layer

Handles user interaction and visualization.

Examples:

Editors.
Menus.
HUDs.
View controls.
Selection interfaces.
Debugging tools.

Dependencies should generally point inward, toward stable concepts, rather than outward toward specific implementations.

2.2 Dependency inversion

Higher-level systems should depend on capabilities rather than concrete implementations wherever useful.

For example:

A building system should request architectural rendering through a rendering interface.

It should not need to know whether the implementation uses:

Thin instances.
Ordinary meshes.
GPU instancing.
Generated geometry.
A future alternative rendering engine.

The same principle applies to persistence, physics, navigation, and asset management.

2.3 Explicit ownership

Every resource and responsibility should have an identifiable owner.

Establish clear ownership for:

Entity lifecycle.
Geometry generation.
Rendering resources.
Materials.
Input subscriptions.
Event listeners.
Persistent records.
Temporary editor objects.
Background tasks.

Avoid multiple systems independently managing the same resource.

Resource creation and disposal should follow symmetrical lifecycle rules.

3. Data Architecture
3.1 Authoritative data versus derived data

Maintain a strict distinction between authoritative data and derived representations.

Authoritative data describes what exists.

Derived data describes how that information is represented or processed.

For example:

Authoritative data	Derived representation
Building definition	Babylon.js meshes
Room boundaries	Rendered walls
Character state	Animated skeleton
Terrain definition	Terrain chunk geometry
World entity records	Thin-instance buffers
Material definition	GPU material resources
Navigation graph	Pathfinding acceleration structures

Derived representations must be reproducible from authoritative information wherever practical.

Never make an ephemeral rendering resource the sole source of truth for important application state.

3.2 Serializable domain models

Persistent domain objects should use plain, versioned data structures.

Prefer:

Strings.
Numbers.
Booleans.
Arrays.
Plain objects.
Explicit identifiers.
Well-defined optional properties.

Avoid serializing:

Engine objects.
Functions.
Circular references.
DOM elements.
GPU resources.
Runtime caches.
Temporary interaction state.

Every persistent model should have an explicit serialization and restoration strategy.

3.3 Stable identity

Every persistent entity should have a stable identifier.

Identifiers should survive:

Saving.
Loading.
Duplication, with new identity.
World transitions.
Application restarts.

Do not rely on array indices, object references, mesh names, or rendering instance indices as persistent identity.

3.4 Versioning and migration

Persistent data formats should be explicitly versioned.

Changes to data models should provide a migration strategy.

Prefer backward-compatible additions where practical.

A migration should be:

Deterministic.
Explicit.
Testable.
Idempotent where possible.

Never silently reinterpret existing persistent data.

3.5 Data integrity

Validate information at system boundaries.

Important validation targets include:

Numeric ranges.
Spatial dimensions.
Entity references.
Identifier uniqueness.
Required fields.
Enumerated values.
Referential integrity.
Version compatibility.

Invalid data should produce actionable errors rather than silently propagating through the application.

4. Spatial Architecture

Spatial representation is a foundational concern throughout Somnium.

4.1 Coordinate-system independence

World coordinates must be distinguished from rendering coordinates.

The authoritative world representation should remain independent of a particular projection, camera, or renderer.

Somnium's SpatialTransform architecture is an important example of this principle.

Spatial transformations should be centralized rather than independently implemented by individual systems.

4.2 Transformation responsibilities

Maintain explicit distinctions between:

Local coordinates.
Parent-relative coordinates.
World coordinates.
Rendering coordinates.
Camera-relative coordinates.
Screen coordinates.

Transformations between these spaces should be explicit and consistently named.

Avoid implicit coordinate conversions.

4.3 Projection independence

Systems should not assume that the world is necessarily Euclidean.

Support the possibility of:

Euclidean geometry.
Hyperbolic geometry.
Alternative projections.
Local coordinate frames.
Future nonstandard spatial representations.

Rendering-specific approximations must not silently become authoritative physical or architectural rules.

4.4 Spatial precision

Establish consistent numerical precision requirements.

Consider:

Floating-point accumulation.
Large coordinate magnitudes.
Transformation stability.
Geometric tolerances.
Projection distortion.
Collision tolerances.

Use shared precision and tolerance policies rather than arbitrary constants scattered throughout the codebase.

5. Rendering Architecture
5.1 Rendering is a replaceable subsystem

Rendering should consume application data and produce visual representations.

It should not own authoritative domain state.

The application should remain conceptually functional even if its current rendering implementation is replaced.

5.2 Geometry reuse

Prefer reusable geometry and shared resources.

Avoid unnecessary duplication of:

Mesh prototypes.
Materials.
Textures.
Shader programs.
Geometry buffers.
Vertex data.

Rendering systems should favor batching and instancing when appropriate.

5.3 Instancing and thin instances

Somnium should prioritize efficient rendering of repeated geometry.

Thin instances are an important current optimization.

However, rendering architecture should support multiple strategies, including:

Thin instances.
Hardware instancing.
Shared meshes.
Geometry merging.
Procedural geometry.
Level-of-detail representations.
GPU-driven rendering.

Choose strategies based on actual workload characteristics.

Do not force unique or highly dynamic objects into an instancing architecture when doing so would create unnecessary complexity.

5.4 Incremental updates

Avoid rebuilding unchanged resources.

Prefer:

Dirty-state tracking.
Incremental buffer updates.
Cached geometry.
Shared prototypes.
Deferred regeneration.
Change notifications.
Explicit invalidation.

An edit to one building should not unnecessarily regenerate every building in the world.

5.5 Rendering and simulation independence

Rendering frequency should not determine simulation correctness.

Simulation state should remain authoritative independently of frame rate.

Rendering may interpolate or approximate simulation state without modifying it.

6. Performance Engineering

Performance is an architectural requirement, not a final optimization pass.

6.1 Optimize at the correct level

Prioritize improvements in this order:

Eliminate unnecessary work.
Reduce duplicated data.
Reduce expensive allocations.
Reduce unnecessary synchronization.
Improve algorithmic complexity.
Improve batching and resource reuse.
Optimize low-level operations.

Avoid premature micro-optimization when a larger architectural improvement is available.

6.2 Resource lifecycle

Resources should have explicit creation, reuse, invalidation, and disposal policies.

Avoid:

Repeated object allocation in hot loops.
Unbounded caches.
Orphaned event listeners.
Unnecessary GPU uploads.
Repeated geometry generation.
Uncontrolled asynchronous operations.
6.3 Scalability

New systems should consider their behavior at substantially larger scales than initial testing requires.

Consider:

Thousands of entities.
Large terrain regions.
Many buildings.
Complex interiors.
Numerous characters.
Large numbers of repeated assets.

Use spatial partitioning, chunking, streaming, culling, and level-of-detail systems where appropriate.

6.4 Measure before optimizing

Performance changes should be supported by measurements.

Track relevant metrics such as:

Frame time.
CPU utilization.
GPU utilization.
Draw calls.
Instance counts.
Memory consumption.
Geometry regeneration time.
Loading time.
Serialization time.

Do not assume an optimization is successful merely because the implementation appears more sophisticated.

7. System Design and Extensibility
7.1 Modular systems

Each subsystem should have a clearly defined responsibility and a relatively small public interface.

Examples:

BuildingSystem.
TerrainSystem.
CharacterSystem.
VegetationSystem.
PhysicsSystem.
NavigationSystem.
PersistenceSystem.

Systems should communicate through explicit interfaces and events rather than reaching into one another's internal implementation details.

7.2 Composition over inheritance

Prefer composition when assembling complex entities and behaviors.

For example, a character may consist of:

Identity.
Transform.
Appearance.
Animation.
Physics.
Navigation.
Interaction capabilities.

These capabilities should be independently extensible.

Avoid deep inheritance trees that make unrelated functionality difficult to modify.

7.3 Capability-based architecture

Where appropriate, describe entities in terms of the capabilities they provide.

For example, a door might provide:

An architectural opening.
An interaction target.
An obstruction.
A navigation connection.
An animation controller.

Other systems should consume the relevant capabilities without depending on the entire door implementation.

7.4 Event-driven communication

Use events for meaningful changes in system state.

Examples:

EntityCreated.
EntityRemoved.
BuildingModified.
RoomConnected.
WorldLoaded.
WorldSaved.
TransformChanged.
AssetLoaded.

Events should have documented payloads and predictable delivery semantics.

Avoid excessive event indirection when a direct function call is simpler and clearer.

7.5 Avoid hidden dependencies

Systems should not rely on undocumented global variables, implicit initialization order, or unrelated modules modifying shared state.

Dependencies should be explicit and injectable where practical.

8. Procedural Generation

Procedural generation should be independent of the rendering process.

8.1 Determinism

Where practical, generation should be reproducible from:

Input parameters.
Random seeds.
Versioned algorithms.
Relevant world state.

The same inputs should produce equivalent results.

8.2 Generation pipeline

Prefer a staged pipeline:

Input interpretation.
Domain-level generation.
Validation.
Structural representation.
Optimization.
Rendering conversion.
Runtime integration.

This makes generators easier to test and reuse.

8.3 Non-destructive generation

Generated content should remain identifiable as generated content.

Where practical, preserve the distinction between:

Generated structures.
User modifications.
Manually placed entities.
Derived rendering resources.

Do not overwrite user-authored information during regeneration without an explicit policy.

9. User Interfaces and Interaction
9.1 Presentation independence

User interfaces should interact with application systems through stable commands and interfaces.

The domain model should not depend on DOM elements or UI-specific state.

9.2 Input abstraction

Pointer, keyboard, touch, and future controller input should ultimately feed a common interaction architecture.

Avoid embedding application behavior directly into individual event handlers.

9.3 Interaction feedback

Every meaningful operation should provide appropriate feedback.

Examples:

Successful placement.
Invalid placement.
Missing selection.
Failed picking.
Saving.
Loading.
Resource unavailability.

Never silently discard a user operation without a meaningful explanation.

9.4 Editing workflows

Editors should distinguish:

Selection.
Preview.
Modification.
Validation.
Commitment.
Cancellation.

Temporary preview objects should not become authoritative domain entities until the user commits an operation.

9.5 Undo and redo

Substantial editing systems should progressively adopt command-based operations.

An operation should ideally support:

Execution.
Validation.
Reversal.
Reapplication.
Serialization where appropriate.

This will be particularly valuable for architectural editing.

10. Error Handling and Robustness
10.1 Fail explicitly

Errors should be observable, contextual, and actionable.

Avoid empty catch blocks and silent failure.

Errors should identify:

The operation.
The affected entity.
The relevant subsystem.
The underlying cause.
10.2 Defensive boundaries

Validate external inputs and persistent data.

Do not unnecessarily duplicate validation throughout trusted internal operations.

Establish clear trust boundaries.

10.3 Graceful degradation

Optional capabilities should not cause unrelated application systems to fail.

Examples:

Missing decorative assets should not prevent world loading.
Rendering failures should not destroy persistent data.
Optional editor tools should not prevent gameplay.
An unavailable external service should not corrupt local state.
10.4 Lifecycle safety

Asynchronous operations should account for disposal, cancellation, and changing application state.

Avoid applying results to objects that have already been destroyed or replaced.

11. Coding Conventions
11.1 General conventions
Use modern JavaScript modules.
Prefer const over let where reassignment is unnecessary.
Avoid var.
Use descriptive identifiers.
Prefer explicit object structures over positional arguments when parameters become numerous.
Use small, focused functions.
Keep side effects identifiable.
Avoid unnecessary global state.
Avoid magic numbers.
Centralize shared configuration.
Document non-obvious architectural decisions.
11.2 Naming

Use consistent terminology throughout the codebase.

Prefer:

createBuilding()
serializeBuilding()
restoreWorld()
generateGeometry()
updateInstances()

Avoid multiple names for the same conceptual operation.

Class names should describe responsibilities.

Functions should generally describe actions.

Boolean variables should read naturally as conditions.

11.3 Constants and configuration

Avoid scattering implementation-specific values throughout source files.

Centralize values such as:

Default dimensions.
Spatial tolerances.
Rendering limits.
Material definitions.
Performance thresholds.
Feature flags.

Distinguish configuration from runtime state.

11.4 Comments and documentation

Comments should explain reasoning, constraints, and non-obvious behavior.

Do not use comments merely to restate the code.

Document public interfaces, important invariants, and lifecycle requirements.

Architectural decisions with long-term consequences should be recorded.

12. Testing and Verification
12.1 Layered testing

Where practical, provide:

Unit tests.
Integration tests.
Serialization tests.
Geometry validation tests.
Rendering tests.
Performance tests.
End-to-end interaction tests.
12.2 Independent verification

A successful function call does not prove that an entire feature works.

For example, successful building creation does not prove:

Geometry is visible.
Thin instances are correctly transformed.
Persistence works.
Openings are correctly generated.
The building survives world reload.

Test complete workflows.

12.3 Regression protection

Every substantial change should consider its effects on existing systems.

Particular attention should be paid to:

World streaming.
Persistence.
Terrain generation.
Spatial transformations.
Rendering.
Existing UI.
Scene lifecycle.
12.4 Verification honesty

Clearly distinguish:

Designed.
Implemented.
Integrated.
Tested.
Runtime verified.
Deployed.

Never claim functionality is verified merely because source code has been written.

13. Security and Data Ownership
Treat externally supplied data as untrusted.
Validate imported world records.
Avoid unsafe dynamic code execution.
Minimize unnecessary permissions.
Keep secrets out of source code and persistent world records.
Avoid exposing internal implementation state through public interfaces.
Establish clear ownership of user-generated content.
Preserve data integrity during interrupted operations.
14. Project Documentation

Documentation should evolve alongside the codebase.

Maintain:

PROJECT-STATE.md

The authoritative record of:

Existing architecture.
Implemented systems.
Current development status.
Known limitations.
Pending work.
Integration requirements.
Verification status.
STYLE-GUIDE.md

The architectural and coding standards defined in this document.

Architecture decision records

For consequential decisions, record:

Context.
Problem.
Considered alternatives.
Decision.
Consequences.
Future reconsideration criteria.
Module documentation

Important systems should document:

Purpose.
Public interfaces.
Dependencies.
Data ownership.
Lifecycle.
Known limitations.

Documentation should describe the actual codebase, not an aspirational implementation.

15. Progressive Refactoring Strategy

The style guide should be adopted incrementally.

Prioritize improvements according to their architectural impact.

Priority 1 — Architectural boundaries

Establish clear separation between:

Domain data.
Application logic.
Rendering.
Persistence.
Presentation.
Priority 2 — Data integrity

Standardize:

Persistent models.
Identifiers.
Serialization.
Validation.
Versioning.
Priority 3 — Spatial consistency

Standardize:

Coordinate systems.
Transform interfaces.
Projection boundaries.
Spatial tolerances.
Priority 4 — Resource management

Improve:

Rendering resource ownership.
Instancing.
Incremental updates.
Caching.
Disposal.
Priority 5 — Inter-system communication

Introduce:

Explicit interfaces.
Consistent lifecycle management.
Shared event conventions.
Capability-based composition.
Priority 6 — Optimization and scalability

Measure and progressively improve:

CPU performance.
GPU performance.
Memory usage.
Streaming.
Geometry generation.
Persistence performance.
Priority 7 — Comprehensive testing

Build automated verification around increasingly complex system interactions.

16. Architectural Decision Principles

When making significant implementation decisions, evaluate them against the following questions:

Does this preserve separation of concerns?
Does it reduce unnecessary coupling?
Can the implementation be replaced independently?
Is authoritative data protected?
Can the system be reused elsewhere?
Does it scale beyond its initial use case?
Does it support efficient execution?
Is its lifecycle explicit?
Can it be independently tested?
Does it preserve existing functionality?
Is the abstraction justified by a concrete benefit?
Does it make future development easier rather than merely moving complexity elsewhere?

If a decision violates an existing principle, document the reason.

Practical constraints may justify exceptions, but exceptions should be deliberate rather than accidental.

17. Long-Term Architectural Vision

Somnium should progressively develop toward a collection of independent, composable systems operating on shared authoritative world data.

The same architectural foundations should support:

Procedural world generation.
Terrain and environmental simulation.
Vegetation and ecological systems.
Architectural construction.
Interior environments.
Furniture and object libraries.
Character creation.
Character behavior and navigation.
Physics and interactions.
Lighting and atmosphere.
Persistent simulation.
Multiplayer synchronization.
Alternative rendering implementations.
Alternative spatial representations.

These capabilities should emerge from shared architectural foundations rather than isolated, incompatible implementations.

The long-term goal is not to create the most elaborate framework possible.

It is to create the simplest coherent architecture capable of supporting increasingly sophisticated functionality.

18. Final Guiding Principle

Build systems around enduring concepts, not temporary implementations.

Prefer:

Data over incidental representation.
Composition over rigid inheritance.
Interfaces over concrete dependencies.
Reusable capabilities over duplicated functionality.
Deterministic processes over hidden state.
Explicit ownership over implicit coordination.
Incremental updates over unnecessary reconstruction.
Measured optimization over speculation.
Reversible decisions over unnecessary architectural commitments.

Every new feature should strengthen the existing architecture rather than create another isolated technical ecosystem.

Every substantial modification should leave the codebase at least as coherent, understandable, and extensible as it was before.

Somnium should grow in capability without growing proportionally in architectural complexity.
