import * as THREE from 'three';
import { Team } from '../types/game';

export interface BotDamageResult {
  hit: boolean;
  damage: number;
  isHeadshot: boolean;
  killed: boolean;
  partName: string;
}

export class BotActor {
  public id: string;
  public name: string;
  public team: Team;
  public agentId: string;
  public group: THREE.Group;
  public health: number = 100;
  public armor: number = 50;
  public isAlive: boolean = true;
  public hasNucleo: boolean = false;

  public headMesh: THREE.Mesh;
  public torsoMesh: THREE.Mesh;
  public legsMesh: THREE.Mesh;

  private leftLeg: THREE.Mesh;
  private rightLeg: THREE.Mesh;
  private weaponMesh: THREE.Group;

  public targetPosition: THREE.Vector3 = new THREE.Vector3();
  public state: 'patrol' | 'engage' | 'cover' | 'plant' | 'defuse' = 'patrol';
  private shootCooldown: number = 0;
  private walkCycle: number = 0;

  constructor(id: string, name: string, team: Team, agentId: string, spawnPos: THREE.Vector3) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.agentId = agentId;

    this.group = new THREE.Group();
    this.group.position.copy(spawnPos);

    const teamHex = team === 'amber' ? 0xf59e0b : 0x06b6d4;
    const vestColor = 0x1e293b;

    // Materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: vestColor,
      roughness: 0.7,
      metalness: 0.2
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: teamHex,
      roughness: 0.35,
      metalness: 0.7
    });

    const visorMat = new THREE.MeshBasicMaterial({
      color: teamHex
    });

    // 1. Torso & Chest Rig
    const torsoGeo = new THREE.BoxGeometry(0.5, 0.65, 0.32);
    this.torsoMesh = new THREE.Mesh(torsoGeo, armorMat);
    this.torsoMesh.position.y = 1.05;
    this.torsoMesh.castShadow = true;
    this.torsoMesh.receiveShadow = true;
    this.torsoMesh.name = 'TorsoHitbox';
    this.group.add(this.torsoMesh);

    // 2. Head & Tactical Helmet
    const headGeo = new THREE.BoxGeometry(0.28, 0.3, 0.28);
    this.headMesh = new THREE.Mesh(headGeo, armorMat);
    this.headMesh.position.y = 1.62;
    this.headMesh.castShadow = true;
    this.headMesh.name = 'HeadHitbox';
    this.group.add(this.headMesh);

    // Visor Bar
    const visorGeo = new THREE.BoxGeometry(0.24, 0.08, 0.05);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.62, 0.15);
    this.group.add(visor);

    // 3. Legs
    const legGeo = new THREE.BoxGeometry(0.18, 0.7, 0.2);
    this.leftLeg = new THREE.Mesh(legGeo, suitMat);
    this.leftLeg.position.set(-0.14, 0.35, 0);
    this.leftLeg.castShadow = true;
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, suitMat);
    this.rightLeg.position.set(0.14, 0.35, 0);
    this.rightLeg.castShadow = true;
    this.group.add(this.rightLeg);

    this.legsMesh = this.leftLeg; // Proxy reference for collision check

    // 4. Weapon
    this.weaponMesh = new THREE.Group();
    const gunBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.1, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 })
    );
    gunBody.position.set(0.22, 1.0, 0.35);
    this.weaponMesh.add(gunBody);
    this.group.add(this.weaponMesh);
  }

  public update(delta: number, playerPos: THREE.Vector3, isPlayerEnemy: boolean): { fired: boolean; targetHit: boolean } {
    if (!this.isAlive) {
      // Death collapse
      if (this.group.rotation.x > -Math.PI / 2) {
        this.group.rotation.x -= delta * 5.0;
        this.group.position.y = Math.max(0.15, this.group.position.y - delta * 3.0);
      }
      return { fired: false, targetHit: false };
    }

    let fired = false;
    let targetHit = false;

    const distToPlayer = this.group.position.distanceTo(playerPos);

    if (isPlayerEnemy && distToPlayer < 35.0) {
      this.state = 'engage';
      // Rotate towards player
      const angle = Math.atan2(playerPos.x - this.group.position.x, playerPos.z - this.group.position.z);
      this.group.rotation.y = angle;

      this.shootCooldown -= delta;
      if (this.shootCooldown <= 0) {
        fired = true;
        this.shootCooldown = 0.45 + Math.random() * 0.4;
        // Bot accuracy
        if (Math.random() < 0.45 && distToPlayer < 25.0) {
          targetHit = true;
        }
      }
    } else {
      this.state = 'patrol';
      // Walk towards target
      if (this.targetPosition.lengthSq() > 0) {
        const toTarget = new THREE.Vector3().subVectors(this.targetPosition, this.group.position);
        toTarget.y = 0;
        if (toTarget.length() > 1.0) {
          toTarget.normalize();
          this.group.position.addScaledVector(toTarget, 3.2 * delta);
          this.group.rotation.y = Math.atan2(toTarget.x, toTarget.z);

          // Animate leg swings
          this.walkCycle += delta * 8.0;
          this.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.45;
          this.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.45;
        } else {
          this.leftLeg.rotation.x = 0;
          this.rightLeg.rotation.x = 0;
        }
      }
    }

    return { fired, targetHit };
  }

  public takeDamage(amount: number, isHeadshot: boolean): { killed: boolean } {
    if (!this.isAlive) return { killed: false };

    const multiplier = isHeadshot ? 2.5 : 1.0;
    const finalDamage = amount * multiplier;

    // Armor absorbs 66% until broken
    const absorbed = Math.min(this.armor, finalDamage * 0.66);
    this.armor -= absorbed;
    const directDamage = finalDamage - absorbed;
    this.health -= directDamage;

    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      return { killed: true };
    }
    return { killed: false };
  }
}
