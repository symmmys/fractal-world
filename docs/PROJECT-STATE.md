SOMNIUM — PROJECT STATE


Last updated: 2026-11-04

Project

Babylon.js procedural open-world simulation with experimental three-dimensional Poincaré geometry.

Existing Systems
Heightmap-based terrain with streamed chunks and LOD.
Procedural ecology, vegetation and geology.
Regional water, hydrology, rainfall and clouds.
Adaptive graphics management.
SpatialTransform and GeometryRenderer.
Experimental GPU geometry shader system.
Hyperbolic camera navigation.
Gameplay
Flight-simulator perspective.
Third-person character perspective.
Main menu with perspective selection.
Runtime perspective switching.
Character movement and terrain following.
Third-person camera with scroll-wheel zoom.
Celestial System — New Milestone

New module: src/environment/celestial-system.js

Implemented:

Visible sun and moon.
Orbital day/night cycle.
Animated directional sunlight.
Animated moonlight.
Variable ambient illumination.
Dynamic sky background coloration.
Configurable orbital speed and day length.
Celestial diagnostics.

Terrain lighting:

src/world/world-manager.js
Terrain material now receives Babylon.js lighting instead of explicitly disabling it.
Existing vertex colors are preserved.
Small emissive contribution maintains nighttime visibility.

Initial day length: 900 seconds.

Coordinate Architecture
Authoritative simulation coordinates remain separate from rendering coordinates.
Poincaré projection handles spatial distortion.
Celestial bodies use camera-relative visual positioning.
Celestial orbital direction and lighting are shared between gameplay perspectives.
Immediate Priorities
Validate terrain illumination during daylight and nighttime.
Verify sun and moon visibility from both camera perspectives.
Tune ambient illumination and terrain coloration.
Introduce atmospheric scattering and dawn/dusk coloration.
Integrate moving shadows.
Introduce camera orbit controls.
Continue hyperbolic character movement and geodesic navigation.
Architectural Requirements
Preserve existing world and environmental systems.
Keep simulation independent of rendering quality.
Maintain one persistent world across camera modes.
Never allow navigation to reach the Poincaré boundary.
Keep celestial lighting independent of camera perspective.
Validate deployed changes before marking them complete.
Source

https://tothrees.404.mn/thisispubliccodeorisit/

Future sessions should inspect the latest deployed code before modifying existing modules. Proposed implementations must not be confused with verified deployments.


## Celestial System — Atmospheric Rendering Milestone

Primary module:
src/environment/celestial-system.js

Scene integration:
src/scene/create-scene.js

### Existing Celestial Simulation

- Visible sun and moon.
- Orbital day/night cycle.
- Configurable day length.
- Animated directional sunlight.
- Animated moonlight.
- Variable ambient illumination.
- Shared celestial directions across gameplay perspectives.
- Time-of-day controls.
- Celestial diagnostics.

### Atmospheric Rendering

New procedural atmospheric sky renderer.

Implemented in the proposed CelestialSystem revision:

- GPU-based atmospheric sky shader.
- Camera-centered sky dome.
- Blue daytime sky with zenith-to-horizon gradient.
- Dark blue-black nighttime sky.
- Procedurally generated stars.
- Animated star twinkling.
- Dawn and dusk color transitions.
- Red-orange sunset coloration.
- Solar disc and atmospheric glow.
- Lunar atmospheric glow.
- Gradual star visibility transitions.
- Independent sky, sun and moon rendering groups.

### Rendering Architecture

- Babylon.js ShaderMaterial handles atmospheric rendering.
- Sky shader receives celestial directions and simulation time.
- Celestial simulation remains the authoritative source of time.
- Sky rendering follows the active camera.
- Celestial lighting remains independent of camera perspective.
- Poincaré projection remains responsible for world geometry.
- The atmospheric sky is a conventional rendering layer and is not transformed through hyperbolic geometry.

### Scene Integration

- CelestialSystem imported by create-scene.js.
- Existing directional sunlight reused.
- Existing hemispheric ambient light reused.
- Moonlight managed by CelestialSystem.
- Celestial instance exposed through scene.metadata.celestial.
- Simulation updated through scene.onBeforeRenderObservable.
- Existing world simulation and rendering loops preserved.

### Configuration

- Day length: 900 seconds.
- Celestial orbit distance: 45,000 units.
- Sky radius: 90,000 units.
- Sun diameter: 1,800 units.
- Moon diameter: 1,300 units.

### Immediate Validation Priorities

1. Verify Babylon.js shader compilation.
2. Verify atmospheric rendering on supported GPUs.
3. Verify sky positioning in flight perspective.
4. Verify sky positioning in third-person perspective.
5. Check rendering order and depth handling.
6. Verify sunrise and sunset coloration.
7. Verify nighttime darkness and star visibility.
8. Verify sun and moon visibility.
9. Check terrain lighting against atmospheric brightness.
10. Check compatibility with GeometryShaderManager.
11. Check cloud rendering against the atmospheric background.
12. Verify that camera switching does not interrupt the celestial simulation.

### Future Atmospheric Improvements

- Physically based atmospheric scattering.
- More realistic solar color based on atmospheric path length.
- Dynamic cloud shadows.
- Volumetric cloud lighting.
- Lunar phases.
- Improved star distribution and constellations.
- Atmospheric haze near the horizon.

### Architectural Requirements

- Preserve existing world and environmental systems.
- Maintain one persistent world across camera modes.
- Keep simulation independent of rendering quality.
- Keep celestial lighting independent of camera perspective.
- Never allow navigation to reach the Poincaré boundary.
- Validate deployed changes before marking proposed features as verified.

