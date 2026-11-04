import { CreateSeededRandom } from "../core/random.js";
class RecursiveObjectGenerator {

    constructor(config) {

        this.config = config;

        this.matrices = [];

    }


    generate(position, scale, depth) {

        this.matrices = [];

        this.generateRecursive(
            position,
            scale,
            depth,
            0
        );

        return this.matrices;

    }


    generateRecursive(
        position,
        scale,
        maxDepth,
        currentDepth
    ) {

        throw new Error(
            "generateRecursive must be implemented"
        );

    }


    addSphere(position, scale, rotation) {

        const matrix = BABYLON.Matrix.Compose(

            scale,

            rotation,

            position

        );

        this.matrices.push(matrix);

    }

}

class RockGenerator extends RecursiveObjectGenerator {

    constructor(config, seed = 1) {

        super(config);

        this.random = CreateSeededRandom(seed);

    }


    generateRecursive(
        position,
        scale,
        maxDepth,
        currentDepth
    ) {

        const c = this.config;
        const random = this.random;

        const irregularity = c.irregularity;

const depositScale =
    c.verticalScale < 0.4;

const sx = scale * (
    0.75 + random() * irregularity
);

const sy = scale *
    (0.65 + random() * irregularity) *
    (c.verticalScale || 1.0);

const sz = scale * (
    0.75 + random() * irregularity
);
        const rotation =
            BABYLON.Quaternion.RotationYawPitchRoll(
                random() * Math.PI * 2,
                random() * Math.PI,
                random() * Math.PI * 2
            );

        this.addSphere(
            position,
            new BABYLON.Vector3(sx, sy, sz),
            rotation
        );

        if (currentDepth >= maxDepth) {
            return;
        }

        const count = Math.max(
            1,
            Math.round(
                c.branchCount *
                (1 - currentDepth * 0.12)
            )
        );

        for (let i = 0; i < count; i++) {

            const phi = random() * Math.PI * 2;

            const vertical = random() * 2 - 1;

            const radial = Math.sqrt(
                Math.max(
                    0,
                    1 - vertical * vertical
                )
            );

            const direction = new BABYLON.Vector3(
                Math.cos(phi) * radial,
                vertical,
                Math.sin(phi) * radial
            );

            const displacement =
                c.displacement *
                (0.7 + random() * 0.6);

            const childPosition =
                position.add(
                    direction.scale(
                        scale * displacement
                    )
                );

            const childScale =
                scale *
                c.scaleDecay *
                (0.8 + random() * 0.4);

            this.generateRecursive(
                childPosition,
                childScale,
                maxDepth,
                currentDepth + 1
            );

        }

    }

}
export { RockGenerator, RecursiveObjectGenerator }
