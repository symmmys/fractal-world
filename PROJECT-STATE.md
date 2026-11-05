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