### Deployment Status

The atmospheric renderer and scene integration are proposed changes.

Do not consider the new atmospheric rendering milestone
verified until it has been deployed and tested in the actual
Babylon.js application.

Atmospheric Rendering — Milestone 1: Improved Clouds and Cumulonimbus

Implementation prepared: 2026-11-05

Collaboration and Code Delivery Workflow

Future development sessions must follow this workflow:

Inspect the latest publicly available codebase and read the entire current PROJECT-STATE.md.
Inspect existing implementations and dependencies before proposing modifications.
Provide complete replacement files for existing modules that require changes.
Provide complete source files for newly introduced modules.
Include all necessary imports and integration instructions.
Provide PROJECT-STATE.md updates as appendable Markdown.
Clearly distinguish proposed code, delivered code, deployed code and independently verified code.
Do not assume direct repository write access is available. The intended workflow is to deliver complete code additions and replacements directly in the conversation for manual integration.
Cloud Rendering Improvements

Files prepared:

src/atmosphere/cloud-species.js
src/atmosphere/cloud.js
src/atmosphere/cloud-generator.js
src/rendering/cloud-renderer.js
src/world/chunk-cloud-system.js

Improvements:

Increased procedural cloud dimensions.
Added explicit instance color-buffer management.
Corrected the missing instance-color population in the cloud rendering path.
Introduced species-specific cloud coloration.
Added moisture-responsive cloud shading.
Replaced geological recursive generation dependency with dedicated atmospheric geometry generation.
Added deterministic cloud geometry seeds.
Improved cloud morphology through overlapping irregular ellipsoidal lobes.
Increased cloud-layer altitude relative to local terrain.
New Cloud Species

Three supported species:

Cumulus

Broad horizontal development.
Bright coloration.
Relatively shallow vertical development.

Towering Cumulus

Increased vertical dimensions.
More substantial atmospheric development.
Increased moisture capacity and precipitation duration.

Cumulonimbus

Large-scale storm formations.
Significant vertical development.
Darker lower cloud regions.
Lighter upper cloud regions.
Increased moisture capacity.
Stronger precipitation intensity.
Longer precipitation duration.
Simulation Integration
Existing chunk streaming preserved.
Existing atmospheric moisture calculations preserved.
Existing hydrology integration preserved.
Existing precipitation-state simulation preserved.
Storm clouds integrated into species selection.
Cloud geometry cached after initial generation.
Cloud geometry updates remain on the existing rendering interval.
Outstanding Atmospheric Work

Not yet implemented or verified:

Multiple simultaneous spatially correct rain emitters.
Rain rendering through SpatialTransform.
Visible precipitation shafts and storm rain curtains.
Rayleigh atmospheric scattering.
Mie forward scattering.
Atmospheric horizon haze.
Sun-dependent volumetric cloud illumination.
Twilight atmospheric coloration.
Improved cloud shadows.
Validation Requirements
Confirm clouds are visible in flight perspective.
Confirm clouds are visible in third-person perspective.
Confirm cloud geometry survives Poincaré projection.
Confirm instance color buffers match rendered instance counts.
Confirm cumulonimbus formations are visibly taller than ordinary cumulus.
Confirm cloud streaming remains stable during navigation.
Confirm existing moisture and hydrology simulation continues working.
Measure rendering performance with the increased cloud geometry.
Deployment Status

Code delivered for manual integration.

Deployment and runtime verification pending.

Do not mark this milestone as deployed until the replacement files have been integrated and tested in the running application.
Atmospheric Rendering — Milestone 2: Cloud Morphology and Scale

Implementation prepared: 2026-11-05

Files Updated
src/atmosphere/cloud-species.js
src/atmosphere/cloud-generator.js
src/world/chunk-cloud-system.js (targeted modification)
Cloud Scale Improvements

Increased the base cloud dimensions:

Species	Previous scale	New scale
Cumulus	240	620
Towering	480	1050
Cumulonimbus	900	1450

Introduced wider per-cloud scale variation:

Ordinary clouds: 0.62–1.70 multiplier.
Cumulonimbus: 0.78–1.40 multiplier.
Procedural Morphology

Replaced repetitive recursive cloud generation with species-specific procedural construction.

Cumulus

Broad overlapping lobes.
Irregular upper crowns.
Horizontal development.
Randomized lobe dimensions and positions.

Towering Cumulus

Multiple vertical formation levels.
Narrower central structure.
Irregular upper development.
Increased vertical variation.

Cumulonimbus

Large vertical storm column.
Multiple overlapping formation levels.
Broad anvil-like upper structure.
Additional upper storm towers.
Increased geometric complexity.
Deterministic Generation
Seeded random generation preserved.
Individual cloud geometry remains reproducible.
Independent lobe dimensions, rotations and offsets.
Chunk generation architecture preserved.
Performance Considerations
Geometry remains generated once per cloud.
Existing thin-instance rendering retained.
Maximum lobe counts constrain instance growth.
No external dependencies introduced.
Validation Requirements
Compare cloud sizes at different viewing distances.
Verify cloud morphology across regenerated chunks.
Confirm cumulonimbus anvil structures remain visible.
Check cloud overlap and density.
Measure thin-instance counts and frame rates.
Verify Poincaré projection of larger cloud formations.
Test flight and third-person perspectives.
Outstanding Work
Volumetric cloud lighting.
Atmospheric scattering.
Cloud shadows.
Multiple simultaneous rain emitters.
Visible storm precipitation.
Dynamic cloud evolution and weather transitions.
Deployment Status

