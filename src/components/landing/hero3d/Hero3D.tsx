"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  Sparkles,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createTotemTexture } from "./totemTexture";

/* ================================================================== */
/*  Hero3D — canvas full-bleed atrás do conteúdo da hero. Tablet       */
/*  (totem Visage, relógio ao vivo desenhado na textura) e laptop      */
/*  (Tool Tracker Dashboard) trocam de posição a cada passo; o de trás */
/*  se funde ao fundo via fog (barato — sem pós-processamento, que     */
/*  derrubava nitidez e performance).                                  */
/* ================================================================== */

const TABLET_URL = "/models/tablet.glb";
const LAPTOP_URL = "/models/laptop.glb";
const LAPTOP_SCREEN_URL = "/landing/laptop-screen.png";
const DEVICE_RADIUS = 0.85;
const CAMERA_POS: [number, number, number] = [0, 0.35, 6.6];

useGLTF.preload(TABLET_URL);
useGLTF.preload(LAPTOP_URL);

type Rule = [RegExp, THREE.Material];

function applyMaterials(root: THREE.Object3D, rules: Rule[], fallback: THREE.Material) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const name = `${mesh.name} ${mesh.parent?.name ?? ""}`.toLowerCase();
    const rule = rules.find(([re]) => re.test(name));
    mesh.material = rule ? rule[1] : fallback;
    if (/glass|reflection/.test(name)) mesh.renderOrder = 10;
  });
}

/** Escala o modelo para `height` e centraliza o bounding box na origem. */
function useNormalized(scene: THREE.Object3D, height: number) {
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = height / size.y;
    return {
      scale: s,
      position: [-center.x * s, -center.y * s, -center.z * s] as const,
    };
  }, [scene, height]);
}

/* ------------------------------------------------------------------ */
/*  Materiais compartilhados (tablet)                                  */
/* ------------------------------------------------------------------ */

