
let terrain = null;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}


function hashNoise2D(x, z, seed = 1) {
    let n =
        Math.imul(x | 0, 374761393) +
        Math.imul(z | 0, 668265263) +
        Math.imul(seed | 0, 1442695041);

    n = Math.imul(
        n ^ (n >>> 13),
        1274126177
    );

    n ^= n >>> 16;

    return (n >>> 0) / 4294967295;
}

function smoothNoise2D(x, z, seed = 1) {
    const ix = Math.floor(x);
    const iz = Math.floor(z);

    const fx = x - ix;
    const fz = z - iz;

    const u = fx * fx * (3 - 2 * fx);
    const v = fz * fz * (3 - 2 * fz);

    const a = hashNoise2D(ix, iz, seed);
    const b = hashNoise2D(ix + 1, iz, seed);
    const c = hashNoise2D(ix, iz + 1, seed);
    const d = hashNoise2D(ix + 1, iz + 1, seed);

    return lerp(
        lerp(a, b, u),
        lerp(c, d, u),
        v
    );
}

function fractalNoise2D(x, z, seed, octaves = 3) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let totalAmplitude = 0;

    for (let i = 0; i < octaves; i++) {
        value += smoothNoise2D(
            x * frequency,
            z * frequency,
            seed + i * 1013
        ) * amplitude;

        totalAmplitude += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }

    return value / totalAmplitude;
}

function mixColor(a, b, t) {
    return [
        lerp(a[0], b[0], t),
        lerp(a[1], b[1], t),
        lerp(a[2], b[2], t)
    ];
}


function pixelValue(x, z) {
    const t = terrain;

    x = clamp(x, 0, t.width - 1);
    z = clamp(z, 0, t.height - 1);

    const index = (Math.floor(z) * t.width + Math.floor(x)) * 4;
    const p = t.pixels;

    const r = p[index];
    const g = p[index + 1];
    const b = p[index + 2];

    switch (t.heightChannel) {
        case "red": return r / 255;
        case "green": return g / 255;
        case "blue": return b / 255;
        case "luminance":
            return (
                0.2126 * r +
                0.7152 * g +
                0.0722 * b
            ) / 255;
        case "average":
        default:
            return (r + g + b) / 765;
    }
}

function heightAt(x, z) {
    const u = clamp(
        (x - terrain.minX) / terrain.worldSize,
        0, 1
    );

    const v = clamp(
        (z - terrain.minZ) / terrain.worldSize,
        0, 1
    );

    const px = u * (terrain.width - 1);
    const pz = v * (terrain.height - 1);

    const x0 = Math.floor(px);
    const z0 = Math.floor(pz);

    const x1 = Math.min(x0 + 1, terrain.width - 1);
    const z1 = Math.min(z0 + 1, terrain.height - 1);

    const tx = px - x0;
    const tz = pz - z0;

    const a = lerp(
        pixelValue(x0, z0),
        pixelValue(x1, z0),
        tx
    );

    const b = lerp(
        pixelValue(x0, z1),
        pixelValue(x1, z1),
        tx
    );

    return lerp(
        terrain.minHeight,
        terrain.maxHeight,
        lerp(a, b, tz)
    );
}