Code prepared for manual integration.

Runtime validation and deployment verification pending.

## Atmospheric Rendering — Cloud Refinement and Performance Milestone

Implementation prepared: 2026-11-05

### Visual Refinements

- Reduced overall cloud dimensions.
- Increased cloud-layer altitude.
- Reduced recursive cloud geometry complexity.
- Preserved three cloud species.
- Preserved irregular overlapping ellipsoid morphology.
- Reduced moisture-driven horizontal expansion.
- Reduced moisture-driven vertical expansion.
- Preserved storm-cloud vertical development.
- Reduced cloud prototype sphere resolution.

### Performance Improvements

- Cloud environmental sampling cached for one second.
- Cloud simulation restricted to active streaming chunks.
- Inactive chunks no longer incur continuous cloud simulation costs.
- Reduced recursive geometry generation through shallower branching.
- Reduced unnecessary geometry complexity.

### Architectural Preservation

- Existing deterministic cloud generation preserved.
- Existing chunk streaming architecture preserved.
- Existing hydrology integration preserved.
- Existing precipitation mechanics preserved.
- Existing moisture calculations preserved.
- Existing thin-instance rendering architecture preserved.
- Existing species-specific coloration preserved.
- Existing cloud geometry caching preserved.

### Validation Required

1. Confirm cloud size and altitude visually.
2. Confirm sky visibility in both camera perspectives.
3. Confirm cloud movement remains continuous.
4. Confirm cumulonimbus formations retain their distinctive vertical morphology.
5. Confirm moisture accumulation and precipitation.
6. Confirm cloud transitions between active and inactive chunks.
7. Confirm rendering buffers remain synchronized.
8. Measure CPU and GPU utilization before and after changes.
9. Measure sustained system temperatures during equivalent simulation workloads.

### Deployment Status

Code changes prepared for manual integration.

Not yet deployed or runtime verified.

Performance improvements are expected from reduced geometry and inactive-chunk simulation, but actual temperature reductions must be measured on the target hardware.


## Atmospheric Simulation — Milestone 3:
## Regional Weather, Air Pressure and Wind

Implementation prepared: 2026-11-05

### New Module

src/atmosphere/air-pressure-field.js

### Atmospheric Pressure

- Introduced a spatially varying atmospheric pressure field.
- Multiple overlapping pressure waves create large-scale variation.
- Pressure evolves continuously with simulation time.
- Horizontal pressure gradients determine wind direction.
- Prevailing atmospheric circulation provides background wind.
- Wind velocity is constrained to configurable maximum strength.

### Regional Weather Classification

Three atmospheric regimes:

1. Stable
2. Convective
3. Storm-conducive

Classification considers:
- Local evaporation potential.
- Atmospheric pressure.
- An approximate atmospheric instability indicator.

Weather classifications are cached by spatial region.

### Cloud Species Selection

Stable regions:
- Predominantly cumulus.
- Occasional towering cumulus.
- No cumulonimbus.

Convective regions:
- Cumulus.
- Towering cumulus.
- No cumulonimbus.

Storm-conducive regions:
- Cumulus.
- Towering cumulus.
- Rare cumulonimbus.

Similar cloud families are more likely to occur
within the same regional weather system.

### Wind Simulation

- Clouds sample the atmospheric wind field.
- Cloud velocities gradually approach local wind velocity.
- Small-scale atmospheric turbulence is introduced.
- Abrupt changes in wind direction are avoided.
- Clouds retain individual movement velocities.

### Dynamic Cloud Rendering

- Cloud geometry is generated relative to local origins.
- Geometry is cached after generation.
- Current cloud positions are applied during rendering.
- Cloud instance transformations are refreshed periodically.
- Cloud geometry is not regenerated during ordinary movement.

### Performance Considerations

- Pressure field uses inexpensive analytical functions.
- Pressure gradients use four spatial evaluations.
- No full fluid simulation grid introduced.
- No external atmospheric simulation dependencies.
- Weather classifications are cached by region.
- Cloud geometry generation remains independent
  of the wind update frequency.

### Outstanding Atmospheric Work

- Dynamic transitions between weather regimes.
- Atmospheric fronts and storm movement.
- Multiple simultaneous precipitation emitters.
- Cloud shadow projection.
- Volumetric cloud lighting.
- Atmospheric vertical wind profiles.
- Orographic lifting over mountainous terrain.
- Improved pressure and humidity diagnostics.

### Validation Requirements

1. Confirm cumulonimbus formations are uncommon.
2. Confirm cumulonimbus only appear in storm-conducive regions.
3. Confirm neighboring clouds exhibit regional similarity.
4. Confirm pressure changes smoothly across space.
5. Confirm wind direction follows pressure gradients.
6. Confirm clouds move visibly but gently.
7. Confirm rendered cloud positions follow simulation positions.
8. Confirm rainfall still functions.
9. Confirm cloud rendering works in both camera perspectives.
10. Measure CPU and GPU performance.

### Deployment Status

Source changes prepared for manual integration.

Deployment and runtime verification pending.


## Environmental Generation — Milestone 3
### Atmospheric Wind, Continuous Geology and Fractured Bedrock

Implementation status: Partially prepared
Deployment status: Pending

### Geological Field
- Expanded geological material classification.
- Added granite, limestone, sandstone and basalt.
- Added scree and exposed bedrock classification.
- Added continuous rock exposure calculations.
- Added porosity and moisture retention.
- Added soil fertility and erosion resistance.
- Preserved terrain heightmap authority.
- Preserved deterministic geological noise.

