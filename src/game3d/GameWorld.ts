import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BotActor } from './BotActor';
import { CollisionBox, LevelBuilder } from './LevelBuilder';
import { WeaponModelBuilder } from './WeaponModelBuilder';
import { WEAPONS_DATABASE } from '../data/weapons';
import { AGENTS_DATABASE } from '../data/agents';
import { WeaponData, Team } from '../types/game';
import { tacticalAudio } from '../audio/tacticalAudio';

export interface GameCallbacks {
  onHealthChanged: (hp: number, armor: number) => void;
  onAmmoChanged: (current: number, reserve: number) => void;
  onHitmarker: (isHeadshot: boolean) => void;
  onKill: (victimName: string, isHeadshot: boolean) => void;
  onPlantProgress: (progress: number) => void;
  onDefuseProgress: (progress: number) => void;
  onNucleoPlanted: (site: string) => void;
  onNucleoDefused: () => void;
  onFlashScreen: (duration: number) => void;
  onPlayerDied: () => void;
  onCalloutChanged: (callout: string) => void;
}

export class GameWorld {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Viewmodel
  private viewmodelGroup: THREE.Group | null = null;
  private currentWeaponData: WeaponData;
  private currentAmmo: number;
  private reserveAmmo: number;
  private isReloading: boolean = false;
  private reloadTimer: number = 0;
  private fireCooldown: number = 0;

  // Recoil & Aim
  private currentRecoil = new THREE.Vector2();
  private recoilRecoverySpeed: number = 6.0;
  private isAimingDownSights: boolean = false;
  private defaultFov: number = 90;
  private adsFov: number = 70;

  // Player State
  public playerHealth: number = 100;
  public playerArmor: number = 50;
  public playerTeam: Team = 'amber';
  public hasNucleo: boolean = true;
  private isAlive: boolean = true;

  // Movement Physics
  private playerPos = new THREE.Vector3(0, 1.7, -32);
  private playerVelocity = new THREE.Vector3();
  private yaw: number = 0;
  private pitch: number = 0;
  private isCrouching: boolean = false;
  private isSilentWalking: boolean = false;
  private leanAmount: number = 0; // -1 to 1
  private isGrounded: boolean = true;
  private cameraHeight: number = 1.7;

  // Key States
  private keys: Record<string, boolean> = {};
  private isPointerLocked: boolean = false;

  // Level & Bots
  private collisionBoxes: CollisionBox[] = [];
  public bots: BotActor[] = [];

  // Núcleo (Bomb)
  public nucleoMesh: THREE.Group | null = null;
  public nucleoPlanted: boolean = false;
  public nucleoPlantSite: string = '';
  public nucleoTimer: number = 40.0;
  private isPlanting: boolean = false;
  private isDefusing: boolean = false;
  private plantProgress: number = 0;
  private defuseProgress: number = 0;
  private lastBeepTimer: number = 0;

  // Visual Effects & Abilities
  private activeAbilitiesGroup = new THREE.Group();
  private muzzleFlashLight: THREE.PointLight;
  private muzzleFlashTimer: number = 0;

  // Animation & Loop
  private animFrameId: number = 0;
  private clock = new THREE.Clock();
  private walkBobTimer: number = 0;
  private callbacks: GameCallbacks;

  constructor(container: HTMLElement, callbacks: GameCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.currentWeaponData = WEAPONS_DATABASE[6]; // Élite-24 default
    this.currentAmmo = this.currentWeaponData.magazineSize;
    this.reserveAmmo = this.currentWeaponData.reserveAmmo;

    // 1. Setup Three.js Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 2. Setup Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);
    this.scene.fog = new THREE.FogExp2(0x090d16, 0.015);

    this.camera = new THREE.PerspectiveCamera(this.defaultFov, container.clientWidth / container.clientHeight, 0.05, 150);
    this.camera.position.copy(this.playerPos);
    this.scene.add(this.camera);

    // 3. Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    sunLight.position.set(20, 45, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.6);
    this.scene.add(hemiLight);

    // Muzzle Flash Dynamic Light
    this.muzzleFlashLight = new THREE.PointLight(0xf59e0b, 0, 8);
    this.camera.add(this.muzzleFlashLight);
    this.muzzleFlashLight.position.set(0.24, -0.15, -0.8);

    this.scene.add(this.activeAbilitiesGroup);

    // 4. Build Map
    const level = LevelBuilder.buildPuertoCobalto(this.scene);
    this.collisionBoxes = level.collisionBoxes;

    // 5. Build Viewmodel
    this.rebuildViewmodel();

    // 6. Spawn 5v5 Bots
    this.spawnOperatives();

    // 7. Event Listeners
    this.setupInputs();

    // 8. Start Loop
    this.tick = this.tick.bind(this);
    this.animFrameId = requestAnimationFrame(this.tick);
  }

