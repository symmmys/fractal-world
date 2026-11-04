
class Cloud {

    constructor(position, speciesName, scale, config) {

        this.position = position.clone();

        this.speciesName = speciesName;

        this.scale = scale;

        this.config = config;


        this.waterContent = 0;

        this.maxWaterCapacity =
            speciesName === "towering"
                ? 150
                : 100;


        this.absorptionRate =
            speciesName === "towering"
                ? 24
                : 16;


        this.rainIntensity = 0;

        this.rainRemaining = 0;

        this.rainDuration = 1.5;


        // Small atmospheric drift.

        this.velocity = new BABYLON.Vector3(

            (Math.random() - 0.5) * 2,

            0,

            (Math.random() - 0.5) * 2

        );


        this.isRaining = false;

    }


    get moistureRatio() {

        return BABYLON.Scalar.Clamp(

            this.waterContent /
                this.maxWaterCapacity,

            0,

            1

        );

    }


}

export { Cloud };

