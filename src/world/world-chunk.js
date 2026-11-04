class WorldChunk {

    constructor(x, z, size) {

        this.x = x;
        this.z = z;

        this.size = size;

        this.trees = [];

        this.rocks = [];

        this.clouds = [];

        this.loaded = false;

        this.dirty = true;

        this.lastSimulationTime = 0;

        this.lod = 0;

    }

}