function useSharedMaterials() {
  return useMemo(() => {
    // DoubleSide: as malhas vindas do OBJ são "cascas" de face única
    const navyBody = new THREE.MeshStandardMaterial({
      color: "#233c6e",
      metalness: 0.55,
      roughness: 0.42,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide,
    });
    const bezel = new THREE.MeshStandardMaterial({
      color: "#060b16",
      metalness: 0.6,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const alu = new THREE.MeshStandardMaterial({
      color: "#b9c8e2",
      metalness: 1,
      roughness: 0.22,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide,
    });
    const port = new THREE.MeshStandardMaterial({
      color: "#04070d",
      metalness: 0.5,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    const lens = new THREE.MeshStandardMaterial({
      color: "#0a1020",
      metalness: 0.9,
      roughness: 0.08,
      envMapIntensity: 1.6,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0,
      roughness: 0.06,
      transparent: true,
      opacity: 0.1,
      envMapIntensity: 1.8,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return { navyBody, bezel, alu, port, lens, glass };
  }, []);
}

type Shared = ReturnType<typeof useSharedMaterials>;

/* ------------------------------------------------------------------ */
/*  Tablet — totem Visage com relógio ao vivo                          */
/* ------------------------------------------------------------------ */

const TABLET_HEIGHT = 2.15;

function Tablet({ shared, reduced }: { shared: Shared; reduced: boolean }) {
  const { scene } = useGLTF(TABLET_URL);
  const group = useRef<THREE.Group>(null!);

  const totem = useMemo(createTotemTexture, []);
  useEffect(() => () => totem.dispose(), [totem]);

  const screenMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: totem.texture,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    [totem],
  );

  useMemo(() => {
    applyMaterials(
      scene,
      [
        [/^screen/, screenMat],
        [/lens_glass|camera_lens|lens_iris|front_camera_lens|front_camera_well|flash|ambient_sensor/, shared.lens],
        [/cover_glass|glass_reflection/, shared.glass],
        [/lens_ring|front_camera_ring|volume_button|power_button|antenna_band|chamfer_band/, shared.alu],
        [/speaker_hole|usb_c_port|mic/, shared.port],
        [/display_plate/, shared.bezel],
      ],
      shared.navyBody,
    );
  }, [scene, screenMat, shared]);

  const { scale, position } = useNormalized(scene, TABLET_HEIGHT);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.25) * 0.06;
    group.current.rotation.z = Math.sin(t * 0.6) * 0.014;
  });

  return (
    <group position={[0, 0, DEVICE_RADIUS]}>
      <group ref={group}>
        <group scale={scale} position={position as unknown as THREE.Vector3}>
          <primitive object={scene} />
        </group>
        {/* brilho discreto projetado pela tela */}
        <pointLight position={[0, 0.2, 0.7]} color="#dfe9ff" intensity={2.2} distance={2.4} decay={2} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Laptop EC-0002 — Tool Tracker Dashboard na tela                    */
/* ------------------------------------------------------------------ */

function Laptop({ reduced }: { reduced: boolean }) {
  const { scene } = useGLTF(LAPTOP_URL);
  const group = useRef<THREE.Group>(null!);

  const screenTex = useTexture(LAPTOP_SCREEN_URL, (t) => {
    t.flipY = false; // UVs vêm de glTF (V com origem no topo)
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });

  const screenMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: screenTex,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    [screenTex],
  );

  const openNode = useMemo(() => {
    let open: THREE.Object3D = scene;
    scene.traverse((obj) => {
      const n = obj.name.toLowerCase();
      // só o laptop aberto entra em cena
      if (n.includes("closed")) obj.visible = false;
      if (n.includes("open") && open === scene) open = obj;
    });
    // troca os materiais pelo nome vindo do MTL
    const overlayGlass = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0,
      roughness: 0.08,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    });
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.Material;
      const matName = (mat?.name ?? "").toLowerCase();
      if (matName.startsWith("image")) {
        mesh.material = screenMat;
      } else if (matName.startsWith("screen_grey")) {
        // moldura da tela — mantém
      } else if (matName.startsWith("screen")) {
        // lâmina de vidro à frente do painel
        mesh.material = overlayGlass;
        mesh.renderOrder = 10;
      } else if (matName.startsWith("laptop") || matName.startsWith("_spaeaker")) {
        // plástico claro do modelo → alumínio grafite (o dorso branco
        // brilhava demais quando o laptop fica ao fundo)
        const std = mat as THREE.MeshStandardMaterial;
        std.color.set("#6b7488");
        std.metalness = 0.7;
        std.roughness = 0.42;
        std.envMapIntensity = 1.1;
      } else if (matName.startsWith("track_pad")) {
        (mat as THREE.MeshStandardMaterial).color.set("#565f74");
      }
    });
    return open;
  }, [scene, screenMat]);

  const { scale, position } = useNormalized(openNode, 1.8);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.05 + 2.1) * 0.05;
    group.current.rotation.z = Math.sin(t * 0.5 + 1.2) * 0.008;
  });

  return (
    <group position={[0, 0, -DEVICE_RADIUS]} rotation-y={Math.PI}>
      <group ref={group}>
        <group scale={scale} position={position as unknown as THREE.Vector3}>
          <primitive object={scene} />
        </group>
        <pointLight position={[0, 0.3, 0.9]} color="#cfe2ff" intensity={2.5} distance={2.6} decay={2} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Turntable (invisível — só a rotação; a "plataforma" é metáfora)    */
/* ------------------------------------------------------------------ */

function Turntable({
  step,
  reduced,
  yawOffset,
}: {
  step: number;
  reduced: boolean;
  /** alinha o eixo frente↔trás do carrossel com a câmera (o de trás
      fica escondido atrás do da frente, em vez de aparecer ao lado) */
  yawOffset: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const shared = useSharedMaterials();

  useFrame((_, delta) => {
    const target = step * Math.PI + yawOffset;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      target,
      2.8,
      delta,
    );
  });

  return (
    <group ref={group}>
      <Tablet shared={shared} reduced={reduced} />
      <Laptop reduced={reduced} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Palco — desloca para a direita em telas largas, para baixo no      */
/*  mobile (o canvas cobre o painel inteiro)                           */
/* ------------------------------------------------------------------ */

function StageRig({ step, reduced }: { step: number; reduced: boolean }) {
  const { viewport } = useThree();
  const wide = viewport.aspect > 1.05;
  /* mobile: palco menor (o laptop precisa caber na largura do viewport)
     e no terço inferior do painel */
  const stageScale = wide ? 1 : Math.min(0.5, viewport.width / 3.2);
  const x = wide ? viewport.width * 0.19 : 0;
  const y = wide ? -0.08 : -1.0;
  const yawOffset = Math.atan2(CAMERA_POS[0] - x, CAMERA_POS[2]);

  return (
    <group position={[x, y, 0]} scale={stageScale}>
      <Float
        speed={reduced ? 0 : 1.15}
        rotationIntensity={reduced ? 0 : 0.08}
        floatIntensity={reduced ? 0 : 0.3}
        floatingRange={[-0.04, 0.04]}
      >
        <Turntable step={step} reduced={reduced} yawOffset={yawOffset} />
      </Float>
      <Sparkles
        count={24}
        scale={[6, 4, 5]}
        position={[0, 0.4, -0.5]}
        size={1.2}
        speed={reduced ? 0 : 0.26}
        opacity={0.3}
        color="#9db8ff"
      />
    </group>
  );
}

/** Monta dentro do <Suspense>: sinaliza que os modelos carregaram. */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

/* Teto de densidade de pixel. No desktop segue 2, como sempre. No
   celular cai para 1.5: um iPhone reporta dpr 3, e renderizar o palco
   inteiro a 2x custa mais de quatro vezes o número de pixels de 1x
   para uma diferença que ninguém enxerga a 40cm de distância. Medido
   uma vez na montagem — a hero não remonta ao girar o aparelho. */
function maxDpr() {
  if (typeof window === "undefined") return 2;
  return window.matchMedia("(max-width: 639px)").matches ? 1.5 : 2;
}

export default function Hero3D({
  step,
  reduced,
  active,
  onReady,
}: {
  step: number;
  reduced: boolean;
  /** false quando a hero sai da viewport — congela o render loop */
  active: boolean;
  onReady: () => void;
}) {
  const dpr = useMemo<[number, number]>(() => [1, maxDpr()], []);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: CAMERA_POS, fov: 30, near: 0.5, far: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      {/* mesmo tom do painel — o canvas cobre tudo sem emenda visível */}
      <color attach="background" args={["#070c19"]} />
      {/* o dispositivo de trás se funde suavemente ao fundo */}
      <fog attach="fog" args={["#070c19", 7, 9.8]} />

      <ambientLight intensity={0.9} />
      <hemisphereLight intensity={0.55} color="#cfe0ff" groundColor="#0a1020" />
      <directionalLight position={[5, 8, 5]} intensity={2.6} color="#eaf2ff" />
      <directionalLight position={[-6, 4, -6]} intensity={1.5} color="#5f7cff" />

      <Suspense fallback={null}>
        <Ready onReady={onReady} />
        <StageRig step={step} reduced={reduced} />
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={3} position={[0, 4, -6]} scale={[9, 3, 1]} color="#dfe9ff" />
          <Lightformer intensity={2.4} position={[0, 3, 6]} scale={[9, 3, 1]} color="#e6eeff" />
          <Lightformer
            intensity={2.2}
            position={[-6, 1.5, 2]}
            rotation-y={Math.PI / 2}
            scale={[7, 2, 1]}
            color="#93b4ff"
          />
          <Lightformer
            intensity={1.6}
            position={[6, 2.5, 1]}
            rotation-y={-Math.PI / 2}
            scale={[7, 2, 1]}
            color="#b7c9ff"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
