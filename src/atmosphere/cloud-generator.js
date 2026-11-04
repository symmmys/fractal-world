import { RecursiveObjectGenerator } from "../geology/rock-generator.js";
class CloudGenerator extends RecursiveObjectGenerator {

    constructor(config) {

        super(config);

    }


    generateRecursive(
        position,
        scale,
        maxDepth,
        currentDepth
    ) {

        const c = this.config;

        // Slightly irregular cloud lobes.
        const sx = scale * (
            0.8 + Math.random() * c.irregularity
        );

        const sy = scale * (
            0.65 + Math.random() * c.irregularity
        );

        const sz = scale * (
            0.8 + Math.random() * c.irregularity
        );


        this.addSphere(

            position,

            new BABYLON.Vector3(sx, sy, sz),

            BABYLON.Quaternion.Identity()

        );


        if (currentDepth >= maxDepth) {

            return;

        }


        for (
            let i = 0;
            i < c.branchCount;
            i++
        ) {

            const angle =
                Math.random() * Math.PI * 2;


            const horizontal =
                scale *
                c.horizontalSpread;


            const vertical =
                scale *
                c.verticalSpread;


            const offset = new BABYLON.Vector3(

                Math.cos(angle) *
                    horizontal *
                    (0.5 + Math.random()),

                (Math.random() * 2 - 1) * vertical,

                Math.sin(angle) *
                    horizontal *
                    (0.5 + Math.random())

            );


            const childPosition =
                position.add(offset);


            const childScale =
                scale *
                c.scaleDecay *
                (0.8 + Math.random() * 0.4);


            this.generateRecursive(

                childPosition,

                childScale,

                maxDepth,

                currentDepth + 1

            );

        }

    }

}
export { CloudGenerator }