### Angular Rock Generation
- Replaced recursive spherical formations with
  angular rectangular-prism geometry.
- Added irregular dimensions and rotations.
- Preserved recursive branching.
- Preserved deterministic generation.
- Retained existing transformation-matrix interface.

### Atmospheric Wind
Planned:
- Elevated cloud layers.
- Coherent regional prevailing winds.
- Localized wind variation.
- Continuous horizontal cloud movement.
- Rendering synchronization.
- Species-specific atmospheric altitude.

### Surface Geology
Planned:
- Continuous geological coverage.
- Exposed bedrock on steep slopes.
- Material-specific terrain coloration.
- Sediment and scree transitions.
- Improved geological surface blending.

### Validation Requirements
- Verify all terrain locations have geological properties.
- Verify material transitions are spatially continuous.
- Verify rock formations follow terrain elevation.
- Verify rocks intersect the terrain naturally.
- Verify angular geometry under Poincaré projection.
- Verify cloud movement and rendering synchronization.
- Verify cloud altitude in both camera perspectives.
- Verify chunk streaming and thin-instance performance.

### Deployment Status
Geological field and rock generator replacements prepared.
Full chunk-system integration pending.
No deployment or runtime verification claimed.

partway through improving the geology system

## Environmental Generation — Geological and Atmospheric Refinement

Implementation prepared: 2026-11-05

### Atmospheric Wind

- Introduced coherent spatially varying wind.
- Added gradual cloud velocity transitions.
- Increased cloud altitude.
- Preserved terrain-relative cloud positioning.
- Preserved cached cloud geometry.
- Corrected the missing rendering invalidation after cloud movement.
- Preserved existing moisture and precipitation simulation.

### Geological Sampling

- Expanded GeologicalField material properties.
- Added deterministic geological strata variation.
- Added surface roughness.
- Added bedrock exposure.
- Added weathering characteristics.
- Added material density, hardness, cohesion and porosity.
- Added moisture capacity to every valid geological sample.
- Preserved deterministic world generation.

### Angular Rock Formations

- Replaced recursive sphere transforms with recursive box transforms.
- Introduced asymmetric formations.
- Increased rotational variation.
- Added buried formation bases.
- Added irregular protrusions.
- Preserved thin-instance rendering.
- Preserved deterministic formation seeds.
- Preserved geological species characteristics.

### Remaining Integration Work

1. Complete the ChunkCloudSystem updateSimulation refactor.
2. Integrate GeologicalField into terrain-mesh-worker.js.
3. Apply geological material colors to every terrain vertex.
4. Blend geological boundaries.
5. Add exposed-bedrock coloration based on slope and exposure.
6. Add surface roughness variation.
7. Validate rock formation intersections with terrain.
8. Validate cloud movement in both camera perspectives.
9. Measure chunk generation and rendering performance.
10. Verify Poincaré projection compatibility.

### Deployment Status

Source changes prepared for manual integration.

Not deployed or runtime verified.

Terrain-worker geological rendering integration remains outstanding.


## Environmental Generation — Milestone 4
### Continuous Geology, Soil Horizons and Ecological Affinities

Implementation prepared: 2026-11-05

### Atmospheric Refinement
- Reduced wind velocity to 20% of previous targets.
- Corrected duplicate cloud simulation loops.
- Ensured each cloud is simulated once per simulation step.
- Preserved coherent regional wind.
- Preserved cached cloud geometry.
- Preserved precipitation and moisture accumulation.

### Geological Field
- Added granite, basalt, limestone and sandstone classification.
- Added scree and exposed bedrock.
- Added organic soil, loam, silt, clay and sand.
- Added variable geological strata.
- Added deterministic material variation.
- Separated underlying bedrock from surface soil.

### Soil Horizons
- Added O horizon: organic material.
- Added A horizon: topsoil.
- Added B horizon: subsoil.
- Added C horizon: weathered parent material.
- Added variable soil depth.
- Added slope-dependent soil exposure.

### Terrain Rendering
- Added deterministic geological color sampling to terrain worker.
- Added soil and bedrock color blending.
- Added exposed mountain geology.
- Added surface variation.
- Preserved existing LOD and neighbor edge stitching.
- Preserved worker transfer protocol.

### Hydrology
- Added material-specific infiltration.
- Added water retention capacity.
- Added material-specific drainage.
- Added soil-specific evaporation.
- Added rainfall runoff accounting.
- Connected geological properties to hydrology cells.

### Ecology
- Added oak and pine soil preferences.
- Added fertility suitability.
- Added drainage suitability.
- Added soil texture suitability.
- Added moisture suitability.
- Connected streamed tree populations to hydrology.
- Added periodic geological sampling for tree suitability.

### Remaining Work
1. Validate terrain-worker coloration against GeologicalField.
2. Tune soil horizon depths against world scale.
3. Add downslope runoff transport.
4. Introduce additional vegetation species.
5. Introduce biome transitions.
6. Validate rock formations against actual terrain surfaces.
7. Measure generation and rendering performance.
8. Validate both camera perspectives.
9. Validate Poincare geometry compatibility.

### Deployment Status
Implementation prepared for manual integration.
Not deployed or runtime verified.
Visual and performance validation pending.

Environmental Generation — Milestone 5: Expanded Plant Ecology

Implementation status: Proposed
Deployment status: Not yet implemented or verified

