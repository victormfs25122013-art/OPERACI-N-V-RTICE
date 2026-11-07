import * as THREE from 'three';
import { WeaponCategory } from '../types/game';

export class WeaponModelBuilder {
  public static buildViewmodel(category: WeaponCategory, themeColor: string = '#f97316'): THREE.Group {
    const root = new THREE.Group();

    // Material definitions
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.75
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.25,
      metalness: 0.85
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.9
    });

    const sightGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.85,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    const reticleDotMat = new THREE.MeshBasicMaterial({
      color: 0xef4444
    });

    const gloveMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
      metalness: 0.2
    });

    const weaponGroup = new THREE.Group();
    weaponGroup.name = 'WeaponMeshGroup';

    if (category === 'sidearm') {
      // PISTOL MODEL
      // Receiver & Slide
      const slideGeo = new THREE.BoxGeometry(0.06, 0.08, 0.32);
      const slide = new THREE.Mesh(slideGeo, accentMat);
      slide.position.set(0, 0.08, 0);
      weaponGroup.add(slide);

      // Grip
      const gripGeo = new THREE.BoxGeometry(0.055, 0.18, 0.09);
      const grip = new THREE.Mesh(gripGeo, bodyMat);
      grip.position.set(0, -0.04, 0.08);
      grip.rotation.x = 0.25;
      weaponGroup.add(grip);

      // Barrel Tip
      const barrelGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.08, 12);
      const barrel = new THREE.Mesh(barrelGeo, darkSteelMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.08, -0.18);
      weaponGroup.add(barrel);

      // Iron Sights
      const frontSightGeo = new THREE.BoxGeometry(0.01, 0.02, 0.02);
      const frontSight = new THREE.Mesh(frontSightGeo, reticleDotMat);
      frontSight.position.set(0, 0.13, -0.14);
      weaponGroup.add(frontSight);
    } else if (category === 'sniper') {
      // SNIPER RIFLE
      // Heavy Chassis
      const chassisGeo = new THREE.BoxGeometry(0.08, 0.12, 0.75);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      weaponGroup.add(chassis);

      // Long Fluted Barrel
      const barrelGeo = new THREE.CylinderGeometry(0.02, 0.024, 0.65, 12);
      const barrel = new THREE.Mesh(barrelGeo, darkSteelMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.03, -0.65);
      weaponGroup.add(barrel);

      // Muzzle Brake
      const brakeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.1);
      const brake = new THREE.Mesh(brakeGeo, accentMat);
      brake.position.set(0, 0.03, -0.98);
      weaponGroup.add(brake);

      // Scope Tube
      const scopeTubeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.35, 16);
      const scopeTube = new THREE.Mesh(scopeTubeGeo, darkSteelMat);
      scopeTube.rotation.x = Math.PI / 2;
      scopeTube.position.set(0, 0.12, -0.05);
      weaponGroup.add(scopeTube);

      // Scope Lens
      const lensGeo = new THREE.CircleGeometry(0.03, 16);
      const lens = new THREE.Mesh(lensGeo, sightGlassMat);
      lens.position.set(0, 0.12, 0.12);
      weaponGroup.add(lens);

      // Mag & Grip
      const gripGeo = new THREE.BoxGeometry(0.055, 0.22, 0.08);
      const grip = new THREE.Mesh(gripGeo, bodyMat);
      grip.position.set(0, -0.12, 0.14);
      grip.rotation.x = 0.3;
      weaponGroup.add(grip);
    } else if (category === 'shotgun') {
      // SHOTGUN
      const bodyGeo = new THREE.BoxGeometry(0.09, 0.12, 0.55);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      weaponGroup.add(body);

      // Dual Tubes
      const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.45, 12), darkSteelMat);
      tube1.rotation.x = Math.PI / 2;
      tube1.position.set(0, 0.03, -0.42);
      weaponGroup.add(tube1);

      const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.38, 12), accentMat);
      tube2.rotation.x = Math.PI / 2;
      tube2.position.set(0, -0.02, -0.38);
      weaponGroup.add(tube2);

      const gripGeo = new THREE.BoxGeometry(0.06, 0.18, 0.09);
      const grip = new THREE.Mesh(gripGeo, bodyMat);
      grip.position.set(0, -0.1, 0.12);
      grip.rotation.x = 0.28;
      weaponGroup.add(grip);
    } else if (category === 'melee') {
      // TACTICAL KNIFE
      const bladeGeo = new THREE.BoxGeometry(0.015, 0.06, 0.28);
      const blade = new THREE.Mesh(bladeGeo, darkSteelMat);
      blade.position.set(0, 0.02, -0.18);
      weaponGroup.add(blade);

      const handleGeo = new THREE.BoxGeometry(0.035, 0.05, 0.16);
      const handle = new THREE.Mesh(handleGeo, accentMat);
      handle.position.set(0, 0, 0.04);
      weaponGroup.add(handle);
    } else {
      // ASSAULT RIFLE / SMG / LMG
      // Main Upper Receiver
      const upperGeo = new THREE.BoxGeometry(0.07, 0.09, 0.52);
      const upper = new THREE.Mesh(upperGeo, bodyMat);
      weaponGroup.add(upper);

      // Handguard with Top Rail
      const handguardGeo = new THREE.BoxGeometry(0.065, 0.08, 0.32);
      const handguard = new THREE.Mesh(handguardGeo, accentMat);
      handguard.position.set(0, 0, -0.32);
      weaponGroup.add(handguard);

      // Barrel
      const barrelGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.3, 12);
      const barrel = new THREE.Mesh(barrelGeo, darkSteelMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.01, -0.55);
      weaponGroup.add(barrel);

      // Flash Hider
      const hiderGeo = new THREE.CylinderGeometry(0.022, 0.018, 0.08, 12);
      const hider = new THREE.Mesh(hiderGeo, darkSteelMat);
      hider.rotation.x = Math.PI / 2;
      hider.position.set(0, 0.01, -0.72);
      weaponGroup.add(hider);

      // Holographic Sight Housing
      const sightHousingGeo = new THREE.BoxGeometry(0.05, 0.06, 0.08);
      const sightHousing = new THREE.Mesh(sightHousingGeo, darkSteelMat);
      sightHousing.position.set(0, 0.075, -0.05);
      weaponGroup.add(sightHousing);

      // Holographic Red Dot
      const redDotGeo = new THREE.SphereGeometry(0.005, 8, 8);
      const redDot = new THREE.Mesh(redDotGeo, reticleDotMat);
      redDot.position.set(0, 0.075, -0.05);
      weaponGroup.add(redDot);

      // Magazine (Curved / Angled)
      const magGeo = new THREE.BoxGeometry(0.045, 0.22, 0.09);
      const mag = new THREE.Mesh(magGeo, darkSteelMat);
      mag.position.set(0, -0.14, -0.08);
      mag.rotation.x = -0.15;
      weaponGroup.add(mag);

      // Pistol Grip
      const gripGeo = new THREE.BoxGeometry(0.05, 0.18, 0.08);
      const grip = new THREE.Mesh(gripGeo, bodyMat);
      grip.position.set(0, -0.1, 0.15);
      grip.rotation.x = 0.28;
      weaponGroup.add(grip);
    }

    // TACTICAL GLOVED HANDS (Left and Right)
    const rightArmGroup = new THREE.Group();
    const rightHandGeo = new THREE.BoxGeometry(0.08, 0.1, 0.16);
    const rightHand = new THREE.Mesh(rightHandGeo, gloveMat);
    rightHand.position.set(0.08, -0.1, 0.12);
    rightArmGroup.add(rightHand);

    const leftArmGroup = new THREE.Group();
    const leftHandGeo = new THREE.BoxGeometry(0.08, 0.09, 0.14);
    const leftHand = new THREE.Mesh(leftHandGeo, gloveMat);
    leftHand.position.set(-0.06, -0.06, -0.22);
    leftArmGroup.add(leftHand);

    root.add(weaponGroup);
    root.add(rightArmGroup);
    root.add(leftArmGroup);

    // Initial positioning in front of FPS camera
    root.position.set(0.24, -0.25, -0.45);

    return root;
  }
}
