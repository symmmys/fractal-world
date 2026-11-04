import createScene from "./scene/create-scene.js";

async function main() {

    console.log("[Main] Initializing application...");

    const canvas = document.getElementById("renderCanvas");

    if (!canvas) {
        throw new Error("Render canvas not found.");
    }

    // Initialize Babylon.js engine.
    const engine = new BABYLON.Engine(
        canvas,
        true,
        {
            useLargeWorldRendering: true
        }
    );

    console.log("[Main] Engine initialized.");

    // Create the scene.
    const scene = await createScene(engine, canvas);

    console.log("[Main] Scene initialized.");

    // Start rendering.
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Handle browser resizing.
    window.addEventListener("resize", () => {
        engine.resize();
    });

}


// Start application.
main().catch(error => {

    console.error("[Main] Application initialization failed:", error);

});

