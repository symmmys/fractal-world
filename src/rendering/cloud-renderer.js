import { ThinInstanceRenderer } from "./thin-instance-renderer.js";
class CloudRenderer extends ThinInstanceRenderer {

    constructor(scene) {

        const mesh = BABYLON.MeshBuilder.CreateSphere(
            "cloudPrototype",
            {
                diameter: 1,
                segments: 6
            },
            scene
        );

        const material = new BABYLON.StandardMaterial(
            "cloudMaterial",
            scene
        );

        material.diffuseColor =
            new BABYLON.Color3(0.92, 0.94, 1.0);

        material.emissiveColor =
            new BABYLON.Color3(0.12, 0.12, 0.14);

        material.specularColor =
            BABYLON.Color3.Black();

        mesh.material = material;

        super(
            scene,
            "clouds",
            mesh,
            null
        );

    }

}
export { CloudRenderer }
