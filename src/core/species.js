
const Species = {

    oak: {

        name: "Oak",

        trunkLength: 5.0,
        trunkRadius: 0.52,

        branchLength: 3.0,
        branchRadius: 0.12,

        branchAngle: Math.PI / 3.5,
        branchCount: 5,

        maxDepth: 3,

        lengthDecay: 0.68,
        radiusDecay: 0.65,

        lightSensitivity: 0.35,

        // Water requirements

        droughtTolerance: 0.12,

        waterloggingTolerance: 0.95,

        optimalMoisture: 0.60,

        branching: "radial",

        canopy: {

            shape: "round",
            width: 1.5,
            height: 0.85,

            startHeight: 0.35,

            density: 1.0,

            layers: 3

        }

    },


    pine: {

        name: "Pine",

        trunkLength: 8.0,
        trunkRadius: 0.18,

        branchLength: 3.0,
        branchRadius: 0.09,

        branchAngle: Math.PI / 3,

        branchCount: 4,

        maxDepth: 2,

        lengthDecay: 0.72,
        radiusDecay: 0.72,

        lightSensitivity: 0.20,

        // Water requirements

        droughtTolerance: 0.08,

        waterloggingTolerance: 0.85,

        optimalMoisture: 0.40,

        branching: "whorled",

        canopy: {

            shape: "conical",
            width: 0.9,
            height: 1.8,

            startHeight: 0.25,

            density: 0.85,

            layers: 6

        }

    }

};

export { Species };

