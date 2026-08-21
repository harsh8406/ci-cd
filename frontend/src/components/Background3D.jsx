import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Ambient 3D backdrop: a slowly rotating field of glowing nodes connected
 * by faint lines, evoking a distributed pipeline / service mesh. Pointer
 * position gently parallaxes the camera for a subtle interactive feel.
 *
 * Kept intentionally lightweight (a few hundred points, no postprocessing)
 * so it stays smooth on modest hardware and never blocks the UI - it is
 * purely decorative and sits behind pointer-events-none.
 */
function NodeField({ count = 140 }) {
  const pointsRef = useRef();
  const groupRef = useRef();

  const { positions, linePositions } = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const radius = 5.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pts.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta) * 0.6,
          radius * Math.cos(phi)
        )
      );
    }

    const positions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });

    // Connect each node to its 2 nearest neighbours to build a mesh-like lattice.
    const linePts = [];
    for (let i = 0; i < pts.length; i++) {
      const distances = pts
        .map((p, j) => ({ j, d: i === j ? Infinity : pts[i].distanceTo(p) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      distances.forEach(({ j, d }) => {
        if (d < 3.2) {
          linePts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      });
    }

    return { positions, linePositions: new Float32Array(linePts) };
  }, [count]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#14b389" transparent opacity={0.12} />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.09} color="#69e2bd" transparent opacity={0.85} sizeAttenuation />
      </points>
    </group>
  );
}

function CameraRig() {
  const { current } = useRef({ x: 0, y: 0 });
  useFrame(({ camera, pointer }) => {
    current.x += (pointer.x * 0.6 - current.x) * 0.02;
    current.y += (pointer.y * 0.4 - current.y) * 0.02;
    camera.position.x = current.x;
    camera.position.y = current.y;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const Background3D = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <NodeField />
        <CameraRig />
      </Canvas>
    </div>
  );
};

export default Background3D;
