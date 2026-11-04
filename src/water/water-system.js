
class WaterSystem {

    constructor(scene, terrain, seaLevel = -100) {

        this.scene = scene;
        this.terrain = terrain;

        this.seaLevel = seaLevel;

        this.evaporationRate = 0.12;

        this.createOcean();

    }


    createOcean() {

        const width =
            this.terrain.max.x - this.terrain.min.x;

        const depth =
            this.terrain.max.z - this.terrain.min.z;

        const centerX =
            (this.terrain.min.x + this.terrain.max.x) / 2;

        const centerZ =
            (this.terrain.min.z + this.terrain.max.z) / 2;


        this.ocean = BABYLON.MeshBuilder.CreateGround(
            "ocean",
            {
                width: width,
                height: depth,
                subdivisions: 1
            },
            this.scene
        );

        this.ocean.position.set(
            centerX,
            this.seaLevel,
            centerZ
        );

        this.ocean.isPickable = false;

        this.ocean.receiveShadows = false;


        const material = new BABYLON.StandardMaterial(
            "oceanMaterial",
            this.scene
        );

        material.diffuseColor =
            new BABYLON.Color3(0.025, 0.19, 0.30);

        material.specularColor =
            new BABYLON.Color3(0.35, 0.45, 0.55);

        material.specularPower = 64;

        material.emissiveColor =
            new BABYLON.Color3(0.005, 0.025, 0.04);

        material.backFaceCulling = false;

        this.ocean.material = material;

        this.material = material;

    }


	isUnderwater(position) {
	
		if (!position) {
			return false;
		}

		return position.y < this.seaLevel;

	}


    getTerrainWaterDepth(position) {

	if (!position) {
		return 0;
	}
        return Math.max(
            0,
            this.seaLevel - position.y
        );

    }


    getEvaporationPotential(position) {

        // The ocean provides a persistent moisture source.
        // Land contributes a smaller baseline humidity.

        const terrainPosition =
            this.terrain.sampleAt(
                position.x,
                position.z
            );

        if (!terrainPosition) return 0.2;

        const distanceToSeaLevel = Math.abs(
            terrainPosition.y - this.seaLevel
        );

        const coastalInfluence =
            1 - BABYLON.Scalar.Clamp(
                distanceToSeaLevel / 300,
                0,
                1
            );

        const oceanInfluence =
            terrainPosition.y < this.seaLevel
                ? 1
                : coastalInfluence;

        return BABYLON.Scalar.Clamp(
            0.2 + oceanInfluence * 0.8,
            0.2,
            1
        );

    }


    update(deltaYears) {

        // Reserved for future ocean simulation:
        // animated tides, water temperature,
        // surface currents and water levels.

    }


    dispose() {

        if (this.ocean) {
            this.ocean.dispose();
        }

        if (this.material) {
            this.material.dispose();
        }

    }

}

export { WaterSystem };

