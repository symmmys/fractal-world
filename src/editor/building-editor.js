
import { EditorCamera } from "./editor-camera.js";
import { BuildingPlacement } from "./building-placement.js";
import { FloorPlanReference } from "./floor-plan-reference.js";

class BuildingEditor {
    constructor(scene, buildingSystem, spatialTransform) {
        this.scene = scene;
        this.system = buildingSystem;
        this.transform = spatialTransform;

        // Building geometry must use the authoritative
        // world-to-render coordinate transformation.
        this.system.renderer.transform = spatialTransform;

        this.editorCamera = new EditorCamera(
            scene,
            spatialTransform
        );

        this.placement = new BuildingPlacement(
            buildingSystem,
            this.editorCamera
        );

        this.floorPlan = new FloorPlanReference(
            scene,
            spatialTransform
        );

        this.mode = "room";
        this.gridSize = 1;
        this.activeBuilding = null;
        this.selectedRoom = null;
        this.startPoint = null;
        this.enabled = false;

        this.createInterface();

        this.pointerObserver =
            scene.onPointerObservable.add(info => {
                if (!this.enabled) return;

                if (
                    info.type === BABYLON.PointerEventTypes.POINTERDOWN
                ) {
                    this.pointerDown();
                }

                if (
                    info.type === BABYLON.PointerEventTypes.POINTERUP
                ) {
                    this.pointerUp();
                }
            });
    }

	setGameManager(manager) {
    this.gameManager = manager;

    manager.registerEditor(this.editorCamera.camera);

    this.unsubscribeMode = manager.onModeChanged(mode => {
        const active = mode === "editor";

        this.enabled = active;
        this.container.style.display =
            active ? "block" : "none";

        if (active && this.activeBuilding) {
            this.editorCamera.focus(
                this.activeBuilding.position
            );
        }
    });
}

    createInterface() {
        this.container = document.createElement("div");

        Object.assign(this.container.style, {
            position: "fixed",
            top: "70px",
            left: "18px",
            width: "280px",
            maxHeight: "85vh",
            overflowY: "auto",
            padding: "16px",
            background: "rgba(19,29,40,0.97)",
            border: "1px solid #536779",
            borderRadius: "8px",
            color: "#fff",
            fontFamily: "Arial,sans-serif",
            zIndex: "1600",
            display: "none"
        });

        this.container.innerHTML = `
            <h3>BUILDING EDITOR</h3>

            <div style="display:grid;gap:7px">
                <button data-mode="room">DRAW ROOM</button>
                <button data-mode="door">ADD DOOR</button>
                <button data-mode="window">ADD WINDOW</button>
                <button data-mode="furniture">PLACE FURNITURE</button>
            </div>

            <hr>

            <h4>FLOOR PLAN</h4>
            <input type="file" id="floor-image" accept="image/*">

            <label>Width
                <input id="floor-width" type="number" min="0.1" value="20">
            </label>

            <label>Depth
                <input id="floor-depth" type="number" min="0.1" value="20">
            </label>

            <label>Opacity
                <input id="floor-opacity" type="range"
                    min="0" max="1" step="0.05" value="0.8">
            </label>

            <label>
                <input id="floor-visible" type="checkbox" checked>
                Show floor plan
            </label>

            <hr>

            <h4>BUILDING POSITION</h4>

            <label>X
                <input id="position-x" type="number" step="0.1" value="0">
            </label>

            <label>Z
                <input id="position-z" type="number" step="0.1" value="0">
            </label>

            <label>Elevation
                <input id="position-y" type="number" step="0.1" value="0">
            </label>

            <label>Rotation (degrees)
                <input id="position-rotation" type="number"
                    step="1" value="0">
            </label>

            <hr>

            <label>Grid size
                <input id="building-grid" type="number"
                    min="0.1" step="0.1" value="1">
            </label>

            <p id="building-status" style="font-size:12px;color:#b8c8d7">
                Select a construction tool.
            </p>

            <button id="building-close" style="width:100%">
                CLOSE EDITOR
            </button>
        `;

        document.body.appendChild(this.container);

        this.status = this.container.querySelector(
            "#building-status"
        );

        this.container.querySelectorAll("[data-mode]")
            .forEach(button => {
                button.onclick = () => this.setMode(
                    button.dataset.mode
                );
            });

        const element = id =>
            this.container.querySelector(`#${id}`);

        element("building-grid").onchange = event => {
            this.gridSize = Math.max(
                0.1,
                Number(event.target.value) || 1
            );
        };

        element("floor-image").onchange = async event => {
            try {
                await this.floorPlan.load(
                    event.target.files[0]
                );

                this.updateFloorPlanPosition();
                this.setStatus("Floor plan imported.");
            } catch (error) {
                this.setStatus(error.message);
            }
        };

        element("floor-opacity").oninput = event =>
            this.floorPlan.setOpacity(Number(event.target.value));

        element("floor-visible").onchange = event =>
            this.floorPlan.setVisible(event.target.checked);

        for (const id of ["floor-width", "floor-depth"]) {
            element(id).onchange = () => {
                this.updateFloorPlanPosition({
                    width: Number(element("floor-width").value),
                    depth: Number(element("floor-depth").value)
                });
            };
        }

        const updatePlacement = () => {
            if (!this.activeBuilding) return;

            this.placement.update({
                x: Number(element("position-x").value),
                z: Number(element("position-z").value),
                y: Number(element("position-y").value),
                rotation:
                    Number(element("position-rotation").value) *
                    Math.PI / 180
            });

            this.updateFloorPlanPosition();
        };

        for (const id of [
            "position-x",
            "position-z",
            "position-y",
            "position-rotation"
        ]) {
            element(id).onchange = updatePlacement;
        }

        element("building-close").onclick = () => this.close();

        this.launcher = document.createElement("button");
        this.launcher.textContent = "BUILD";

        Object.assign(this.launcher.style, {
            position: "fixed",
            top: "18px",
            left: "18px",
            zIndex: "1601",
            padding: "12px 20px",
            cursor: "pointer"
        });

        this.launcher.onclick = () => this.open();
        document.body.appendChild(this.launcher);
    }

