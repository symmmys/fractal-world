
import { ThinInstanceRenderer } from "../rendering/thin-instance-renderer.js";

const MATERIALS = {
    wall: [0.72, 0.69, 0.62],
    floor: [0.48, 0.34, 0.22],
    ceiling: [0.83, 0.81, 0.75],
    glass: [0.35, 0.70, 0.86],
    wood: [0.34, 0.20, 0.11],
    furniture: [0.48, 0.31, 0.20]
};

const BUCKETS = [
    "walls", "floors", "ceilings", "glazing",
    "trim", "doors", "furniture", "fixtures"
];

class BuildingRenderer {
    constructor(scene, spatialTransform = null) {
        this.scene = scene;
        this.transform = spatialTransform;
        this.buckets = new Map();
        this.disposed = false;

        for (const kind of BUCKETS) {
            this.createBucket(kind);
        }
    }

    createBucket(kind) {
        const mesh = BABYLON.MeshBuilder.CreateBox(
            `building-prototype-${kind}`,
            { size: 1 },
            this.scene
        );

        const material = new BABYLON.StandardMaterial(
            `building-material-${kind}`,
            this.scene
        );

        const colorName =
            kind === "walls" ? "wall" :
            kind === "floors" ? "floor" :
            kind === "ceilings" ? "ceiling" :
            kind === "glazing" ? "glass" :
            kind === "trim" || kind === "doors" ? "wood" :
            "furniture";

        material.diffuseColor = new BABYLON.Color3(
            ...MATERIALS[colorName]
        );

        if (kind === "glazing") {
            material.alpha = 0.42;
            material.transparencyMode =
                BABYLON.Material.MATERIAL_ALPHABLEND;
            material.backFaceCulling = false;
            material.specularColor =
                new BABYLON.Color3(0.8, 0.9, 1);
        }

        mesh.material = material;

        const renderer = new ThinInstanceRenderer(
            this.scene,
            `building-${kind}`,
            mesh
        );

        this.buckets.set(kind, {
            mesh,
            material,
            renderer
        });
    }

    clear() {
        for (const bucket of this.buckets.values()) {
            bucket.renderer.clear();
        }
    }

    getRenderedPosition(position) {
        if (!this.transform) return { ...position };

        return this.transform.worldToRender(position);
    }

    getScale(position, axis) {
        if (!this.transform) return 1;

        const direction = this.transform.transformDirection(
            position,
            axis
        );

        return Math.hypot(
            direction.x,
            direction.y,
            direction.z
        );
    }

    addComponent(component, building) {
        const bucket = this.buckets.get(component.kind);
        if (!bucket) return;

        const angle = building.rotation ?? 0;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const local = component.position;

        const rotated = {
            x: local.x * cos - local.z * sin,
            y: local.y,
            z: local.x * sin + local.z * cos
        };

        const world = {
            x: building.position.x + rotated.x,
            y: building.position.y + rotated.y,
            z: building.position.z + rotated.z
        };

        const position = this.getRenderedPosition(world);

        const rotation = BABYLON.Quaternion.RotationAxis(
            BABYLON.Axis.Y,
            angle + (component.rotation ?? 0)
        );

        const scale = new BABYLON.Vector3(
            component.dimensions.x * this.getScale(
                world,
                { x: cos, y: 0, z: sin }
            ),
            component.dimensions.y * this.getScale(
                world,
                { x: 0, y: 1, z: 0 }
            ),
            component.dimensions.z * this.getScale(
                world,
                { x: -sin, y: 0, z: cos }
            )
        );

        const matrix = BABYLON.Matrix.Compose(
            scale,
            rotation,
            new BABYLON.Vector3(
                position.x,
                position.y,
                position.z
            )
        );

        bucket.renderer.addMatrix(matrix);
    }

    update(buildings) {
        if (this.disposed) return;

        this.clear();

        for (const building of buildings) {
            for (const component of building.generatedGeometry) {
                this.addComponent(component, building);
            }
        }

        for (const bucket of this.buckets.values()) {
            bucket.renderer.update();
        }
    }

    getStats() {
        const result = {};

        for (const [kind, bucket] of this.buckets) {
            result[kind] = {
                instances: bucket.renderer.matrices.length
            };
        }

        return result;
    }

    dispose() {
        if (this.disposed) return;

        this.disposed = true;

        for (const bucket of this.buckets.values()) {
            bucket.renderer.dispose?.();
            bucket.mesh.dispose();
            bucket.material.dispose();
        }

        this.buckets.clear();
    }
}

export { BuildingRenderer };