Existing Ecology
Oak and pine tree populations.
Genetic inheritance and mutation.
Age-dependent growth.
Tree reproduction and mortality.
Soil affinity and fertility suitability.
Hydrology integration.
Canopy shading.
Distance-based vegetation rendering.
New Vegetation Species

Planned species groups:

Grass and herbaceous ground cover.
Giant emergent rainforest trees.
Temperate and tropical forest trees.
Desert shrubs.
Cacti and succulent plants.
Mangrove trees.
Climbing vines and lianas.
Ecological Simulation

Each plant population should support:

Deterministic generation.
Persistent population records.
Species-specific growth.
Age and maturity.
Genetic inheritance.
Reproduction and dispersal.
Water and nutrient requirements.
Environmental stress.
Competition and mortality.
Decomposition and organic matter contribution.
Environmental Integration

Vegetation should interact with:

GeologicalField.
Soil horizons.
Hydrology.
Regional rainfall.
Surface moisture.
Terrain elevation.
Terrain slope.
Coastal proximity.
Solar illumination.
Existing canopy shading.
Biome Development

Planned environmental regions:

Tropical rainforest.
Temperate forest.
Boreal forest.
Grassland.
Savanna.
Desert.
Coastal wetlands.
Mangrove forests.
Alpine vegetation.

Biome transitions should be spatially continuous rather than abrupt.

Rendering Architecture
Separate simulation and rendering.
Preserve vegetation across chunk unloading.
Use thin-instance rendering where appropriate.
Support multiple vegetation detail levels.
Support growth-dependent geometry.
Preserve compatibility with SpatialTransform and GeometryRenderer.
Avoid unnecessary geometry regeneration.
Worker Diagnostics

Investigate WorldManager terrain worker errors.

Improve worker error reporting.
Capture worker loading and runtime failures.
Capture message deserialization errors.
Preserve synchronous terrain generation fallback.
Verify worker module deployment and MIME type.
Verify successful initialization and terrain generation.

The browser developer-tools source-map 404 should be investigated separately.

Existing Ecology Corrections
Restore the missing maxDepth declaration in TreeGenerator.
Connect tree soil moisture to Hydrology.sampleMoisture().
Verify tree growth against actual environmental conditions.
Validation Requirements
Verify worker initialization.
Verify terrain generation using the worker.
Verify synchronous fallback.
Verify persistent plant populations.
Verify vegetation across chunk boundaries.
Verify growth, reproduction and mortality.
Verify biome transitions.
Verify rendering in both camera perspectives.
Measure CPU and GPU performance.
Verify Poincaré projection compatibility.

No implementation should be considered deployed or verified until tested in the running application.
Bug Fixes — Worker Reliability and Celestial Rendering

Implementation prepared: 2026-11-05

Authoritative Source Confirmation

The publicly accessible endpoint:

https://tothrees.404.mn/thisispubliccodeorisit/

represents the exact current project codebase.

The project owner explicitly confirmed on 2026-11-05 that no unpublished local modifications need to be preserved.

Future development sessions should treat this endpoint as the authoritative source unless the owner explicitly reports otherwise.

Terrain Worker

Identified defect:

Duplicate terrainColor() declarations in src/world/terrain-mesh-worker.js.
The second declaration overrides the complete implementation.
Its commented-out color assignments leave color undefined.
This causes terrain generation exceptions.

Proposed correction:

Remove the defective duplicate implementation.
Preserve the complete geological terrain-color implementation.
Improve worker initialization diagnostics.
Add worker initialization timeout.
Handle worker runtime and message deserialization failures.
Preserve outstanding valid tasks during worker failure.
Improve synchronous fallback queue handling.
Celestial Rendering

Primary module:

src/environment/celestial-system.js

Identified issues:

Sky dome combines infinite-distance rendering with manual camera positioning.
Sky radius approaches the camera far clipping distance.
Sun and moon are independently positioned camera-relative meshes.
Celestial meshes render independently of normal scene depth occlusion.

Proposed corrections:

Use conventional camera-centered sky positioning.
Constrain effective sky radius to the camera far plane.
Render solar and lunar discs through the atmospheric shader.
Remove independent celestial meshes.
Preserve directional sunlight and moonlight simulation.
Preserve dawn, dusk, nighttime and star transitions.
Preserve atmospheric glow.
Integration Requirements
Preserve Poincaré geometry.
Preserve both gameplay perspectives.
Preserve cloud rendering and streaming.
Preserve existing terrain lighting.
Preserve the authoritative simulation coordinate system.
Validation Requirements
Verify successful worker initialization.
Verify terrain generation without workers.
Verify worker recovery after initialization failure.
Verify worker recovery after runtime failure.
Verify no duplicate terrain generation.
Verify full sky coverage in flight mode.
Verify full sky coverage in third-person mode.
Verify celestial occlusion against terrain.
Verify celestial occlusion against clouds.
Verify sunrise, sunset and nighttime transitions.
Verify compatibility with GeometryShaderManager.
Deployment Status

Code corrections prepared for manual integration.

No repository deployment or runtime verification is claimed.

The published endpoint remains the authoritative pre-integration snapshot until updated by the project owner.
Bug Fix — Celestial System Initialization

Implementation prepared: 2026-11-05

Identified Defect

Module: src/environment/celestial-system.js

Application initialization failed with:

TypeError: can't access property "setVector3", this.skyMaterial is undefined

Root cause:

