class WorldManager {

    constructor(scene, chunkSize = 50) {

        this.scene = scene;

        this.chunkSize = chunkSize;

        this.chunks = new Map();

        this.activeRadius = 3;

        this.renderRadius = 5;

    }

    getChunkKey(x, z) {

        return `${x},${z}`;

    }

    getChunkCoordinates(position) {

        return {

            x: Math.floor(
                position.x / this.chunkSize
            ),

            z: Math.floor(
                position.z / this.chunkSize
            )

        };

    }

    update(cameraPosition) {

        const center =
            this.getChunkCoordinates(cameraPosition);

        // Determine nearby chunks.

        // Load missing chunks.

        // Update active chunks.

        // Apply LOD.

        // Unload distant rendering data.

    }

}