  private rebuildViewmodel() {
    if (this.viewmodelGroup) {
      this.camera.remove(this.viewmodelGroup);
    }
    this.viewmodelGroup = WeaponModelBuilder.buildViewmodel(
      this.currentWeaponData.category,
      this.currentWeaponData.colorTheme
    );
    this.camera.add(this.viewmodelGroup);
  }

  public selectWeapon(weaponId: string) {
    const found = WEAPONS_DATABASE.find(w => w.id === weaponId);
    if (!found) return;
    this.currentWeaponData = found;
    this.currentAmmo = found.magazineSize;
    this.reserveAmmo = found.reserveAmmo;
    this.rebuildViewmodel();
    this.callbacks.onAmmoChanged(this.currentAmmo, this.reserveAmmo);
  }

  private spawnOperatives() {
    // 4 Allied bots + 5 Enemy bots
    const botConfigs = [
      // Allies (Ámbar)
      { name: 'Ámbar-02 (Halcón)', team: 'amber' as Team, agent: 'halcon', pos: new THREE.Vector3(-4, 0, -28) },
      { name: 'Ámbar-03 (Chispa)', team: 'amber' as Team, agent: 'chispa', pos: new THREE.Vector3(4, 0, -28) },
      { name: 'Ámbar-04 (Muralla)', team: 'amber' as Team, agent: 'muralla', pos: new THREE.Vector3(-8, 0, -30) },
      { name: 'Ámbar-05 (Niebla)', team: 'amber' as Team, agent: 'niebla', pos: new THREE.Vector3(8, 0, -30) },
      // Enemies (Cian)
      { name: 'Cian-01 (Espectro)', team: 'cyan' as Team, agent: 'espectro', pos: new THREE.Vector3(-24, 0, 18) },
      { name: 'Cian-02 (Bisturí)', team: 'cyan' as Team, agent: 'bisturi', pos: new THREE.Vector3(24, 0, 18) },
      { name: 'Cian-03 (Trampa)', team: 'cyan' as Team, agent: 'trampa', pos: new THREE.Vector3(0, 0, 12) },
      { name: 'Cian-04 (Eco)', team: 'cyan' as Team, agent: 'eco', pos: new THREE.Vector3(-14, 0, 6) },
      { name: 'Cian-05 (Muralla)', team: 'cyan' as Team, agent: 'muralla', pos: new THREE.Vector3(14, 0, 6) }
    ];

    botConfigs.forEach((cfg, idx) => {
      const bot = new BotActor(`bot_${idx}`, cfg.name, cfg.team, cfg.agent, cfg.pos);
      // Give bots initial targets
      if (cfg.team === 'amber') {
        bot.targetPosition = new THREE.Vector3(idx % 2 === 0 ? -24 : 24, 0, 18);
      } else {
        bot.targetPosition = new THREE.Vector3(0, 0, 0);
      }
      this.scene.add(bot.group);
      this.bots.push(bot);
    });
  }

