class ThinInstanceRenderer {

    constructor(scene, name, mesh, shadowGenerator) {

        this.scene = scene;
        this.mesh = mesh;

        this.matrices = [];

        this.buffer = null;

        // Keep prototype outside the visible world.
        this.mesh.position.y = -10000;

        this.mesh.computeWorldMatrix(true);

        this.inverseMeshWorld =
            this.mesh.getWorldMatrix().clone();

        this.inverseMeshWorld.invert();

        this.mesh.isPickable = false;

        if (shadowGenerator) {

            shadowGenerator.addShadowCaster(
                this.mesh,
                true
            );

        }

    }


    clear() {

        this.matrices.length = 0;

    }


    addMatrix(matrix) {

        this.matrices.push(matrix);

    }


    addMatrices(matrices) {

        this.matrices.push(...matrices);

    }


    add(position, scale, rotation = BABYLON.Quaternion.Identity()) {

        const matrix = BABYLON.Matrix.Compose(

            new BABYLON.Vector3(
                scale,
                scale,
                scale
            ),

            rotation,

            position

        );

        this.matrices.push(matrix);

    }


    update() {

        const requiredSize =
            this.matrices.length * 16;

        if (
            !this.buffer ||
            this.buffer.length < requiredSize
        ) {

            this.buffer = new Float32Array(
                Math.max(
                    1024,
                    requiredSize,
                    this.buffer
                        ? this.buffer.length * 2
                        : 1024
                )
            );

        }

        for (
            let i = 0;
            i < this.matrices.length;
            i++
        ) {

            const localMatrix =
                this.matrices[i].multiply(
                    this.inverseMeshWorld
                );

            localMatrix.copyToArray(
                this.buffer,
                i * 16
            );

        }

        const activeBuffer =
            this.buffer.subarray(
                0,
                requiredSize
            );

        this.mesh.thinInstanceSetBuffer(
            "matrix",
            activeBuffer,
            16,
            true
        );

        this.mesh.thinInstanceRefreshBoundingInfo(true);

    }

}
export { ThinInstanceRenderer }
