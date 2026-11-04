
class Hydrology {

    constructor(terrain, waterSystem, cellSize = 20) {

        this.terrain = terrain;
        this.waterSystem = waterSystem;

        this.cellSize = cellSize;

        this.cells = new Map();

        this.defaultMoisture = 0.35;

        this.evaporationRate = 0.015;

        this.rainfallRetention = 1.0;

    }


    getCellCoordinates(x, z) {

        return {

            x: Math.floor(x / this.cellSize),

            z: Math.floor(z / this.cellSize)

        };

    }


    getCellKey(x, z) {

        return `${x},${z}`;

    }


    getCell(x, z) {

        const coordinates =
            this.getCellCoordinates(x, z);

        const key = this.getCellKey(
            coordinates.x,
            coordinates.z
        );

        if (!this.cells.has(key)) {

            this.cells.set(key, {

                moisture: this.defaultMoisture,

                rainfall: 0,

                evaporation: 0

            });

        }

        return this.cells.get(key);

    }


    sampleMoisture(position) {

        if (
            this.waterSystem.isUnderwater(position)
        ) {
            return 1.0;
        }

        const cell = this.getCell(
            position.x,
            position.z
        );

        return cell.moisture;

    }


    addRain(position, radius, amount) {

        const minX = Math.floor(
            (position.x - radius) / this.cellSize
        );

        const maxX = Math.floor(
            (position.x + radius) / this.cellSize
        );

        const minZ = Math.floor(
            (position.z - radius) / this.cellSize
        );

        const maxZ = Math.floor(
            (position.z + radius) / this.cellSize
        );


        for (let x = minX; x <= maxX; x++) {

            for (let z = minZ; z <= maxZ; z++) {

                const worldX =
                    (x + 0.5) * this.cellSize;

                const worldZ =
                    (z + 0.5) * this.cellSize;

                const dx = worldX - position.x;
                const dz = worldZ - position.z;

                const distance = Math.sqrt(
                    dx * dx + dz * dz
                );

                if (distance > radius) continue;


                const terrainPosition =
                    this.terrain.sampleAt(
                        worldX,
                        worldZ
                    );

                if (!terrainPosition) continue;


                // Rain falling into the ocean
                // does not increase soil moisture.

                if (
                    this.waterSystem.isUnderwater(
                        terrainPosition
                    )
                ) {
                    continue;
                }


                const falloff =
                    1 - distance / radius;

                const cell = this.getCell(
                    worldX,
                    worldZ
                );

                const depositedWater =
                    amount *
                    falloff *
                    this.rainfallRetention;

                cell.moisture =
                    BABYLON.Scalar.Clamp(
                        cell.moisture + depositedWater,
                        0,
                        1
                    );

                cell.rainfall += depositedWater;

            }

        }

    }


    update(deltaYears) {

        const evaporation =
            this.evaporationRate * deltaYears;


        for (const cell of this.cells.values()) {

            cell.moisture = Math.max(
                0,
                cell.moisture - evaporation
            );

            cell.evaporation += evaporation;

            cell.rainfall = Math.max(
                0,
                cell.rainfall - deltaYears * 0.1
            );

        }

    }


    getStatistics() {

        let totalMoisture = 0;

        let count = 0;

        for (const cell of this.cells.values()) {

            totalMoisture += cell.moisture;

            count++;

        }

        return {

            cells: count,

            averageMoisture:
                count > 0
                    ? totalMoisture / count
                    : this.defaultMoisture

        };

    }

}

export { Hydrology };