    setStatus(message) {
        this.status.textContent = message;
    }

    setMode(mode) {
        this.mode = mode;
        this.startPoint = null;
        this.setStatus(`Active tool: ${mode}`);
    }

    open() {
        this.container.style.display = "block";
        this.enabled = true;
        this.gameManager?.startEditor();

        if (this.activeBuilding) {
            this.editorCamera.focus(this.activeBuilding.position);
        }
    }

    close() {
        this.container.style.display = "none";
        this.enabled = false;
        this.startPoint = null;
        this.gameManager?.exitEditor();
    }

    snap(value) {
        return Math.round(value / this.gridSize) *
            this.gridSize;
    }

    pickWorldPosition() {
        const pick = this.scene.pick(
            this.scene.pointerX,
            this.scene.pointerY,
            mesh => mesh.isPickable &&
                mesh.metadata?.terrainChunk === true
        );

        if (!pick?.hit || !pick.pickedPoint) return null;

        return this.transform.renderToWorld({
            x: pick.pickedPoint.x,
            y: pick.pickedPoint.y,
            z: pick.pickedPoint.z
        });
    }

    pointerDown() {
        const point = this.pickWorldPosition();

        if (this.mode !== "room") return;

        if (!point) {
            this.setStatus("Cannot pick terrain.");
            return;
        }

        this.startPoint = point;
        this.setStatus("Drag to define the room footprint.");
    }

    pointerUp() {
        const point = this.pickWorldPosition();

        if (!point) {
            if (this.startPoint) {
                this.startPoint = null;
                this.setStatus("No surface detected.");
            }
            return;
        }

        if (this.mode === "room") {
            if (!this.startPoint) return;

            const start = this.startPoint;
            this.startPoint = null;

            try {
                this.createRoomFromPoints(start, point);
            } catch (error) {
                console.error("[BuildingEditor]", error);
                this.setStatus(error.message);
            }

            return;
        }

        if (this.mode === "door" || this.mode === "window") {
            this.placeOpening(this.mode, point);
        }

        if (this.mode === "furniture") {
            this.placeFurniture(point);
        }
    }

