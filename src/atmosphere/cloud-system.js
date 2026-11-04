
import { Cloud } from "./cloud.js";

import { CloudSpecies } from "./cloud-species.js";

import { CloudGenerator } from "./cloud-generator.js";

import { CloudRenderer } from "../rendering/cloud-renderer.js";


class CloudSystem {

    constructor(
        scene,
        terrain,
        waterSystem,
        hydrology,
        rainSystem
    ) {

        this.scene = scene;

        this.terrain = terrain;

        this.waterSystem = waterSystem;

        this.hydrology = hydrology;

        this.rainSystem = rainSystem;


        this.clouds = [];

        this.renderer = new CloudRenderer(scene);

        this.maxClouds = 100;

        this.rainingCloud = null;

    }


    generate(count = 35) {

        this.clouds = [];

        this.renderer.clear();


        for (let i = 0; i < count; i++) {

            const terrainPosition =
                this.terrain.sample();

            if (!terrainPosition) continue;


            const speciesName =
                Math.random() < 0.8
                    ? "cumulus"
                    : "towering";


            const config =
                CloudSpecies[speciesName];


            const scale =
                config.scale *
                (0.65 + Math.random() * 0.8);


            const position =
                terrainPosition.add(

                    new BABYLON.Vector3(
                        0,
                        90 + Math.random() * 65,
                        0
                    )

                );


            const cloud = new Cloud(
                position,
                speciesName,
                scale,
                config
            );


            this.clouds.push(cloud);


            const generator =
                new CloudGenerator(config);


            const matrices = generator.generate(

                cloud.position,

                scale,

                config.recursionDepth

            );


            this.renderer.addMatrices(matrices);

        }


        this.renderer.update();

    }


    update(deltaYears) {

        let activeRainCloud = null;


        for (const cloud of this.clouds) {

            this.updateCloud(
                cloud,
                deltaYears
            );


            if (
                cloud.isRaining &&
                !activeRainCloud
            ) {

                activeRainCloud = cloud;

            }

        }


        this.rainingCloud = activeRainCloud;


        if (activeRainCloud) {

            const rainPosition =
                activeRainCloud.position.clone();

            rainPosition.y -= 10;

            this.rainSystem.start(
                rainPosition,
                activeRainCloud.rainIntensity
            );

        } else {

            this.rainSystem.stop();

        }

    }


    updateCloud(cloud, deltaYears) {

        // Slowly move clouds through the atmosphere.

        cloud.position.addInPlace(
            cloud.velocity.scale(
                deltaYears * 0.5
            )
        );


        // Calculate local atmospheric moisture availability.

        const evaporationPotential =
            this.waterSystem.getEvaporationPotential(
                cloud.position
            );


        // Accumulate moisture.

        if (!cloud.isRaining) {

            cloud.waterContent +=

                cloud.absorptionRate *

                evaporationPotential *

                deltaYears;

        }


        cloud.waterContent =
            Math.min(
                cloud.waterContent,
                cloud.maxWaterCapacity
            );


        // Determine whether precipitation should begin.

        if (
            cloud.waterContent >=
            cloud.maxWaterCapacity
        ) {

            this.startRain(cloud);

        }


        // Advance rainfall duration.

        if (cloud.isRaining) {

            cloud.rainRemaining -= deltaYears;


            if (cloud.rainRemaining <= 0) {

                cloud.isRaining = false;

                cloud.rainIntensity = 0;

            }

        }

    }


    startRain(cloud) {

        cloud.isRaining = true;

        cloud.rainRemaining =
            cloud.rainDuration;


        cloud.rainIntensity =
            0.5 + cloud.moistureRatio * 1.5;


        // Release part of the accumulated water.

        const releasedWater =
            cloud.maxWaterCapacity * 0.45;


        cloud.waterContent -= releasedWater;


        // Deposit rainfall into the soil-moisture grid.

        const rainfallAmount =
            0.25 * cloud.rainIntensity;


        const rainfallRadius =
            cloud.scale * 4;


        this.hydrology.addRain(

            cloud.position,

            rainfallRadius,

            rainfallAmount

        );

    }


    updateRendering() {

        // Cloud positions and geometry are currently
        // static from the renderer's perspective.
        //
        // Dynamic cloud movement and shape updates
        // can be introduced in a later rendering pass.

    }


    dispose() {

        this.rainSystem.stop();

        this.renderer.mesh.dispose();

    }

}


export { CloudSystem };