The CelestialSystem constructor invoked update(0) before creating the atmospheric sky.
skyMaterial was initialized exclusively inside createSky().
The constructor did not invoke createSky().
Consequently, the initial update attempted to access an undefined shader material.
Proposed Corrections
Initialize the atmospheric sky through createSky() before the initial simulation update.
Preserve initialization of the authoritative solar and lunar direction vectors.
Retain shader-based rendering of the sun and moon.
Avoid redundant independent celestial meshes.
Make disposal safe when rendering resources have not been fully initialized.
Preserve existing directional sunlight and hemispheric ambient illumination.
Preserve camera-relative sky positioning.
Preserve the existing day/night cycle and atmospheric transitions.
Initialization Sequence
Initialize celestial simulation state.
Initialize directional lighting.
Initialize the atmospheric sky mesh and shader material.
Initialize atmospheric shader uniforms.
Perform the initial celestial update.
Begin normal scene-driven simulation updates.
Validation Requirements
Confirm application initialization completes.
Confirm atmospheric shader compilation.
Confirm no undefined sky-material errors.
Confirm sun and moon visibility.
Confirm camera-relative sky positioning.
Test flight perspective.
Test third-person perspective.
Verify sunrise and sunset transitions.
Verify nighttime star visibility.
Verify scene disposal without errors.
Confirm compatibility with GeometryShaderManager.
Confirm terrain and cloud rendering remain unaffected.
Deployment Status

Source correction proposed for manual integration.

Not yet deployed or independently runtime verified.

Do not mark this correction as verified until tested in the running Babylon.js application.
Environmental Generation — Soil Distribution Map

Implementation prepared: 2026-11-05

Objective

Introduce geographically coherent soil distribution using the existing topographic heightmap as a shared soil-distribution resource.

Texture Architecture

Existing resource:

assets/0_somnium_map_topographic.png

The same texture supplies:

Terrain elevation.
Broad soil distribution.

Pixel brightness determines soil classification through configurable normalized brightness ranges.

Initial Soil Classification
Brightness	Soil
0.00–0.18	Clay / wet sediment
0.18–0.38	Desert sand
0.38–0.58	Fertile soil / sandy loam
0.58–0.76	Loam
0.76–0.90	Organic soil
0.90–1.00	Scree / exposed geological material

Desert sand receives a distinctive golden-yellow surface coloration.

These thresholds are initial tuning parameters and require visual validation against the actual topographic texture.

Modified Modules
src/environment/heightmap-terrain.js
Introduce normalized map-brightness sampling.
Preserve existing bilinear coordinate interpolation.
src/geology/geological-field.js
Use topographic brightness for regional soil classification.
Preserve local geological and moisture variation.
Preserve soil horizons and material properties.
Expose map brightness in geological diagnostics.
src/world/terrain-mesh-worker.js
Apply matching soil classification to terrain vertex colors.
Preserve bedrock blending and surface variation.
Remove the defective duplicate terrainColor implementation.
Environmental Integration

The resulting soil classification feeds into:

Hydrological infiltration.
Soil water retention.
Drainage.
Soil fertility.
Ecological suitability.
Future biome classification.
Architectural Requirements
Preserve the existing heightmap as the authoritative elevation source.
Use consistent world-to-texture coordinate mapping.
Keep terrain rendering and geological simulation synchronized.
Preserve terrain chunk streaming and LOD.
Preserve worker and synchronous fallback compatibility.
Avoid introducing a second texture-loading dependency.
Future Improvements
Dedicated soil-distribution texture.
Independently configurable soil brightness thresholds.
Multiple desert varieties.
Sand dune geometry.
Desert-specific vegetation.
Climate-dependent soil transitions.
Soil moisture visualization.
Validation Requirements
Confirm large contiguous yellow desert regions.
Verify soil transitions across terrain chunks.
Verify identical soil classification in rendering and GeologicalField.
Verify hydrological properties in desert regions.
Verify vegetation suitability in desert regions.
Check exposed bedrock on steep terrain.
Verify terrain coloration at all LOD levels.
Confirm worker and synchronous fallback consistency.
Verify compatibility with Poincaré geometry.
Check both flight and third-person perspectives.
Deployment Status

Implementation design and targeted source modifications prepared.

Not yet deployed or runtime verified.

The desert distribution thresholds must be visually tuned against the actual topographic map before the milestone is considered complete.

Persistent Worlds — Milestone 1: Named World Library

Implementation prepared: 2026-11-05

Status: Initial persistence architecture and source modules prepared.

Objective

Introduce multiple independently named Somnium worlds with persistent storage, independent procedural seeds and serialized ecological populations.

The architecture is intended to support hybrid procedural/manual world creation.

New Modules

src/world/persistence/world-state.js

Defines the versioned persistent world schema.
Stores world identity and metadata.
Stores procedural generation configuration and seed.
Stores simulation time.
Stores serialized ecology chunk records.
Provides validation and serialization.
Establishes collections for manual entities, procedural overrides and deleted procedural objects.

src/world/persistence/world-persistence.js

IndexedDB-backed world storage.
Multiple named worlds.
World creation.
World listing.
World loading.
World saving.
World renaming.
World deletion.
Transactional writes.
Revision-based concurrent modification protection.

src/world/persistence/world-session.js

Connects persistent world state to ChunkEcologySystem.
Captures all generated ecology chunk records.
Uses ChunkPopulationManager.exportRecord().
Restores chunk populations using ChunkPopulationManager.importRecord().
Restores the procedural ecology seed.
Invalidates previously generated population records.

src/world/persistence/world-library-ui.js

Separate world-library interface.
Create named worlds.
List saved worlds.
Load selected worlds.
Save current world.
Rename worlds.
Delete worlds.
Provides a launcher independent of the existing perspective-selection menu.
Existing Systems Reused

