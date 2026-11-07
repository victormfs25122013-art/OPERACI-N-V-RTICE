export interface GodotProjectFile {
  path: string;
  category: 'config' | 'autoload' | 'player' | 'weapons' | 'agents' | 'gamemode' | 'ai' | 'maps' | 'ui' | 'shaders' | 'docs';
  description: string;
  content: string;
}

export const GODOT_PROJECT_FILES: GodotProjectFile[] = [
  // 1. PROJECT CONFIGURATION
  {
    path: 'project.godot',
    category: 'config',
    description: 'Configuración principal del motor Godot 4.3, inputs KBM y PS4 DualShock, y capas de colisión',
    content: `; Engine configuration file for OPERACIÓN VÉRTICE (Godot 4.3)
; Tactical 5v5 FPS Engine Setup

config_version=5

[application]
config/name="Operacion Vertice"
config/description="Shooter táctico 5v5 en primera persona por rondas con agentes y armas originales"
config/version="1.0.0"
run/main_scene="res://scenes/ui/main_menu.tscn"
config/features=PackedStringArray("4.3", "Forward Plus")
config/icon="res://icon.svg"

[autoload]
GameState="*res://autoload/game_state.gd"
AudioManager="*res://autoload/audio_manager.gd"
NetworkManager="*res://autoload/network_manager.gd"
SettingsManager="*res://autoload/settings_manager.gd"
WeaponDB="*res://scripts/weapons/weapon_database.gd"
AgentDB="*res://scripts/agents/agent_database.gd"

[display]
window/size/viewport_width=1920
window/size/viewport_height=1080
window/size/mode=3
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"
window/vsync/vsync_mode=1

[rendering]
renderer/rendering_method="forward_plus"
textures/vram_compression/import_s3tc_bptc=true
anti_aliasing/quality/msaa_3d=2
anti_aliasing/quality/screen_space_aa=1
lights_and_shadows/directional_shadow/size=4096
lights_and_shadows/positional_shadow/atlas_size=4096

[layer_names]
3d_physics/layer_1="World_Geometry"
3d_physics/layer_2="Player_Hitbox_Torso"
3d_physics/layer_3="Player_Hitbox_Head"
3d_physics/layer_4="Player_Hitbox_Legs"
3d_physics/layer_5="Penetrable_Cover"
3d_physics/layer_6="Nucleo_Objective"
3d_physics/layer_7="Abilities_Barriers"

[input]
move_forward={
  "deadzone": 0.2,
  "events": [Object(InputEventKey,"keycode":87), Object(InputEventJoypadMotion,"axis":1,"axis_value":-1.0)]
}
move_backward={
  "deadzone": 0.2,
  "events": [Object(InputEventKey,"keycode":83), Object(InputEventJoypadMotion,"axis":1,"axis_value":1.0)]
}
move_left={
  "deadzone": 0.2,
  "events": [Object(InputEventKey,"keycode":65), Object(InputEventJoypadMotion,"axis":0,"axis_value":-1.0)]
}
move_right={
  "deadzone": 0.2,
  "events": [Object(InputEventKey,"keycode":68), Object(InputEventJoypadMotion,"axis":0,"axis_value":1.0)]
}
jump={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":32), Object(InputEventJoypadButton,"button_index":0)] ; PS4 Cross
}
crouch={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":4194326), Object(InputEventJoypadButton,"button_index":1)] ; Ctrl / PS4 Circle
}
walk_silent={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":4194325), Object(InputEventJoypadButton,"button_index":7)] ; Shift / PS4 L3
}
lean_left={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":81)] ; Q
}
lean_right={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":69)] ; E
}
fire={
  "deadzone": 0.2,
  "events": [Object(InputEventMouseButton,"button_index":1), Object(InputEventJoypadMotion,"axis":5,"axis_value":1.0)] ; Left Click / PS4 R2
}
aim_ads={
  "deadzone": 0.2,
  "events": [Object(InputEventMouseButton,"button_index":2), Object(InputEventJoypadMotion,"axis":4,"axis_value":1.0)] ; Right Click / PS4 L2
}
reload={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":82), Object(InputEventJoypadButton,"button_index":2)] ; R / PS4 Square
}
interact_nucleo={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":70), Object(InputEventJoypadButton,"button_index":11)] ; F / PS4 D-Pad Down
}
buy_menu={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":66), Object(InputEventJoypadButton,"button_index":12)] ; B / PS4 D-Pad Left
}
scoreboard={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":4194306), Object(InputEventJoypadButton,"button_index":14)] ; Tab / PS4 Touchpad
}
ability_1={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":67), Object(InputEventJoypadButton,"button_index":9)] ; C / PS4 L1
}
ability_2={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":88), Object(InputEventJoypadButton,"button_index":10)] ; X / PS4 R1
}
ability_ultimate={
  "deadzone": 0.5,
  "events": [Object(InputEventKey,"keycode":90)] ; Z
}
quick_ping={
  "deadzone": 0.5,
  "events": [Object(InputEventMouseButton,"button_index":3), Object(InputEventJoypadButton,"button_index":13)] ; Middle Click / PS4 D-Pad Up
}
`
  },

  // 2. AUTOLOAD: GAME STATE
  {
    path: 'autoload/game_state.gd',
    category: 'autoload',
    description: 'Controlador de estado de la partida: rondas (13 para ganar), economía, fase de compra y cambio de bando',
    content: `extends Node
# OPERACIÓN VÉRTICE - GameState Autoload (Godot 4.3)

signal round_phase_changed(phase: String)
signal scores_updated(amber_score: int, cyan_score: int)
signal economy_updated(player_credits: int)
signal nucleo_state_changed(state: String, site: String)
signal match_finished(winning_team: String)

enum Team { AMBER, CYAN }
enum Phase { BUY_PHASE, COMBAT, NUCLEO_PLANTED, ROUND_ENDED, HALFTIME, MATCH_OVER }

const ROUNDS_TO_WIN: int = 13
const HALFTIME_ROUND: int = 12
const BUY_TIME_SECONDS: float = 20.0
const ROUND_TIME_SECONDS: float = 100.0
const NUCLEO_DETONATION_TIME: float = 40.0
const NUCLEO_DEFUSE_TIME: float = 7.0

var current_round: int = 1
var score_amber: int = 0
var score_cyan: int = 0
var current_phase: Phase = Phase.BUY_PHASE
var phase_timer: float = BUY_TIME_SECONDS

var nucleo_is_planted: boolean = false
var nucleo_site: String = ""
var nucleo_defuse_progress: float = 0.0

var consecutive_losses_amber: int = 0
var consecutive_losses_cyan: int = 0

var player_team: Team = Team.AMBER
var player_credits: int = 800
var player_ultimate_points: int = 0
var player_ultimate_max: int = 7

func _ready() -> void:
	reset_match()

func _process(delta: float) -> void:
	if current_phase == Phase.MATCH_OVER:
		return
		
	if phase_timer > 0.0:
		phase_timer -= delta
		if phase_timer <= 0.0:
			_on_phase_timer_expired()

func reset_match() -> void:
	current_round = 1
	score_amber = 0
	score_cyan = 0
	consecutive_losses_amber = 0
	consecutive_losses_cyan = 0
	player_credits = 800
	player_ultimate_points = 0
	_start_buy_phase()

func _start_buy_phase() -> void:
	current_phase = Phase.BUY_PHASE
	phase_timer = BUY_TIME_SECONDS
	nucleo_is_planted = false
	nucleo_defuse_progress = 0.0
	nucleo_site = ""
	emit_signal("round_phase_changed", "BUY")
	emit_signal("economy_updated", player_credits)

func start_combat_phase() -> void:
	current_phase = Phase.COMBAT
	phase_timer = ROUND_TIME_SECONDS
	emit_signal("round_phase_changed", "COMBAT")
	AudioManager.play_voice_line("announcer_round_start")

func plant_nucleo(site: String) -> void:
	if current_phase != Phase.COMBAT or nucleo_is_planted:
		return
	nucleo_is_planted = true
	nucleo_site = site
	current_phase = Phase.NUCLEO_PLANTED
	phase_timer = NUCLEO_DETONATION_TIME
	emit_signal("nucleo_state_changed", "PLANTED", site)
	emit_signal("round_phase_changed", "NUCLEO_PLANTED")
	AudioManager.play_voice_line("announcer_nucleo_planted")

func defuse_nucleo() -> void:
	if not nucleo_is_planted or current_phase != Phase.NUCLEO_PLANTED:
		return
	nucleo_is_planted = false
	current_phase = Phase.ROUND_ENDED
	phase_timer = 5.0
	_award_round_win(Team.CYAN, "DEFUSED")
	emit_signal("nucleo_state_changed", "DEFUSED", nucleo_site)
	AudioManager.play_voice_line("announcer_nucleo_defused")

func _on_phase_timer_expired() -> void:
	match current_phase:
		Phase.BUY_PHASE:
			start_combat_phase()
		Phase.COMBAT:
			# Si se agota el tiempo de combate sin plantar, gana la defensa (Cian)
			_award_round_win(Team.CYAN, "TIME_OUT")
		Phase.NUCLEO_PLANTED:
			# Detonación del núcleo: gana el ataque (Ámbar)
			AudioManager.play_sfx_3d("nucleo_explosion", Vector3.ZERO)
			_award_round_win(Team.AMBER, "DETONATED")
		Phase.ROUND_ENDED:
			_advance_round()

func _award_round_win(winning_team: Team, reason: String) -> void:
	current_phase = Phase.ROUND_ENDED
	phase_timer = 5.0
	
	if winning_team == Team.AMBER:
		score_amber += 1
		consecutive_losses_cyan += 1
		consecutive_losses_amber = 0
		if player_team == Team.AMBER:
			add_credits(3000)
			add_ultimate_point()
		else:
			add_credits(_calculate_loss_bonus(consecutive_losses_cyan))
	else:
		score_cyan += 1
		consecutive_losses_amber += 1
		consecutive_losses_cyan = 0
		if player_team == Team.CYAN:
			add_credits(3000)
			add_ultimate_point()
		else:
			add_credits(_calculate_loss_bonus(consecutive_losses_amber))
			
	emit_signal("scores_updated", score_amber, score_cyan)
	emit_signal("round_phase_changed", "ROUND_ENDED")

func _calculate_loss_bonus(loss_streak: int) -> int:
	match clamp(loss_streak, 1, 4):
		1: return 1900
		2: return 2400
		3: return 2900
		_: return 3400

func add_credits(amount: int) -> void:
	player_credits = clamp(player_credits + amount, 0, 9000)
	emit_signal("economy_updated", player_credits)

func spend_credits(amount: int) -> bool:
	if player_credits >= amount:
		player_credits -= amount
		emit_signal("economy_updated", player_credits)
		return true
	return false

func add_ultimate_point() -> void:
	if player_ultimate_points < player_ultimate_max:
		player_ultimate_points += 1

func _advance_round() -> void:
	if score_amber >= ROUNDS_TO_WIN:
		current_phase = Phase.MATCH_OVER
		emit_signal("match_finished", "AMBER")
		return
	elif score_cyan >= ROUNDS_TO_WIN:
		current_phase = Phase.MATCH_OVER
		emit_signal("match_finished", "CYAN")
		return
		
	current_round += 1
	if current_round == HALFTIME_ROUND + 1:
		# Cambio de bando
		player_team = Team.CYAN if player_team == Team.AMBER else Team.AMBER
		player_credits = 800
		
	_start_buy_phase()
`
  },

  // 3. FIRST-PERSON PLAYER CONTROLLER SCRIPT
  {
    path: 'scripts/player/player_controller.gd',
    category: 'player',
    description: 'Controlador FPS táctico: movimiento, inclinación Q/E, hitscan raycast, retroceso aprendible y vibración PS4',
    content: `extends CharacterBody3D
# OPERACIÓN VÉRTICE - Player Controller (Godot 4.3)
class_name PlayerController

@export_category("Movement")
@export var speed_walk: float = 3.2
@export var speed_run: float = 5.4
@export var speed_crouch: float = 2.1
@export var jump_velocity: float = 4.2
@export var gravity: float = 14.0
@export var acceleration: float = 18.0
@export var friction: float = 12.0

@export_category("Tactical Lean")
@export var lean_angle_deg: float = 14.0
@export var lean_offset_x: float = 0.45
@export var lean_speed: float = 8.0

@export_category("Look & Aim")
@export var mouse_sensitivity: float = 0.002
@export var gamepad_stick_sensitivity: float = 2.4
@export var gamepad_deadzone: float = 0.15

@onready var head: Node3D = $Head
@onready var camera: Camera3D = $Head/Camera3D
@onready var weapon_manager: Node3D = $Head/Camera3D/WeaponManager
@onready var hitscan_raycast: RayCast3D = $Head/Camera3D/HitscanRaycast

var current_speed: float = speed_run
var is_crouching: boolean = false
var is_silent_walking: boolean = false
var current_lean: float = 0.0 # -1 (left), 0 (center), 1 (right)

var current_recoil: Vector2 = Vector2.ZERO
var target_recoil: Vector2 = Vector2.ZERO
var spread_angle: float = 0.0

var health: float = 100.0
var max_health: float = 100.0
var armor: float = 50.0
var max_armor: float = 50.0

func _ready() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		var yaw = -event.relative.x * mouse_sensitivity
		var pitch = -event.relative.y * mouse_sensitivity
		rotate_y(yaw)
		head.rotate_x(pitch)
		head.rotation.x = clamp(head.rotation.x, deg_to_rad(-88), deg_to_rad(88))

func _physics_process(delta: float) -> void:
	_handle_gamepad_look(delta)
	_handle_movement(delta)
	_handle_lean(delta)
	_recover_recoil(delta)
	_update_spread_state()

func _handle_gamepad_look(delta: float) -> void:
	var r_stick_x = Input.get_joy_axis(0, JOY_AXIS_RIGHT_X)
	var r_stick_y = Input.get_joy_axis(0, JOY_AXIS_RIGHT_Y)
	
	if abs(r_stick_x) > gamepad_deadzone:
		rotate_y(-sign(r_stick_x) * pow(abs(r_stick_x), 1.5) * gamepad_stick_sensitivity * delta)
	if abs(r_stick_y) > gamepad_deadzone:
		var pitch_delta = -sign(r_stick_y) * pow(abs(r_stick_y), 1.5) * gamepad_stick_sensitivity * delta
		head.rotate_x(pitch_delta)
		head.rotation.x = clamp(head.rotation.x, deg_to_rad(-88), deg_to_rad(88))

func _handle_movement(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= gravity * delta

	# Agacharse y caminar sigiloso
	is_crouching = Input.is_action_pressed("crouch")
	is_silent_walking = Input.is_action_pressed("walk_silent")
	
	if is_crouching:
		current_speed = speed_crouch
		head.position.y = lerp(head.position.y, 1.1, delta * 10.0)
	else:
		head.position.y = lerp(head.position.y, 1.7, delta * 10.0)
		current_speed = speed_walk if is_silent_walking else speed_run

	# Salto
	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = jump_velocity

	# Dirección en el plano XZ
	var input_dir = Input.get_vector("move_left", "move_right", "move_forward", "move_backward")
	var direction = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()

	if direction != Vector3.ZERO:
		velocity.x = lerp(velocity.x, direction.x * current_speed, acceleration * delta)
		velocity.z = lerp(velocity.z, direction.z * current_speed, acceleration * delta)
		if is_on_floor() and not is_silent_walking:
			AudioManager.trigger_footstep(global_position)
	else:
		velocity.x = lerp(velocity.x, 0.0, friction * delta)
		velocity.z = lerp(velocity.z, 0.0, friction * delta)

	move_and_slide()

func _handle_lean(delta: float) -> void:
	var target_lean = 0.0
	if Input.is_action_pressed("lean_left"):
		target_lean -= 1.0
	if Input.is_action_pressed("lean_right"):
		target_lean += 1.0
		
	current_lean = lerp(current_lean, target_lean, lean_speed * delta)
	camera.rotation.z = deg_to_rad(-current_lean * lean_angle_deg)
	camera.position.x = current_lean * lean_offset_x

func fire_shot(weapon_data: Dictionary) -> void:
	# Aplicar retroceso programado
	var pattern = weapon_data.get("recoil_pattern", [Vector2(0, 0.03)])
	var recoil_step = pattern[randi() % pattern.size()]
	target_recoil += recoil_step
	
	# Vibración DualShock 4
	Input.start_joy_vibration(0, 0.4, 0.2, 0.08)
	
	# Raycast hitscan
	hitscan_raycast.target_position = Vector3(0, 0, -weapon_data.effective_range)
	# Desviación por dispersión
	var spread_offset = Vector3(
		randf_range(-spread_angle, spread_angle),
		randf_range(-spread_angle, spread_angle),
		0
	)
	hitscan_raycast.target_position += spread_offset * weapon_data.effective_range
	hitscan_raycast.force_raycast_update()
	
	if hitscan_raycast.is_colliding():
		var collider = hitscan_raycast.get_collider()
		var hit_point = hitscan_raycast.get_collision_point()
		var hit_normal = hitscan_raycast.get_collision_normal()
		_process_bullet_hit(collider, hit_point, hit_normal, weapon_data)

func _process_bullet_hit(collider: Object, point: Vector3, normal: Vector3, weapon_data: Dictionary) -> void:
	if collider.is_in_group("OperativeHitbox"):
		var multiplier = 1.0
		var is_headshot = false
		if collider.name.contains("Head"):
			multiplier = 2.5
			is_headshot = true
			AudioManager.play_sfx("headshot_dink")
		elif collider.name.contains("Legs"):
			multiplier = 0.75
			AudioManager.play_sfx("hit_impact")
		else:
			AudioManager.play_sfx("hit_impact")
			
		var total_damage = weapon_data.damage_torso * multiplier
		collider.get_parent().receive_damage(total_damage, is_headshot)
	else:
		# Impacto en pared/suelo
		weapon_manager.spawn_bullet_decal(point, normal)

func _recover_recoil(delta: float) -> void:
	current_recoil = lerp(current_recoil, target_recoil, delta * 18.0)
	target_recoil = lerp(target_recoil, Vector2.ZERO, delta * 5.0)
	head.rotation.x += current_recoil.y * delta
	rotate_y(-current_recoil.x * delta)

func _update_spread_state() -> void:
	if not is_on_floor():
		spread_angle = 0.12 # Nula precisión en el aire
	elif velocity.length() > speed_walk + 0.5:
		spread_angle = 0.06 # Muy baja en carrera
	elif velocity.length() > 0.2:
		spread_angle = 0.02 # Media al caminar
	elif is_crouching:
		spread_angle = 0.001 # Máxima precisión agachado
	else:
		spread_angle = 0.004 # Parado

func receive_damage(amount: float, is_headshot: boolean) -> void:
	Input.start_joy_vibration(0, 0.8, 0.8, 0.2)
	var damage_to_armor = min(armor, amount * 0.66)
	armor -= damage_to_armor
	var damage_to_health = amount - damage_to_armor
	health -= damage_to_health
	
	if health <= 0.0:
		die()

func die() -> void:
	health = 0.0
	weapon_manager.drop_current_weapon()
	$HUD.show_death_screen()
`
  },

  // 4. WEAPON DATABASE RESOURCE
  {
    path: 'scripts/weapons/weapon_database.gd',
    category: 'weapons',
    description: 'Definición de las 14 armas tácticas originales con cadencias, retrocesos fijos y precios en GDScript',
    content: `extends Node
# OPERACIÓN VÉRTICE - Weapon Database (Godot 4.3)

const WEAPONS = {
	# PISTOLAS (3)
	"pistol_c12": {
		"name": "C-12 Compacta",
		"category": "sidearm",
		"price": 0,
		"damage_torso": 26,
		"fire_rate": 5.5,
		"magazine_size": 12,
		"reserve_ammo": 36,
		"reload_time": 1.4,
		"penetration": "LOW",
		"effective_range": 25.0,
		"recoil_pattern": [Vector2(0, 0.025), Vector2(0.01, 0.04), Vector2(-0.01, 0.06)]
	},
	"pistol_vortice": {
		"name": "Vórtice .45",
		"category": "sidearm",
		"price": 800,
		"damage_torso": 55,
		"fire_rate": 2.8,
		"magazine_size": 6,
		"reserve_ammo": 24,
		"reload_time": 1.8,
		"penetration": "MEDIUM",
		"effective_range": 35.0,
		"recoil_pattern": [Vector2(0, 0.08), Vector2(-0.02, 0.12), Vector2(0.03, 0.15)]
	},
	"pistol_sombra": {
		"name": "Sombra Silenciada",
		"category": "sidearm",
		"price": 450,
		"damage_torso": 28,
		"fire_rate": 6.2,
		"magazine_size": 15,
		"reserve_ammo": 45,
		"reload_time": 1.5,
		"penetration": "LOW",
		"effective_range": 28.0,
		"recoil_pattern": [Vector2(0, 0.02), Vector2(0.005, 0.035)]
	},

	# SUBFUSILES (2)
	"smg_rafaga9": {
		"name": "Ráfaga-9",
		"category": "smg",
		"price": 1500,
		"damage_torso": 24,
		"fire_rate": 13.0,
		"magazine_size": 30,
		"reserve_ammo": 90,
		"reload_time": 1.9,
		"penetration": "LOW",
		"effective_range": 22.0,
		"recoil_pattern": [Vector2(0, 0.03), Vector2(0.01, 0.05), Vector2(0.02, 0.08), Vector2(-0.02, 0.11)]
	},
	"smg_avispa": {
		"name": "Avispa Vector",
		"category": "smg",
		"price": 1750,
		"damage_torso": 27,
		"fire_rate": 11.5,
		"magazine_size": 25,
		"reserve_ammo": 75,
		"reload_time": 1.7,
		"penetration": "MEDIUM",
		"effective_range": 28.0,
		"recoil_pattern": [Vector2(0, 0.02), Vector2(0.005, 0.04), Vector2(-0.01, 0.06)]
	},

	# FUSILES DE ASALTO (3)
	"rifle_elite24": {
		"name": "Élite-24",
		"category": "rifle",
		"price": 2900,
		"damage_torso": 40,
		"fire_rate": 9.2,
		"magazine_size": 25,
		"reserve_ammo": 75,
		"reload_time": 2.3,
		"penetration": "MEDIUM",
		"effective_range": 50.0,
		"recoil_pattern": [
			Vector2(0, 0.04), Vector2(0.01, 0.08), Vector2(0.02, 0.12),
			Vector2(-0.01, 0.16), Vector2(-0.03, 0.19), Vector2(0.03, 0.22)
		]
	},
	"rifle_fantasma": {
		"name": "Fantasma-AR",
		"category": "rifle",
		"price": 2900,
		"damage_torso": 38,
		"fire_rate": 10.5,
		"magazine_size": 30,
		"reserve_ammo": 90,
		"reload_time": 2.1,
		"penetration": "MEDIUM",
		"effective_range": 45.0,
		"recoil_pattern": [Vector2(0, 0.03), Vector2(0.005, 0.06), Vector2(-0.015, 0.09)]
	},
	"rifle_baluarte": {
		"name": "Baluarte Pesado",
		"category": "rifle",
		"price": 3200,
		"damage_torso": 48,
		"fire_rate": 7.5,
		"magazine_size": 20,
		"reserve_ammo": 60,
		"reload_time": 2.5,
		"penetration": "HIGH",
		"effective_range": 60.0,
		"recoil_pattern": [Vector2(0, 0.06), Vector2(-0.01, 0.11), Vector2(0.02, 0.16)]
	},

	# ESCOPETAS (2)
	"shotgun_quebrador": {
		"name": "Quebrador-12",
		"category": "shotgun",
		"price": 1100,
		"damage_torso": 110,
		"fire_rate": 1.2,
		"magazine_size": 5,
		"reserve_ammo": 20,
		"reload_time": 2.6,
		"penetration": "LOW",
		"effective_range": 15.0,
		"recoil_pattern": [Vector2(0, 0.14)]
	},
	"shotgun_ciclon": {
		"name": "Ciclón Auto",
		"category": "shotgun",
		"price": 1800,
		"damage_torso": 90,
		"fire_rate": 3.5,
		"magazine_size": 8,
		"reserve_ammo": 24,
		"reload_time": 2.8,
		"penetration": "MEDIUM",
		"effective_range": 18.0,
		"recoil_pattern": [Vector2(0, 0.09), Vector2(0.02, 0.13)]
	},

	# FRANCOTIRADORES (2)
	"sniper_ojohalcon": {
		"name": "Ojo de Halcón",
		"category": "sniper",
		"price": 2200,
		"damage_torso": 85,
		"fire_rate": 1.5,
		"magazine_size": 5,
		"reserve_ammo": 15,
		"reload_time": 2.4,
		"penetration": "MEDIUM",
		"effective_range": 80.0,
		"recoil_pattern": [Vector2(0, 0.15)]
	},
	"sniper_vertice": {
		"name": "Vértice Pesado",
		"category": "sniper",
		"price": 4700,
		"damage_torso": 150,
		"fire_rate": 0.75,
		"magazine_size": 5,
		"reserve_ammo": 10,
		"reload_time": 3.5,
		"penetration": "HIGH",
		"effective_range": 100.0,
		"recoil_pattern": [Vector2(0, 0.28)]
	},

	# AMETRALLADORA LIGERA (1)
	"lmg_titan": {
		"name": "Titán LMG",
		"category": "heavy",
		"price": 3400,
		"damage_torso": 36,
		"fire_rate": 12.0,
		"magazine_size": 100,
		"reserve_ammo": 200,
		"reload_time": 4.8,
		"penetration": "HIGH",
		"effective_range": 50.0,
		"recoil_pattern": [Vector2(0, 0.05), Vector2(0.01, 0.09), Vector2(-0.02, 0.13), Vector2(0.03, 0.17)]
	},

	# CUCHILLO
	"knife_carbon": {
		"name": "Hoja de Carbón",
		"category": "melee",
		"price": 0,
		"damage_torso": 50,
		"fire_rate": 1.8,
		"magazine_size": 1,
		"reserve_ammo": 1,
		"reload_time": 0.0,
		"penetration": "LOW",
		"effective_range": 3.0,
		"recoil_pattern": [Vector2.ZERO]
	}
}

func get_weapon(weapon_id: String) -> Dictionary:
	return WEAPONS.get(weapon_id, WEAPONS["pistol_c12"])
`
  },

  // 5. BOT AI CONTROLLER SCRIPT
  {
    path: 'scripts/ai/bot_controller.gd',
    category: 'ai',
    description: 'Inteligencia artificial táctica: máquina de estados, navegación por NavMesh, toma de cobertura, pre-aim y plantado/defuse',
    content: `extends CharacterBody3D
# OPERACIÓN VÉRTICE - Tactical Bot AI (Godot 4.3)
class_name TacticalBot

enum State { PATROL, PEEK_CORNER, ENGAGE, TAKE_COVER, PLANT_NUCLEO, DEFUSE_NUCLEO }

@export var bot_team: GameState.Team = GameState.Team.CYAN
@export var difficulty: int = 2 # 1=Novato, 2=Táctico, 3=Élite
@export var target_site: String = "A"

@onready var nav_agent: NavigationAgent3D = $NavigationAgent3D
@onready var sight_raycast: RayCast3D = $SightRaycast
@onready var head: Node3D = $Head

var current_state: State = State.PATROL
var target_player: Node3D = null
var current_health: float = 100.0
var has_nucleo: boolean = false
var shoot_timer: float = 0.0

func _ready() -> void:
	nav_agent.velocity_computed.connect(_on_velocity_computed)
	_choose_objective()

func _physics_process(delta: float) -> void:
	match current_state:
		State.PATROL:
			_process_patrol(delta)
		State.ENGAGE:
			_process_engage(delta)
		State.TAKE_COVER:
			_process_cover(delta)
		State.PLANT_NUCLEO:
			_process_plant(delta)
		State.DEFUSE_NUCLEO:
			_process_defuse(delta)

func _process_patrol(delta: float) -> void:
	if nav_agent.is_navigation_finished():
		if has_nucleo and bot_team == GameState.Team.AMBER:
			current_state = State.PLANT_NUCLEO
		else:
			current_state = State.PEEK_CORNER
		return
		
	var next_path_pos = nav_agent.get_next_path_position()
	var dir = (next_path_pos - global_position).normalized()
	dir.y = 0
	nav_agent.set_velocity(dir * 3.8)
	
	_scan_for_enemies()

func _process_engage(delta: float) -> void:
	if not is_instance_valid(target_player):
		current_state = State.PATROL
		return
		
	var to_target = (target_player.global_position - global_position).normalized()
	look_at(Vector3(target_player.global_position.x, global_position.y, target_player.global_position.z))
	
	shoot_timer -= delta
	if shoot_timer <= 0.0:
		_shoot_at_target()
		shoot_timer = 0.15 + (3 - difficulty) * 0.1

func _shoot_at_target() -> void:
	var accuracy = 0.85 if difficulty == 3 else (0.65 if difficulty == 2 else 0.45)
	if randf() <= accuracy:
		target_player.receive_damage(35.0, randf() < 0.25)
	AudioManager.play_sfx_3d("rifle_fire", global_position)

func _scan_for_enemies() -> void:
	var potential_targets = get_tree().get_nodes_in_group("Players")
	for player in potential_targets:
		if player.team != bot_team and global_position.distance_to(player.global_position) < 30.0:
			sight_raycast.target_position = sight_raycast.to_local(player.global_position)
			sight_raycast.force_raycast_update()
			if not sight_raycast.is_colliding() or sight_raycast.get_collider() == player:
				target_player = player
				current_state = State.ENGAGE
				return

func _process_plant(delta: float) -> void:
	GameState.plant_nucleo(target_site)
	has_nucleo = false
	current_state = State.TAKE_COVER

func _process_defuse(delta: float) -> void:
	GameState.defuse_nucleo()
	current_state = State.PATROL

func _on_velocity_computed(safe_velocity: Vector3) -> void:
	velocity = safe_velocity
	move_and_slide()

func _choose_objective() -> void:
	var target_pos = Vector3.ZERO
	if bot_team == GameState.Team.AMBER:
		target_pos = Vector3(-24, 0, 20) if target_site == "A" else Vector3(24, 0, 20)
	else:
		target_pos = Vector3(-24, 0, 18) if target_site == "A" else Vector3(24, 0, 18)
	nav_agent.target_position = target_pos

func receive_damage(amount: float, is_headshot: boolean) -> void:
	current_health -= amount
	if current_health <= 0.0:
		queue_free()
`
  },

  // 6. TACTICAL CEL-SHADING SHADER
  {
    path: 'shaders/cel_shading_tactical.gdshader',
    category: 'shaders',
    description: 'Shader de estilo tecnotáctico estilizado con realce de bordes para silueta clara y distinción de bandos',
    content: `shader_type spatial;
render_mode diffuse_toon, specular_toon;

uniform vec4 team_color : source_color = vec4(0.02, 0.72, 0.83, 1.0); // Cian o Ámbar
uniform float roughness_val : hint_range(0.0, 1.0) = 0.35;
uniform float metallic_val : hint_range(0.0, 1.0) = 0.2;
uniform float rim_threshold : hint_range(0.0, 1.0) = 0.6;
uniform vec4 outline_color : source_color = vec4(0.0, 0.0, 0.0, 1.0);

void fragment() {
	ALBEDO = team_color.rgb;
	ROUGHNESS = roughness_val;
	METALLIC = metallic_val;
	
	// Realce de silueta perimetral para visibilidad táctica
	float fresnel = 1.0 - dot(NORMAL, VIEW);
	if (fresnel > rim_threshold) {
		EMISSION = team_color.rgb * 0.45;
	}
}

void light() {
	// Difuso escalonado toon de 2 bandas para legibilidad nítida
	float NdotL = dot(NORMAL, LIGHT);
	float toon_diffuse = smoothstep(0.0, 0.05, NdotL);
	DIFFUSE_LIGHT += LIGHT_COLOR * ALBEDO * toon_diffuse * ATTENUATION;
}
`
  },

  // 7. EXPORT GUIDE
  {
    path: 'EXPORT_GUIDE.md',
    category: 'docs',
    description: 'Guía completa paso a paso para abrir en Godot 4.3 y exportar a Windows ejecutable (.exe)',
    content: `# GUÍA DE COMPILACIÓN Y EXPORTACIÓN A WINDOWS (.EXE) - OPERACIÓN VÉRTICE

Este proyecto está configurado para **Godot Engine 4.3 (o superior)** con Forward+ Renderer.

## 1. Requisitos Previos
1. Descarga **Godot Engine 4.3 Estándar** para Windows desde [godotengine.org](https://godotengine.org).
2. Descarga las **Plantillas de Exportación (Export Templates)** oficiales dentro de Godot:
   - Menú: *Editor* -> *Administrar plantillas de exportación* -> *Descargar e instalar*.

## 2. Abrir el Proyecto
1. Extrae todos los archivos del proyecto en una carpeta dedicada (ej. \`C:/Juegos/OperacionVertice/\`).
2. Abre Godot Engine y haz clic en **Importar**.
3. Selecciona el archivo \`project.godot\` de la carpeta raíz y pulsa **Importar y Editar**.
4. Godot compilará automáticamente las mallas y shaders en unos segundos.

## 3. Controles Predeterminados
- **Teclado y Ratón**:
  - \`WASD\`: Moverse
  - \`Ratón\`: Apuntar
  - \`Clic Izquierdo\`: Disparar
  - \`Clic Derecho\`: Apuntar por mira (ADS)
  - \`Q / E\`: Inclinarse a izquierda / derecha
  - \`Shift\`: Caminar sigiloso (sin sonido)
  - \`Ctrl\`: Agacharse
  - \`Espacio\`: Saltar
  - \`R\`: Recargar
  - \`B\`: Menú de compra en fase de compra
  - \`F\`: Plantar o desactivar el Núcleo
  - \`C / X\`: Habilidades básicas
  - \`Z\`: Habilidad definitiva
  - \`Tab\`: Marcador táctico
  - \`F3\`: Consola de depuración (FPS, Ping, NavMesh)

- **Mando de PS4 (DualShock 4)**:
  - \`Stick Izquierdo\`: Moverse
  - \`Stick Derecho\`: Apuntar
  - \`R2\`: Disparar (con vibración)
  - \`L2\`: Apuntar por mira
  - \`Cruz (X)\`: Saltar
  - \`Círculo (O)\`: Agacharse
  - \`Cuadrado (□)\`: Recargar
  - \`L1 / R1\`: Habilidades
  - \`D-Pad Abajo\`: Plantar / Desactivar
  - \`D-Pad Izquierda\`: Menú de compra
  - \`Touchpad\`: Marcador

## 4. Exportar a Windows Ejecutable (.exe)
1. En Godot, ve a: *Proyecto* -> *Exportar...*
2. Haz clic en **Añadir...** y selecciona **Windows Desktop**.
3. En la pestaña derecha:
   - **Nombre de archivo ejecutable**: \`OperacionVertice.exe\`
   - **Modo de consola**: Desactivado (o activado para ver logs).
   - **Arquitectura**: x86_64.
4. Haz clic en **Exportar proyecto...**, elige la carpeta de destino y presiona **Guardar**.
5. ¡El ejecutable \`OperacionVertice.exe\` y su archivo \`.pck\` estarán listos para distribuir!
`
  }
];
