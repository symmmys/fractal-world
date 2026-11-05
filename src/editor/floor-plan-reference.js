
class FloorPlanReference {
    constructor(scene, spatialTransform) {
        this.scene = scene;
        this.transform = spatialTransform;

        this.mesh = null;
        this.material = null;
        this.texture = null;
        this.objectURL = null;

        this.width = 20;
        this.depth = 20;
        this.opacity = 0.8;
        this.visible = true;
    }

    async load(file) {
        if (!file || !file.type.startsWith("image/")) {
            throw new Error("Please select an image file.");
        }

        this.remove();

        this.objectURL = URL.createObjectURL(file);

        const texture = new BABYLON.Texture(
            this.objectURL,
            this.scene,
            true,
            false,
            BABYLON.Texture.TRILINEAR_SAMPLINGMODE
        );

        this.texture = texture;

        await new Promise((resolve, reject) => {
            texture.onLoadObservable.addOnce(resolve);
            texture.onError = message => reject(
                new Error(message || "Image loading failed.")
            );
        });

        this.material = new BABYLON.StandardMaterial(
            "building-floor-plan-material",
            this.scene
        );

        this.material.diffuseTexture = texture;
        this.material.emissiveTexture = texture;
        this.material.disableLighting = true;
        this.material.backFaceCulling = false;
        this.material.alpha = this.opacity;

        this.mesh = BABYLON.MeshBuilder.CreatePlane(
            "building-floor-plan",
            { size: 1 },
            this.scene
        );

        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.material = this.material;
        this.mesh.isPickable = false;

        this.setVisible(this.visible);
        this.updateTransform({ x: 0, y: 0, z: 0 });

        return texture;
    }

	updateTransform(position, dimensions = {}, rotation = 0) {
        if (!this.mesh) return;

        this.width = dimensions.width ?? this.width;
        this.depth = dimensions.depth ?? this.depth;

		this.mesh.rotation.y = rotation;

        const rendered = this.transform.worldToRender(
            position
        );

        const xAxis = this.transform.transformDirection(
            position,
            { x: 1, y: 0, z: 0 }
        );

        const zAxis = this.transform.transformDirection(
            position,
            { x: 0, y: 0, z: 1 }
        );

        this.mesh.position.set(
            rendered.x,
            rendered.y + 0.05,
            rendered.z
        );

        this.mesh.scaling.set(
            this.width * Math.hypot(xAxis.x, xAxis.y, xAxis.z),
            this.depth * Math.hypot(zAxis.x, zAxis.y, zAxis.z),
            1
        );
    }

    setOpacity(value) {
        this.opacity = Math.max(0, Math.min(1, value));

        if (this.material) {
            this.material.alpha = this.opacity;
        }
    }

    setVisible(value) {
        this.visible = Boolean(value);

        if (this.mesh) {
            this.mesh.setEnabled(this.visible);
        }
    }

    remove() {
        this.mesh?.dispose();
        this.material?.dispose();
        this.texture?.dispose();

        this.mesh = null;
        this.material = null;
        this.texture = null;

        if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL);
            this.objectURL = null;
        }
    }

    dispose() {
        this.remove();
    }
}

export { FloorPlanReference };