src/world/chunk-population-manager.js

Existing serialization functionality:

exportRecord()
importRecord()
Population serialization adapters.
Population deserialization adapters.
Retained chunk records.
Chunk activation and deactivation.

src/world/chunk-ecology-system.js

Existing deterministic chunk population generation.
Existing population management.
Existing biological simulation.
Existing thin-instance rendering.
Existing ecological chunk streaming.
Initial Persistent World Format

Each world includes:

Unique world ID.
Human-readable name.
Creation and modification timestamps.
Save revision.
Procedural world seed.
Generator version.
Simulation elapsed time.
Serialized ecology chunk records.
Manual entity collection.
Procedural entity overrides.
Procedural entity deletion records.
Environment state collection.
Architectural Decisions
Multiple named worlds are supported from the beginning.
IndexedDB is the primary local persistence mechanism.
Babylon.js rendering objects are excluded from serialized world data.
Authoritative world coordinates are preserved.
Chunk population records are retained independently of currently visible chunks.
Procedural generation remains deterministic using world-specific seeds.
Rendering is reconstructed from persistent simulation data.
World data is schema-versioned.
Saving is explicit in the initial implementation.
Procedural objects, manual objects and modified procedural objects have separate persistence categories.
Current Scope Limitations

The initial implementation establishes the persistence foundation but does not yet complete:

Stable biological identities across all tree generations.
Full biological-state serialization.
Hydrology cell persistence.
Cloud and atmospheric simulation restoration.
Geological erosion-state restoration.
Exact celestial clock restoration.
Manual building and vegetation placement.
Asset and prototype registration.
Undo and redo.
Character and animation persistence.
Portable JSON world import/export.

The manual entity collections are established in the schema but are not yet connected to a creation interface.

Required Integration
Import the persistence modules in create-scene.js.
Initialize the persistence database.
Construct WorldSession after ChunkEcologySystem.
Connect WorldLibraryUI callbacks.
Restore ecology records on world selection.
Synchronize procedural seeds across world-generation systems.
Capture ecology records on explicit save.
Register persistence cleanup in scene disposal.
Validation Requirements
Create multiple named worlds.
Verify unique world IDs.
Verify independent procedural seeds.
Save one world and switch to another.
Reload a previously saved world.
Verify previously generated ecological chunks are restored.
Verify unloaded chunks retain their populations.
Verify new chunks use the selected world's seed.
Verify no duplicate tree populations.
Verify database transactions and revision conflicts.
Verify persistence survives browser reload.
Verify world deletion and renaming.
Verify resource cleanup during world switching.
Verify both flight and third-person perspectives.
Next Milestone — Persistent Ecology
Stable tree IDs.
Preserve parent/offspring relationships.
Preserve reproduction timers.
Preserve complete genetic state.
Preserve soil and environmental stress state.
Preserve all biological simulation variables.
Ensure restored organisms resume growth without resetting.
Deployment Status

Source modules and integration instructions prepared for manual integration.

No direct repository modifications or deployment performed.

No runtime verification claimed.

The persistence architecture must be tested in the running application before this milestone is marked complete.

Architectural Construction — Milestone 1: Hybrid Building Editor

Implementation prepared: 2026-11-05
Implementation status: Source modules delivered for manual integration
Deployment status: Pending
Runtime verification: Pending

Objective

Introduce a hybrid architectural construction system combining floor-plan drawing with modular editing.

Buildings are the primary manually constructed world entities.

The editor is designed to support complete structures with interiors, architectural openings, furniture, and future character navigation.

New Modules

src/buildings/building-model.js

Serializable BuildingModel.
Independent building identifiers.
Rectangular room definitions.
Floor assignments.
Door and window opening definitions.
Modular architectural components.
Furniture and fixture records.
Versioned serialization and validation.

src/buildings/building-generator.js

Rectangular floor generation.
Ceiling generation.
Exterior wall generation.
Interior partition generation.
Shared wall deduplication.
Doorway openings.
Window openings.
Window glazing.
Door frames.
Independent modular component generation.

src/buildings/building-renderer.js

Reuses existing ThinInstanceRenderer.
Shared architectural geometry prototypes.
Separate instance batches for architectural categories.
Existing GeometryRenderer integration.
Poincaré transformation compatibility.
Rendering diagnostics.
Rendering resource disposal.

src/buildings/building-system.js

Building lifecycle management.
Architectural geometry generation.
Room creation.
Opening creation.
Furniture placement.
Persistent world capture and restoration.
Building diagnostics.

src/editor/building-editor.js

Initial construction interface.
Rectangular room drawing.
Configurable grid snapping.
Door placement tool.
Window placement tool.
Furniture placement tool.
Editor lifecycle management.
Scene Integration

Primary integration module:

src/scene/create-scene.js

Integration points:

BuildingSystem initialization.
BuildingEditor initialization.
Existing SpatialTransform.
Existing GeometryRenderer.
Existing WorldLibraryUI.
Existing WorldSession.
Existing scene diagnostics.
Existing scene disposal lifecycle.
Persistence

Buildings are stored in:

world.entities.manual

Building rendering resources are never serialized.

Buildings are reconstructed from architectural records when a world is loaded.

Existing ecological persistence remains unchanged.

No WorldState or IndexedDB schema migration is required.

