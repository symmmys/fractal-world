import { Forest } from "../ecology/forest.js"

function createScene( engine, canvas){


	console.log("[createScene] initialize scene...");
	var scene = new BABYLON.Scene(engine);

	const seaLevel = -100;

const instrumentationOn = false;
const instrumentation = new BABYLON.SceneInstrumentation(scene);

instrumentation.captureFrameTime = true;
instrumentation.captureRenderTime = true;
instrumentation.captureActiveMeshesEvaluationTime = true;
instrumentation.captureDrawCalls = true;


    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 200, -10), scene);
    scene.activeCamera = camera;
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));
    camera.attachControl(canvas, true);


	const sun = new BABYLON.DirectionalLight(
		"sun",
		new BABYLON.Vector3(-0.5, -1, -0.3),
		scene
	);

	
// Shadow configuration
sun.position = new BABYLON.Vector3(100, 200, 100);

sun.intensity = 1.0;

const shadowGenerator = new BABYLON.ShadowGenerator(
    1024,
    sun
);

shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.blurScale = 2;
shadowGenerator.blurKernel = 16;

shadowGenerator.bias = 0.0005;
shadowGenerator.normalBias = 0.02;


	const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
        "ground",
        "../../assets/0_somnium_map_topographic.png",
        {
            width: 1500,
            height: 1500,
            subdivisions: 100,
            minHeight: -2000,
            maxHeight: 1000,
		onReady: () => {

            console.log("Terrain successfully generated!");

const forest = new Forest(
    scene,
    ground,
    sun.direction,
    shadowGenerator,
    seaLevel
);
            // Generate 80 trees
            forest.generate(80, 3);
		// Advance the forest by one simulated year
			let elapsed = 0;
			

			const liveGeneration = true;
scene.onBeforeRenderObservable.add(() => {

    elapsed += engine.getDeltaTime() / 1000;

    // One simulated year every five real seconds
	if (liveGeneration){
    if (elapsed >= 5) {

        elapsed = 0;

	var numLivingTrees = forest.trees.filter(t => t.alive).length;
	const livingTreeAdvancementThreshold = 1000;
	if (numLivingTrees < livingTreeAdvancementThreshold) {
		forest.advance(1);
	}

        console.log(
            "Living trees:",
		numLivingTrees
        );
    }
	}

	if (instrumentationOn) {
		if (Math.random() < 0.02) {

		    console.table({

			FPS: engine.getFps().toFixed(1),

			frameTime:
			    instrumentation.frameTimeCounter.current.toFixed(2),

			renderTime:
			    instrumentation.renderTimeCounter.current.toFixed(2),

			activeMeshesTime:
			    instrumentation.activeMeshesEvaluationTimeCounter.current.toFixed(2),

			drawCalls:
			    instrumentation.drawCallsCounter.current

		    });

		}
	}



});

        }
        },
        scene,

        // IMPORTANT: wait until terrain geometry is ready
    );

ground.receiveShadows = true;

	// Directional sunlight



	return scene;
}
export default createScene;