    createRoomFromPoints(a, b) {
        const minX = this.snap(Math.min(a.x, b.x));
        const maxX = this.snap(Math.max(a.x, b.x));
        const minZ = this.snap(Math.min(a.z, b.z));
        const maxZ = this.snap(Math.max(a.z, b.z));

        if (
            maxX - minX < this.gridSize ||
            maxZ - minZ < this.gridSize
        ) {
            this.setStatus("Room is too small.");
            return;
        }

        if (!this.activeBuilding) {
            this.activeBuilding = this.system.createBuilding({
                name: "My Building",
                position: {
                    x: minX,
                    y: a.y,
                    z: minZ
                }
            });

            this.placement.select(this.activeBuilding);
            this.syncPositionInputs();
        }

        const building = this.activeBuilding;

        const room = this.system.createRoom(
            building.id,
            {
                name: `Room ${building.rooms.length + 1}`,
                minX: minX - building.position.x,
                maxX: maxX - building.position.x,
                minZ: minZ - building.position.z,
                maxZ: maxZ - building.position.z
            }
        );

        this.selectedRoom = room;

        this.updateFloorPlanPosition();

        this.setStatus(
            `Created ${room.name}: ` +
            `${maxX - minX} × ${maxZ - minZ}`
        );
    }

    placeOpening(type, point) {
        if (!this.activeBuilding || !this.selectedRoom) {
            this.setStatus("Create a room first.");
            return;
        }

        const building = this.activeBuilding;
        const bounds = this.selectedRoom.bounds;

        const x = point.x - building.position.x;
        const z = point.z - building.position.z;

        const distances = [
            { side: "north", distance: Math.abs(z - bounds.minZ),
                offset: (x - bounds.minX) /
                    (bounds.maxX - bounds.minX) },
            { side: "south", distance: Math.abs(z - bounds.maxZ),
                offset: (x - bounds.minX) /
                    (bounds.maxX - bounds.minX) },
            { side: "west", distance: Math.abs(x - bounds.minX),
                offset: (z - bounds.minZ) /
                    (bounds.maxZ - bounds.minZ) },
            { side: "east", distance: Math.abs(x - bounds.maxX),
                offset: (z - bounds.minZ) /
                    (bounds.maxZ - bounds.minZ) }
        ];

        distances.sort((a, b) => a.distance - b.distance);

        const nearest = distances[0];

        if (nearest.offset < 0 || nearest.offset > 1) {
            this.setStatus("Position is outside the selected wall.");
            return;
        }

        const opening = this.system.addOpening(
            building.id,
            this.selectedRoom.id,
            {
                type,
                side: nearest.side,
                offset: nearest.offset,
                width: type === "door" ? 0.9 : 1.4,
                height: type === "door" ? 2.1 : 1.2,
                sill: type === "door" ? 0 : 0.9
            }
        );

        this.setStatus(`Added ${type}: ${opening.id}`);
    }

    placeFurniture(position) {
        if (!this.activeBuilding) {
            this.setStatus("Create a building first.");
            return;
        }

        this.system.addFurniture(
            this.activeBuilding.id,
            {
                type: "table",
                position: {
                    x: position.x - this.activeBuilding.position.x,
                    y: position.y - this.activeBuilding.position.y + 0.5,
                    z: position.z - this.activeBuilding.position.z
                },
                dimensions: { x: 1.6, y: 0.9, z: 1 },
                material: "wood"
            }
        );

        this.setStatus("Furniture placed.");
    }

    syncPositionInputs() {
        if (!this.activeBuilding) return;

        const p = this.activeBuilding.position;
        const set = (id, value) => {
            this.container.querySelector(`#${id}`).value = value;
        };

        set("position-x", p.x);
        set("position-y", p.y);
        set("position-z", p.z);
        set(
            "position-rotation",
            this.activeBuilding.rotation * 180 / Math.PI
        );
    }


updateFloorPlanPosition(dimensions = {}) {
    if (!this.activeBuilding) return;

    this.floorPlan.updateTransform(
        this.activeBuilding.position,
        dimensions,
        this.activeBuilding.rotation
    );
}

    dispose() {
        this.enabled = false;

        if (this.pointerObserver) {
            this.scene.onPointerObservable.remove(
                this.pointerObserver
            );
        }

        this.floorPlan.dispose();
        this.editorCamera.dispose();

        this.container?.remove();
        this.launcher?.remove();

        this.container = null;
        this.launcher = null;

	this.unsubscribeMode?.();
    }

worldToBuildingLocal(position) {
    const building = this.activeBuilding;
    const dx = position.x - building.position.x;
    const dz = position.z - building.position.z;

    const angle = building.rotation;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: dx * cos + dz * sin,
        y: position.y - building.position.y,
        z: -dx * sin + dz * cos
    };
}

}

export { BuildingEditor };