  private setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyR' && !this.isReloading && this.currentAmmo < this.currentWeaponData.magazineSize) {
        this.startReload();
      }
      // Weapon quick switch 1-5
      if (e.code === 'Digit1') this.selectWeapon('rifle_elite24');
      if (e.code === 'Digit2') this.selectWeapon('pistol_c12');
      if (e.code === 'Digit3') this.selectWeapon('knife_carbon');
      if (e.code === 'Digit4') this.selectWeapon('sniper_vertice');
      if (e.code === 'Digit5') this.selectWeapon('smg_rafaga9');

      // Tactical Abilities (C, X, Z)
      if (e.code === 'KeyC') this.castAbility('ability1');
      if (e.code === 'KeyX') this.castAbility('ability2');
      if (e.code === 'KeyZ') this.castAbility('ultimate');
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.renderer.domElement.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        this.renderer.domElement.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;
      const sens = this.isAimingDownSights ? 0.0012 : 0.0022;
      this.yaw -= e.movementX * sens;
      this.pitch -= e.movementY * sens;
      this.pitch = Math.max(-1.48, Math.min(1.48, this.pitch));
    });

    window.addEventListener('mousedown', (e) => {
      if (!this.isPointerLocked) return;
      if (e.button === 0) {
        this.shoot();
      } else if (e.button === 2) {
        this.isAimingDownSights = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 2) {
        this.isAimingDownSights = false;
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    });
  }

  public castAbility(slot: 'ability1' | 'ability2' | 'ultimate') {
    tacticalAudio.playAbilitySound(slot);
    if (slot === 'ability1') {
      // Spawn Muralla solid wall in front of player
      const wallGeo = new THREE.BoxGeometry(6, 3.2, 0.5);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x059669,
        emissiveIntensity: 0.3
      });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      wall.position.copy(this.playerPos).addScaledVector(forward, 4.0);
      wall.position.y = 1.6;
      wall.rotation.y = this.yaw;
      this.activeAbilitiesGroup.add(wall);

      // Add to collision
      this.collisionBoxes.push({
        min: new THREE.Vector3(wall.position.x - 3, 0, wall.position.z - 3),
        max: new THREE.Vector3(wall.position.x + 3, 3.5, wall.position.z + 3),
        type: 'wall'
      });
    } else if (slot === 'ability2') {
      // Spawn Niebla volumetric smoke sphere
      const smokeGeo = new THREE.SphereGeometry(4.5, 24, 24);
      const smokeMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.9,
        transparent: true,
        opacity: 0.75,
        wireframe: false
      });
      const smoke = new THREE.Mesh(smokeGeo, smokeMat);
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      smoke.position.copy(this.playerPos).addScaledVector(forward, 6.0);
      smoke.position.y = 2.5;
      this.activeAbilitiesGroup.add(smoke);
    } else if (slot === 'ultimate') {
      // Halcón orbital scan flash
      this.callbacks.onFlashScreen(0.4);
      tacticalAudio.announce('¡Escaneo orbital activado! Enemigos revelados.');
    }
  }

  private startReload() {
    if (this.reserveAmmo <= 0) return;
    this.isReloading = true;
    this.reloadTimer = this.currentWeaponData.reloadTime;
    tacticalAudio.playReload();
  }

  public shoot() {
    if (!this.isAlive || this.fireCooldown > 0 || this.isReloading) return;
    if (this.currentAmmo <= 0) {
      this.startReload();
      return;
    }

    this.currentAmmo--;
    this.fireCooldown = 1.0 / this.currentWeaponData.fireRate;
    this.callbacks.onAmmoChanged(this.currentAmmo, this.reserveAmmo);

    // Audio & Recoil
    tacticalAudio.playWeaponFire(this.currentWeaponData.category);

    // Muzzle Flash
    this.muzzleFlashLight.intensity = 2.5;
    this.muzzleFlashTimer = 0.05;

    // Apply Recoil Pattern to Camera
    const pattern = this.currentWeaponData.recoilPattern;
    const recoilStep = pattern[Math.floor(Math.random() * pattern.length)];
    this.currentRecoil.y += recoilStep.y * (this.isCrouching ? 0.7 : 1.0);
    this.currentRecoil.x += (Math.random() - 0.5) * 0.015;

    // Viewmodel Kick
    if (this.viewmodelGroup) {
      this.viewmodelGroup.position.z += 0.08;
      this.viewmodelGroup.rotation.x += 0.12;
    }

    // Hitscan Raycast
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);
    // Add movement spread
    let spread = 0.002;
    if (!this.isGrounded) spread = 0.08;
    else if (this.playerVelocity.length() > 3.0) spread = 0.035;
    else if (this.isCrouching) spread = 0.0008;

    center.x += (Math.random() - 0.5) * spread;
    center.y += (Math.random() - 0.5) * spread;

    raycaster.setFromCamera(center, this.camera);

    // Test against bot hitboxes
    const targetMeshes: THREE.Mesh[] = [];
    this.bots.forEach(b => {
      if (b.isAlive && b.team !== this.playerTeam) {
        targetMeshes.push(b.headMesh);
        targetMeshes.push(b.torsoMesh);
        targetMeshes.push(b.legsMesh);
      }
    });

    const intersects = raycaster.intersectObjects(targetMeshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitMesh = hit.object as THREE.Mesh;
      const isHeadshot = hitMesh.name === 'HeadHitbox';

      // Find which bot was hit
      const targetBot = this.bots.find(b =>
        b.headMesh === hitMesh || b.torsoMesh === hitMesh || b.legsMesh === hitMesh
      );

      if (targetBot) {
        if (isHeadshot) {
          tacticalAudio.playHeadshotDink();
        } else {
          tacticalAudio.playHitImpact();
        }
        this.callbacks.onHitmarker(isHeadshot);

        const damage = this.currentWeaponData.damageTorso;
        const result = targetBot.takeDamage(damage, isHeadshot);

        if (result.killed) {
          this.callbacks.onKill(targetBot.name, isHeadshot);
        }
      }
    }
  }

  // Poll PS4 Gamepad via Gamepad API
  private pollGamepad(delta: number) {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0] || gamepads[1];
    if (!gp) return;

    const deadzone = 0.15;

    // Left Stick (Movement)
    let lx = gp.axes[0];
    let ly = gp.axes[1];
    if (Math.abs(lx) < deadzone) lx = 0;
    if (Math.abs(ly) < deadzone) ly = 0;

    // Right Stick (Aiming)
    let rx = gp.axes[2];
    let ry = gp.axes[3];
    if (Math.abs(rx) < deadzone) rx = 0;
    if (Math.abs(ry) < deadzone) ry = 0;

    const aimSpeed = this.isAimingDownSights ? 1.4 : 2.6;
    this.yaw -= Math.sign(rx) * Math.pow(Math.abs(rx), 1.5) * aimSpeed * delta;
    this.pitch -= Math.sign(ry) * Math.pow(Math.abs(ry), 1.5) * aimSpeed * delta;
    this.pitch = Math.max(-1.48, Math.min(1.48, this.pitch));

    // R2 Trigger (Fire)
    if (gp.buttons[7] && gp.buttons[7].pressed) {
      this.shoot();
      if (gp.vibrationActuator) {
        (gp.vibrationActuator as unknown as { playEffect: (type: string, opts: object) => void }).playEffect('dual-rumble', {
          startDelay: 0,
          duration: 60,
          weakMagnitude: 0.5,
          strongMagnitude: 0.3
        });
      }
    }

    // L2 Trigger (ADS Zoom)
    this.isAimingDownSights = gp.buttons[6] && gp.buttons[6].pressed;

    // Face Buttons
    if (gp.buttons[0]?.pressed && this.isGrounded) { // Cross (Jump)
      this.playerVelocity.y = 5.2;
      this.isGrounded = false;
    }
    this.isCrouching = !!gp.buttons[1]?.pressed; // Circle (Crouch)
    if (gp.buttons[2]?.pressed && !this.isReloading) { // Square (Reload)
      this.startReload();
    }
    if (gp.buttons[4]?.pressed) this.castAbility('ability1'); // L1
    if (gp.buttons[5]?.pressed) this.castAbility('ability2'); // R1
  }

  private tick() {
    const delta = Math.min(this.clock.getDelta(), 0.05);

    // 1. Gamepad Polling
    this.pollGamepad(delta);

    // 2. Timers
    if (this.fireCooldown > 0) this.fireCooldown -= delta;
    if (this.muzzleFlashTimer > 0) {
      this.muzzleFlashTimer -= delta;
      if (this.muzzleFlashTimer <= 0) this.muzzleFlashLight.intensity = 0;
    }

    // Reload handling
    if (this.isReloading) {
      this.reloadTimer -= delta;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const needed = this.currentWeaponData.magazineSize - this.currentAmmo;
        const take = Math.min(needed, this.reserveAmmo);
        this.currentAmmo += take;
        this.reserveAmmo -= take;
        this.callbacks.onAmmoChanged(this.currentAmmo, this.reserveAmmo);
      }
    }

    // 3. Movement & Leaning
    this.isCrouching = this.keys['KeyC'] || this.keys['ControlLeft'] || this.keys['ControlRight'] || this.isCrouching;
    this.isSilentWalking = !!this.keys['ShiftLeft'];

    // Lean left/right with Q and E
    let targetLean = 0;
    if (this.keys['KeyQ']) targetLean -= 1;
    if (this.keys['KeyE']) targetLean += 1;
    this.leanAmount = THREE.MathUtils.damp(this.leanAmount, targetLean, 10, delta);

    // Speed calculation
    let speed = 5.6;
    if (this.isCrouching) speed = 2.4;
    else if (this.isSilentWalking) speed = 3.2;

    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.z -= 1;
    if (this.keys['KeyS']) moveDir.z += 1;
    if (this.keys['KeyA']) moveDir.x -= 1;
    if (this.keys['KeyD']) moveDir.x += 1;
    moveDir.normalize();

    // Rotate movement by yaw
    moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

    this.playerVelocity.x = THREE.MathUtils.damp(this.playerVelocity.x, moveDir.x * speed, 14, delta);
    this.playerVelocity.z = THREE.MathUtils.damp(this.playerVelocity.z, moveDir.z * speed, 14, delta);

    // Jump & Gravity
    if (this.keys['Space'] && this.isGrounded) {
      this.playerVelocity.y = 5.2;
      this.isGrounded = false;
    }
    if (!this.isGrounded) {
      this.playerVelocity.y -= 14.0 * delta;
    }

    // Integrate Position
    const nextX = this.playerPos.x + this.playerVelocity.x * delta;
    const nextZ = this.playerPos.z + this.playerVelocity.z * delta;
    const nextY = this.playerPos.y + this.playerVelocity.y * delta;

    // Check collision with level boxes
    if (!this.isCollidingWithBoxes(nextX, this.playerPos.z)) {
      this.playerPos.x = nextX;
    } else {
      this.playerVelocity.x = 0;
    }
    if (!this.isCollidingWithBoxes(this.playerPos.x, nextZ)) {
      this.playerPos.z = nextZ;
    } else {
      this.playerVelocity.z = 0;
    }

    // Floor collision
    const targetHeight = this.isCrouching ? 1.05 : 1.7;
    if (nextY <= targetHeight) {
      this.playerPos.y = targetHeight;
      this.playerVelocity.y = 0;
      this.isGrounded = true;
    } else {
      this.playerPos.y = nextY;
    }

    // Camera Positioning & Lean Offset
    const leanOffset = new THREE.Vector3(this.leanAmount * 0.45, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    this.camera.position.copy(this.playerPos).add(leanOffset);

    // Camera Rotation
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch + this.currentRecoil.y;
    this.camera.rotation.z = -this.leanAmount * 0.18;

    // Recover Recoil
    this.currentRecoil.y = THREE.MathUtils.damp(this.currentRecoil.y, 0, this.recoilRecoverySpeed, delta);
    this.currentRecoil.x = THREE.MathUtils.damp(this.currentRecoil.x, 0, this.recoilRecoverySpeed, delta);

    // ADS FOV Zoom
    const targetFov = this.isAimingDownSights ? this.adsFov : this.defaultFov;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 12, delta);
    this.camera.updateProjectionMatrix();

    // 4. Viewmodel Bobbing & ADS Alignment
    if (this.viewmodelGroup) {
      const isMoving = this.playerVelocity.lengthSq() > 0.5;
      if (isMoving && this.isGrounded) {
        this.walkBobTimer += delta * (speed > 4 ? 12 : 8);
        if (Math.sin(this.walkBobTimer) > 0.95 && Math.random() < 0.15) {
          tacticalAudio.playFootstep(this.isSilentWalking);
        }
      }

      const bobX = Math.cos(this.walkBobTimer * 0.5) * 0.008;
      const bobY = Math.abs(Math.sin(this.walkBobTimer)) * 0.008;

      if (this.isAimingDownSights) {
        this.viewmodelGroup.position.set(0, -0.15, -0.38);
      } else {
        this.viewmodelGroup.position.set(0.24 + bobX, -0.25 - bobY, -0.45);
      }

      this.viewmodelGroup.rotation.x = THREE.MathUtils.damp(this.viewmodelGroup.rotation.x, 0, 10, delta);
    }

    // 5. Update Bots
    this.bots.forEach(bot => {
      const botResult = bot.update(delta, this.playerPos, bot.team !== this.playerTeam);
      if (botResult.fired) {
        tacticalAudio.playWeaponFire('rifle');
      }
      if (botResult.targetHit) {
        this.takeDamage(24);
      }
    });

    // 6. Handle Núcleo (Plant & Defusal)
    this.handleNucleoInteraction(delta);

    // Render
    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(this.tick);
  }

  private handleNucleoInteraction(delta: number) {
    const inSiteA = this.playerPos.distanceTo(new THREE.Vector3(-24, 0, 20)) < 7.0;
    const inSiteB = this.playerPos.distanceTo(new THREE.Vector3(24, 0, 20)) < 7.0;
    const isInteracting = this.keys['KeyF'];

    // Plant logic (Amber team)
    if (this.playerTeam === 'amber' && !this.nucleoPlanted && (inSiteA || inSiteB)) {
      if (isInteracting) {
        this.isPlanting = true;
        this.plantProgress += delta / 4.0; // 4 seconds to plant
        this.callbacks.onPlantProgress(this.plantProgress);
        if (this.plantProgress >= 1.0) {
          this.nucleoPlanted = true;
          this.nucleoPlantSite = inSiteA ? 'A' : 'B';
          this.isPlanting = false;
          this.plantProgress = 0;
          this.spawnNucleoMesh(inSiteA ? new THREE.Vector3(-24, 0.05, 20) : new THREE.Vector3(24, 0.05, 20));
          this.callbacks.onNucleoPlanted(this.nucleoPlantSite);
          tacticalAudio.announce(`¡Núcleo plantado en Zona ${this.nucleoPlantSite}!`);
        }
      } else {
        this.plantProgress = 0;
        this.callbacks.onPlantProgress(0);
      }
    }

    // Defuse logic (Cyan team)
    if (this.nucleoPlanted && this.nucleoMesh) {
      const distToNucleo = this.playerPos.distanceTo(this.nucleoMesh.position);
      if (distToNucleo < 3.5 && isInteracting && this.playerTeam === 'cyan') {
        this.isDefusing = true;
        this.defuseProgress += delta / 7.0; // 7 seconds to defuse
        this.callbacks.onDefuseProgress(this.defuseProgress);
        if (this.defuseProgress >= 1.0) {
          this.nucleoPlanted = false;
          this.callbacks.onNucleoDefused();
          tacticalAudio.announce('¡Núcleo desactivado por la Escuadra Cian!');
        }
      } else {
        this.defuseProgress = 0;
        this.callbacks.onDefuseProgress(0);
      }

      // Countdown beeps
      this.nucleoTimer -= delta;
      this.lastBeepTimer += delta;
      const beepInterval = this.nucleoTimer < 10 ? 0.35 : (this.nucleoTimer < 20 ? 0.75 : 1.25);
      if (this.lastBeepTimer >= beepInterval) {
        this.lastBeepTimer = 0;
        tacticalAudio.playNucleoBeep(this.nucleoTimer < 10 ? 3 : 1);
      }

      if (this.nucleoTimer <= 0) {
        tacticalAudio.playNucleoExplosion();
        this.nucleoPlanted = false;
        tacticalAudio.announce('¡Detonación del Núcleo! Victoria de la Escuadra Ámbar.');
      }
    }
  }

  private spawnNucleoMesh(pos: THREE.Vector3) {
    this.nucleoMesh = new THREE.Group();
    this.nucleoMesh.position.copy(pos);

    // Device Body
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.4, 16), bodyMat);
    body.position.y = 0.2;
    this.nucleoMesh.add(body);

    // Hologram Core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), coreMat);
    core.position.y = 0.5;
    this.nucleoMesh.add(core);

    this.scene.add(this.nucleoMesh);
  }

  public takeDamage(amount: number) {
    if (!this.isAlive) return;
    const absorbed = Math.min(this.playerArmor, amount * 0.66);
    this.playerArmor -= absorbed;
    const directDamage = amount - absorbed;
    this.playerHealth -= directDamage;

    this.callbacks.onHealthChanged(Math.max(0, Math.round(this.playerHealth)), Math.round(this.playerArmor));

    if (this.playerHealth <= 0) {
      this.playerHealth = 0;
      this.isAlive = false;
      this.callbacks.onPlayerDied();
      tacticalAudio.announce('Has sido eliminado.');
    }
  }

  private isCollidingWithBoxes(x: number, z: number): boolean {
    const playerRadius = 0.45;
    for (const b of this.collisionBoxes) {
      if (b.type === 'siteA' || b.type === 'siteB') continue;
      if (
        x + playerRadius > b.min.x &&
        x - playerRadius < b.max.x &&
        z + playerRadius > b.min.z &&
        z - playerRadius < b.max.z
      ) {
        return true;
      }
    }
    return false;
  }

  public dispose() {
    cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