Construction Workflow
Draw rectangular room footprints.
Generate floors, walls, and ceilings.
Add additional rooms.
Generate shared interior partitions.
Add doors and windows.
Place furniture and fixtures.
Save the persistent world.
Initial Architectural Limitations
Rectangular, axis-aligned room footprints.
Basic door and window dimensions.
Initial door and window placement uses a default wall position.
Basic furniture representation.
No roof generator yet.
No staircase generator yet.
No undo/redo system yet.
No architectural Boolean geometry.
No building collision system.
No character navigation integration.
No advanced building selection or transformation interface.
Performance Architecture
Reuse ThinInstanceRenderer.
Batch architectural objects by prototype category.
Preserve shared geometry.
Avoid individual Babylon.js meshes for repeated components.
Keep rendering separate from authoritative architectural data.
Avoid per-frame architectural geometry regeneration.

Future optimization: dirty-building updates and incremental instance-buffer synchronization.

Hyperbolic Geometry Considerations

Existing GeometryRenderer transformation is retained.

Its Jacobian-derived uniform instance scaling is an approximation.

Architectural deformation, wall alignment, and interior proportions must be tested throughout the Poincaré projection domain.

Immediate Validation Requirements
Confirm all new modules load.
Confirm scene initialization completes.
Confirm building editor opens and closes.
Confirm terrain picking works.
Draw a rectangular room.
Draw multiple adjoining rooms.
Confirm shared wall deduplication.
Confirm doorway geometry.
Confirm window openings and glazing.
Confirm furniture placement.
Confirm thin-instance buffers update correctly.
Verify Euclidean rendering.
Verify Poincaré rendering.
Save and reload a world.
Confirm buildings survive browser reload.
Confirm existing ecology and world streaming remain unaffected.
Measure CPU and GPU performance.
Future Architectural Milestones

Milestone 2 — Complete Architectural Editing

Wall selection and modification.
Click-to-place openings.
Modular component editing.
Object duplication.
Object deletion.
Undo and redo.
Building selection.
Interior/exterior viewing modes.

Milestone 3 — Complete Buildings

Roof generation.
Multiple floors.
Staircases.
Interior partitions.
Improved furniture library.
Architectural materials.
Terrain-adaptive foundations.
Improved lighting.

Milestone 4 — Interior Simulation

Room connectivity.
Door interaction.
Interior collision.
Walkable surfaces.
Navigation graphs.

Milestone 5 — Character Editor

Character creation.
Character customization.
Character placement.
Animation.
Character navigation and interactions.
Deployment Status

All modules in this milestone have been delivered as proposed source code for manual integration.

No direct repository modification, successful deployment, or runtime verification is claimed.

Do not mark this milestone complete until the implementation has been integrated and tested in the actual Babylon.js application.

Building Editor — Terrain Picking Investigation

Implementation date: 2026-11-05

Identified terrain interaction defects:

WorldChunk.applyMeshData() explicitly disabled Babylon.js terrain mesh picking.
Terrain mesh metadata did not include the terrainChunk identifier expected by BuildingEditor.
BuildingEditor filtered terrain picking using that missing metadata property.

Corrections:

Enable terrain chunk picking.
Add terrainChunk: true to terrain mesh metadata.
Preserve existing chunk coordinates and LOD metadata.
Add terrain mesh registration diagnostics.
Add pickable terrain counts.
Add ray origin and direction diagnostics.
Preserve SpatialTransform.renderToWorld() conversion.

Validation pending:

Confirm terrain chunks register as pickable.
Confirm pointer rays intersect terrain.
Confirm valid authoritative world positions are returned.
Confirm room creation is reached.
Confirm generated geometry renders.
Verify both Euclidean and Poincaré modes.

Deployment and runtime verification pending.


## Architectural Editor Development

### Architectural principles

- Building placement is independent of terrain elevation.
- Horizontal positioning, vertical elevation, and rotation
  are independently controllable.
- Terrain is a spatial reference, not a placement constraint.
- Buildings may be underground, underwater, floating,
  or positioned above terrain.
- Building geometry remains independent of editor UI.
- Reference images are independent assets, not geometry.
- Architectural components should remain modular and reusable.
- Character placement and editing are future milestones.

### Coordinate systems

- Authoritative world coordinates are distinct from
  Babylon rendering coordinates.
- SpatialTransform is responsible for conversions.
- Rendering systems must not assume world coordinates
  are directly interchangeable with render coordinates.
- Nonlinear projections require appropriate local
  geometric approximations.

### Rendering

- Prefer thin-instance rendering for repeated geometry.
- Reuse geometry prototypes and materials.
- Avoid unnecessary mesh creation.
- Keep rendering independent of architectural data.
- Consider projection-aware geometry for large structures.

### Editor architecture

- EditorCamera manages architectural navigation.
- BuildingPlacement manages placement transforms.
- FloorPlanReference manages imported reference imagery.
- BuildingEditor coordinates interaction and presentation.
- BuildingSystem remains responsible for building data
  and procedural geometry generation.

### Game modes

- Flight, third-person, and architectural editing are
  independent application modes.
- Camera state must be preserved when switching modes.
- Editor controls must not interfere with gameplay controls.

### Source-code collection convention

Whenever requesting source code from the developer,
provide a copyable Bash command that:

1. Lists every requested filename explicitly.
2. Reads each complete file.
3. Adds clear filename delimiters.
4. Sends the combined output to wl-copy.
5. Requires no manual filename-list assembly.

Example:

    printf '%s\n' \
      src/example/one.js \
      src/example/two.js \
      | while IFS= read -r f; do
          [[ -f "$f" ]] && {
            printf '\n\n===== %s =====\n' "$f"
            cat "$f"
          }
        done | wl-copy