function terrainColor(height, slope, worldX, worldZ) {
    const t = terrain;

    const elevation = clamp(
        (height - t.minHeight) /
        (t.maxHeight - t.minHeight),
        0,
        1
    );

    const slopeDegrees =
        Math.atan(slope) * 180 / Math.PI;

    const seed = 91827;

    const moisture = fractalNoise2D(
        worldX * 0.0025,
        worldZ * 0.0025,
        seed + 1000,
        3
    ) * 0.7 + fractalNoise2D(
        worldX * 0.009,
        worldZ * 0.009,
        seed + 3000,
        3
    ) * 0.3;

    const geology = fractalNoise2D(
        worldX * 0.00375,
        worldZ * 0.00375,
        seed + 2000,
        3
    );

    const variation = fractalNoise2D(
        worldX * 0.025,
        worldZ * 0.025,
        seed + 5000,
        3
    );

    const exposure = clamp(
        slopeDegrees / 42 * 0.78 +
        elevation * 0.12 +
        (1 - moisture) * 0.10,
        0,
        1
    );

    let soil;

    if (exposure > 0.78) {
        soil = [0.43, 0.41, 0.37];
    } else if (moisture > 0.78) {
        soil = [0.19, 0.13, 0.085];
    } else if (moisture > 0.57) {
        soil = [0.35, 0.25, 0.16];
    } else if (moisture > 0.40) {
        soil = [0.52, 0.40, 0.29];
    } else if (moisture > 0.22) {
        soil = geology > 0.5
            ? [0.48, 0.29, 0.21]
            : [0.27, 0.19, 0.12];
    } else {
        soil = [0.76, 0.66, 0.46];
    }

    let bedrock;

    if (geology < 0.28) {
        bedrock = [0.63, 0.60, 0.51];
    } else if (geology < 0.48) {
        bedrock = [0.65, 0.43, 0.29];
    } else if (geology > 0.84) {
        bedrock = [0.24, 0.23, 0.22];
    } else {
        bedrock = [0.39, 0.37, 0.34];
    }

    if (elevation > 0.70 && geology > 0.65) {
        bedrock = [0.39, 0.37, 0.34];
    }

    // Blend surface material into exposed bedrock.
    let color = mixColor(
        soil,
        bedrock,
        clamp((exposure - 0.25) / 0.65)
    );

    // Small-scale geological surface variation.
    const texture = 0.92 + variation * 0.16;

    color = color.map(value =>
        clamp(value * texture, 0, 1)
    );

    // Snow and frost at the highest elevations.
    if (elevation > 0.92) {
        const snow = [0.82, 0.84, 0.82];

        color = mixColor(
            color,
            snow,
            clamp((elevation - 0.92) / 0.08)
        );
    }

    return color;
}


function terrainColor(height, slope, worldX, worldZ) {
    const elevation = clamp(
        (height - terrain.minHeight) /
        (terrain.maxHeight - terrain.minHeight),
        0,
        1
    );

    // Deterministic regional geological variation.
    const geology = smoothNoise2D(
        worldX * 0.0018,
        worldZ * 0.0018,
        91827
    );

    const detail = fractalNoise2D(
        worldX * 0.012,
        worldZ * 0.012,
        48129,
        3
    );

    const moisture = fractalNoise2D(
        worldX * 0.0025,
        worldZ * 0.0025,
        28193,
        3
    );

    const slopeDegrees = Math.atan(slope) * 180 / Math.PI;

    let color;

    // Underlying geological material.
    if (geology < 0.22) {
        // Limestone
        color = [0.72, 0.68, 0.57];
    } else if (geology < 0.43) {
        // Sandstone
        color = [0.68, 0.45, 0.28];
    } else if (geology > 0.82) {
        // Basalt
        color = [0.36, 0.38, 0.41];
    } else {
        // Granite
        color = [0.52, 0.52, 0.51];
    }

    // Surface soil classification.
    let soil;

    if (moisture < 0.25) {
        // Dry sand.
        soil = [0.83, 0.68, 0.38];
    } else if (moisture < 0.43) {
        // Mineral-rich sandy loam.
        soil = [0.65, 0.48, 0.31];
    } else if (moisture < 0.62) {
        // Fertile brown soil.
        soil = [0.43, 0.29, 0.18];
    } else if (moisture < 0.79) {
        // Grey-blue clay.
        soil = [0.43, 0.49, 0.56];
    } else {
        // Organic soil.
        soil = [0.28, 0.22, 0.16];
    }

    // Exposed rock on steep terrain.
    const exposure = clamp(
        (slopeDegrees - 12) / 30 +
        elevation * 0.25,
        0,
        1
    );

    const rockBlend = smoothstep(
        0.25,
        0.85,
        exposure
    );

    for (let i = 0; i < 3; i++) {
        color[i] = lerp(
            soil[i],
            color[i],
            rockBlend
        );
    }

    // Natural local color variation.
    const texture = 0.94 + detail * 0.12;

    color = color.map(channel =>
        clamp(channel * texture, 0.02, 1)
    );

    // Snow at extreme elevations.
    if (elevation > 0.93) {
        const snowBlend = smoothstep(
            0.93,
            0.99,
            elevation
        );

        color = mixColor(
            color,
            [0.88, 0.89, 0.87],
            snowBlend
        );
    }

    return color;
}

function smoothstep(min, max, value) {
    const t = clamp((value - min) / (max - min));
    return t * t * (3 - 2 * t);
}



