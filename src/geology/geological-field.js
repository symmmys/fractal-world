import { fractalNoise2D } from "../core/noise.js";

class GeologicalField {

    constructor(terrain, seed = 91827) {

        this.terrain = terrain;

        this.seed = seed;

        this.regionFrequency = 0.0025;

        this.detailFrequency = 0.009;

        this.slopeSamplingDistance = 4;

    }


    sample(x, z) {

        const profile = this.terrain.sampleProfileAt(
            x,
            z,
            this.slopeSamplingDistance
        );

        if (!profile) return null;


        const broad = fractalNoise2D(
            x * this.regionFrequency,
            z * this.regionFrequency,
            this.seed,
            3
        );

        const detail = fractalNoise2D(
            x * this.detailFrequency,
            z * this.detailFrequency,
            this.seed + 10000,
            3
        );

        const geology = fractalNoise2D(
            x * this.regionFrequency * 1.5,
            z * this.regionFrequency * 1.5,
            this.seed + 20000,
            3
        );

        const anomalyField = fractalNoise2D(
            x * 0.0015,
            z * 0.0015,
            this.seed + 30000,
            3
        );


        const moisture = BABYLON.Scalar.Clamp(
            broad * 0.7 + detail * 0.3,
            0,
            1
        );


        const slope = profile.slopeDegrees;

        const elevation = profile.elevation;


        let speciesName;


        // MAGICAL GEOLOGICAL ANOMALIES

        if (anomalyField > 0.94) {

            speciesName = "anomaly";

        }


        // FLAT TERRAIN

        else if (slope < 5) {

            if (moisture > 0.58) {

                speciesName = "fertileSoil";

            } else if (moisture < 0.35) {

                speciesName = "sand";

            } else {

                speciesName =
                    geology > 0.55
                        ? "clay"
                        : "fertileSoil";

            }

        }


        // GENTLE TERRAIN

        else if (slope < 15) {

            if (moisture > 0.68) {

                speciesName = "fertileSoil";

            } else if (moisture < 0.30) {

                speciesName = "sand";

            } else if (geology > 0.65) {

                speciesName = "limestone";

            } else {

                speciesName = "clay";

            }

        }


        // ROLLING TERRAIN

else if (slope < 30) {

    if (slope > 22 && geology > 0.45) {

        speciesName = "granite";

    } else if (geology < 0.35) {

        speciesName = "limestone";

    } else if (geology > 0.76) {

        speciesName = "granite";

    } else {

        speciesName = "clay";

    }

}

        // MOUNTAINOUS TERRAIN


	else {

    if (geology > 0.72) {

        speciesName = "granite";

    } else if (geology < 0.38) {

        speciesName = "limestone";

    } else if (
        elevation > 0.45 &&
        geology > 0.45
    ) {

        speciesName = "coal";

    } else {

        speciesName = "granite";

    }

}

        return {

            speciesName,

            position: profile.position,

            elevation,

            slope,

            slopeDegrees: slope,

            normal: profile.normal,

            moisture,

            geology,

            anomalyField

        };

    }

}
export { GeologicalField }
