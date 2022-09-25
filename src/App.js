// import { Vector3 } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import {
  OrbitControls,
  useTexture,
  Environment,
  Html,
  useProgress,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import piz from "./pizza_display.jpg";
import marble from "./marb.jpg";
import forestLeaves from "./leaves_forest_ground_diff_1k.jpg";
import ast from "./Astronaut.glb";
import "./App.css";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Cube = (props) => {
  const [hover, setHover] = useState(false);
  const { scale } = useSpring({ scale: hover ? 1.5 : 1 });
  const mesh = useRef();
  const texture = useTexture(piz);
  useFrame(() => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });

  const position = props.position;
  const size = props.args;

  return (
    <animated.mesh
      scale={scale}
      position={position}
      ref={mesh}
      onClick={() => setHover(!hover)}
    >
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color="grey"
        map={texture}
        envMapIntensity={0.4}
        metalness={0.5}
      />
    </animated.mesh>
  );
};

const Sphere = (props) => {
  const sphereRef = useRef();

  const position = props.position;
  const size = props.args;

  const texture = useTexture(forestLeaves);

  useFrame(({ clock }) => {
    // const a = clock.getElapsedTime();
    // console.log(Math.sin(clock.getElapsedTime()));
    sphereRef.current.rotation.x = Math.sin(clock.getElapsedTime());
    // sphereRef.current.rotation.y = clock.getElapsedTime();
  });

  return (
    <mesh position={position} ref={sphereRef}>
      <sphereGeometry args={size} />
      <meshPhysicalMaterial
        // envMapIntensity={0.4}
        map={texture}
        // clearcoat={0.8}
        // clearcoatRoughness={0}
        // roughness={1}
        metalness={0}
        color="grey"
      />
    </mesh>
  );
};

const Model = () => {
  const astroRef = useRef();
  const gltf = useLoader(GLTFLoader, ast);
  // console.log(gltf);

  useFrame(() => {
    astroRef.current.rotation.x += 0.01;
  });
  return (
    <>
      <primitive
        object={gltf.scene}
        scale={1}
        position={[6, 1, 1]}
        ref={astroRef}
      />
    </>
  );
};

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

function App() {
  return (
    <>
      <div>
        <h1>Hello world</h1>
      </div>
      <div className="three-js">
        <Canvas>
          <Suspense fallback={<Loader />}>
            <spotLight
              intensity={0.5}
              angle={0.2}
              penumbra={1}
              position={[3, 2, 1]}
            />
            <OrbitControls
              autoRotate
              autoRotateSpeed={0.1}
              enablePan={true}
              enableZoom={true}
            />
            <Environment preset="forest" background />
            <ambientLight intensity={5} />
            <directionalLight color="white" position={[0, 10, 10]} />
            <pointLight position={[0, 0, 0]} />
            <Model />
            <Cube position={[0, 0, 0]} args={[2, 2, 2]} />
            <Cube position={[3, 1, 1]} args={[2, 2, 2]} />
            <Sphere position={[-3, 1, 1]} args={[2, 64, 64]} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