function generateMesh(job) {
    const {
        x,
        z,
        size,
        lod,
        neighborLODs
    } = job;

    const resolution = [32, 16, 8, 4][
        clamp(lod, 0, 3)
    ];

    const stride = size / resolution;

    const count = (resolution + 1) ** 2;

    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);

    const indices = new Uint32Array(
        resolution * resolution * 6
    );

    const originX = x * size;
    const originZ = z * size;

    const edgeHeight = (edge, index) => {
        const otherLOD = neighborLODs[edge];

        const worldDistance = index * stride;

        if (otherLOD <= lod) {
            return edge === "north" || edge === "south"
                ? heightAt(
                    originX + worldDistance,
                    originZ + (edge === "south" ? size : 0)
                )
                : heightAt(
                    originX + (edge === "east" ? size : 0),
                    originZ + worldDistance
                );
        }

        const coarseResolution = [32, 16, 8, 4][
            clamp(otherLOD, 0, 3)
        ];

        const coarseStride = size / coarseResolution;

        const lower =
            Math.floor(worldDistance / coarseStride) *
            coarseStride;

        const upper = Math.min(
            lower + coarseStride,
            size
        );

        const t = upper === lower
            ? 0
            : (worldDistance - lower) / (upper - lower);

        let ax, az, bx, bz;

        if (edge === "north" || edge === "south") {
            az = bz = originZ +
                (edge === "south" ? size : 0);

            ax = originX + lower;
            bx = originX + upper;
        } else {
            ax = bx = originX +
                (edge === "east" ? size : 0);

            az = originZ + lower;
            bz = originZ + upper;
        }

        return lerp(
            heightAt(ax, az),
            heightAt(bx, bz),
            t
        );
    };

    for (let iz = 0; iz <= resolution; iz++) {
        for (let ix = 0; ix <= resolution; ix++) {
            const worldX = originX + ix * stride;
            const worldZ = originZ + iz * stride;

            let h = heightAt(worldX, worldZ);

            if (iz === 0) h = edgeHeight("north", ix);
            if (iz === resolution) h = edgeHeight("south", ix);
            if (ix === 0) h = edgeHeight("west", iz);
            if (ix === resolution) h = edgeHeight("east", iz);

            const spacing = Math.max(2, stride * 0.25);

            const dx = (
                heightAt(worldX + spacing, worldZ) -
                heightAt(worldX - spacing, worldZ)
            ) / (2 * spacing);

            const dz = (
                heightAt(worldX, worldZ + spacing) -
                heightAt(worldX, worldZ - spacing)
            ) / (2 * spacing);

            const length = Math.hypot(dx, 1, dz);

            const index = iz * (resolution + 1) + ix;
            const offset = index * 3;

            positions[offset] = worldX;
            positions[offset + 1] = h;
            positions[offset + 2] = worldZ;

            normals[offset] = -dx / length;
            normals[offset + 1] = 1 / length;
            normals[offset + 2] = -dz / length;

		const color = terrainColor(
    h,
    Math.hypot(dx, dz),
    worldX,
    worldZ
);

            const colorOffset = index * 4;

            colors[colorOffset] = color[0];
            colors[colorOffset + 1] = color[1];
            colors[colorOffset + 2] = color[2];
            colors[colorOffset + 3] = 1;
        }
    }

    let cursor = 0;

    for (let iz = 0; iz < resolution; iz++) {
        for (let ix = 0; ix < resolution; ix++) {
            const a = iz * (resolution + 1) + ix;
            const b = a + 1;
            const c = a + resolution + 1;
            const d = c + 1;

            indices[cursor++] = a;
            indices[cursor++] = c;
            indices[cursor++] = b;

            indices[cursor++] = b;
            indices[cursor++] = c;
            indices[cursor++] = d;
        }
    }

    return {
        positions,
        normals,
        colors,
        indices
    };
}

self.onmessage = event => {
    const message = event.data;

    if (message.type === "init") {
        terrain = {
            ...message.terrain,
            pixels: new Uint8ClampedArray(message.pixels)
        };

        self.postMessage({ type: "ready" });
        return;
    }

    if (message.type === "generate" && terrain) {
        try {
            const data = generateMesh(message.job);

            self.postMessage({
                type: "complete",
                id: message.id,
                revision: message.revision,
                data: {
                    positions: data.positions,
                    normals: data.normals,
                    colors: data.colors,
                    indices: data.indices
                }
            }, [
                data.positions.buffer,
                data.normals.buffer,
                data.colors.buffer,
                data.indices.buffer
            ]);
        } catch (error) {
            self.postMessage({
                type: "error",
                id: message.id,
                revision: message.revision,
                message: error.message
            });
        }
    }
};

