import * as THREE from 'three';

export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  type: 'wall' | 'cover' | 'siteA' | 'siteB';
}

export class LevelBuilder {
  public static buildPuertoCobalto(scene: THREE.Scene): { collisionBoxes: CollisionBox[] } {
    const collisionBoxes: CollisionBox[] = [];

    // Helper to add a box with collider
    const addBox = (
      x: number, y: number, z: number,
      w: number, h: number, d: number,
      material: THREE.Material,
      type: 'wall' | 'cover' = 'cover',
      castShadow = true
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y + h / 2, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);

      collisionBoxes.push({
        min: new THREE.Vector3(x - w / 2, y, z - d / 2),
        max: new THREE.Vector3(x + w / 2, y + h, z + d / 2),
        type
      });
      return mesh;
    };

    // Concrete Floor
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      roughness: 0.85,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Markings (Tactical Site Lines)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 });
    const lineGeo = new THREE.PlaneGeometry(1.5, 40);
    const lineA = new THREE.Mesh(lineGeo, lineMat);
    lineA.rotation.x = -Math.PI / 2;
    lineA.position.set(-14, 0.02, 0);
    scene.add(lineA);

    const lineB = new THREE.Mesh(lineGeo, lineMat);
    lineB.rotation.x = -Math.PI / 2;
    lineB.position.set(14, 0.02, 0);
    scene.add(lineB);

    // Perimeter Walls (Warehouse Enclosure)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.2
    });
    // North, South, East, West boundary walls
    addBox(0, 0, -45, 90, 8, 2, wallMat, 'wall');
    addBox(0, 0, 45, 90, 8, 2, wallMat, 'wall');
    addBox(-45, 0, 0, 2, 8, 90, wallMat, 'wall');
    addBox(45, 0, 0, 2, 8, 90, wallMat, 'wall');

    // Container Materials (Stylized Tecnotáctico Colors)
    const matAmberContainer = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.45,
      metalness: 0.3
    });
    const matCyanContainer = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.45,
      metalness: 0.3
    });
    const matSteelContainer = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5,
      metalness: 0.6
    });

    // SITE A (Muelles & Grúa) - Left Flank
    // High tactical containers forming choke points
    addBox(-24, 0, 20, 6, 3.2, 12, matCyanContainer);
    addBox(-32, 0, 16, 5, 3.2, 8, matSteelContainer);
    addBox(-16, 0, 26, 4, 3.2, 8, matAmberContainer);
    addBox(-24, 3.2, 18, 5, 3.2, 8, matAmberContainer); // Stacked container

    // SITE A - Plant Zone Hologram Indicator
    const siteAGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.1, 32);
    const siteAMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const siteAMesh = new THREE.Mesh(siteAGeo, siteAMat);
    siteAMesh.position.set(-24, 0.05, 20);
    scene.add(siteAMesh);

    collisionBoxes.push({
      min: new THREE.Vector3(-28.5, 0, 15.5),
      max: new THREE.Vector3(-19.5, 4, 24.5),
      type: 'siteA'
    });

    // SITE B (Almacén Aduanero) - Right Flank
    addBox(24, 0, 20, 6, 3.2, 12, matCyanContainer);
    addBox(32, 0, 24, 8, 3.2, 5, matSteelContainer);
    addBox(16, 0, 14, 5, 3.2, 9, matAmberContainer);
    addBox(24, 3.2, 22, 5, 3.2, 8, matCyanContainer); // Stacked container

    // SITE B - Plant Zone Hologram Indicator
    const siteBGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.1, 32);
    const siteBMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const siteBMesh = new THREE.Mesh(siteBGeo, siteBMat);
    siteBMesh.position.set(24, 0.05, 20);
    scene.add(siteBMesh);

    collisionBoxes.push({
      min: new THREE.Vector3(19.5, 0, 15.5),
      max: new THREE.Vector3(28.5, 4, 24.5),
      type: 'siteB'
    });

    // MID LANE (Pasillo Central & Cajas Tácticas)
    const midWallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2
    });
    // Center divider walls with peek holes
    addBox(-6, 0, 0, 8, 3.5, 2, midWallMat);
    addBox(6, 0, 0, 8, 3.5, 2, midWallMat);
    // Center tactical cover boxes for mid duels
    addBox(0, 0, -8, 2.2, 1.4, 2.2, matSteelContainer);
    addBox(0, 0, 8, 2.2, 1.4, 2.2, matSteelContainer);
    addBox(-12, 0, -6, 2.5, 1.4, 2.5, matAmberContainer);
    addBox(12, 0, -6, 2.5, 1.4, 2.5, matCyanContainer);

    // Harbor Crane Structure (Atmospheric 3D landmark)
    const craneGroup = new THREE.Group();
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4, metalness: 0.8 });
    // Crane legs
    const legGeo = new THREE.CylinderGeometry(0.3, 0.3, 14, 8);
    const leg1 = new THREE.Mesh(legGeo, craneMat);
    leg1.position.set(-18, 7, 6);
    craneGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, craneMat);
    leg2.position.set(-14, 7, 10);
    craneGroup.add(leg2);
    // Crane horizontal boom
    const boomGeo = new THREE.BoxGeometry(18, 1.2, 1.2);
    const boom = new THREE.Mesh(boomGeo, craneMat);
    boom.position.set(-16, 14, 8);
    boom.rotation.y = Math.PI / 4;
    craneGroup.add(boom);
    scene.add(craneGroup);

    // Industrial overhead lamps
    const lightPillars = [
      { x: -15, z: -15 }, { x: 15, z: -15 },
      { x: -25, z: 15 }, { x: 25, z: 15 },
      { x: 0, z: 0 }
    ];
    lightPillars.forEach(pos => {
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 6, 8);
      const pole = new THREE.Mesh(poleGeo, matSteelContainer);
      pole.position.set(pos.x, 3, pos.z);
      scene.add(pole);

      const lampLight = new THREE.PointLight(0x93c5fd, 1.2, 22, 1.4);
      lampLight.position.set(pos.x, 5.8, pos.z);
      scene.add(lampLight);
    });

    return { collisionBoxes };
  }
}
