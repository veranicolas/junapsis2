import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import './App.css'
import chinchu from './assets/chinchu.jpg'
import berni from './assets/berni.jpg'
import vera from './assets/vera.jpg'
import napo from './assets/napo.jpg'
import gushi from './assets/gushi.jpg'
import juampi from './assets/juampi.jpg'
import burro from './assets/burro.jpeg'
import { useEffect, useRef, useState } from 'react';
import { OrbitControls, PerspectiveCamera, Text3D, FontData } from '@react-three/drei';
import { Box } from './components/Box';
import Poppins from './assets/Poppins_Regular.json'
import gsap from 'gsap'

const junapseros = [
  {
    name: 'elchinchu',
    img: chinchu,
    position: [-4, -2, 0]
  },
  {
    name: 'Berni',
    img: berni,
    position: [-0.3, -2, 0]
  },
  {
    name: 'Vera',
    img: vera,
    position: [3.7, -2.3, 0]
  },
  {
    name: 'Napo',
    img: napo,
    position: [-3.5, 2, 0]
  },
  {
    name: 'Gushi',
    img: gushi,
    position: [0.5, 2, 0]
  },
  {
    name: 'Juampi',
    img: juampi,
    position: [4.2, 2, 0]
  },
  {
    name: 'Burro',
    img: burro,
    position: [0, 5, 0]
  },
];

function App() {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const textureLoader = new THREE.TextureLoader();
  const marjalerosArray = junapseros.map((junapsero) => {
    const texture = textureLoader.load(junapsero.img);
    texture.colorSpace = THREE.SRGBColorSpace;
    return {
      name: junapsero.name,
      texture: texture,
      position: junapsero.position
    };
  })

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  }

  useEffect(() => {
    const resize = () => {
      if (camera.current) {
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();
      }
      if (canvas.current) {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
    }
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    }
  }, [])

  useEffect(() => {
    gsap.fromTo(
      canvas.current,
      { opacity: 0 },
      { opacity: 1, backgroundColor: 'white', duration: 3, ease: 'back.inOut' }
    )
  }, [])

  useEffect(() => {
    if (currentIndex !== null && (currentIndex < 0 || currentIndex >= marjalerosArray.length)) {
      setCurrentIndex(null);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleDoubleClick = () => {
      setCurrentIndex(null);
      camera.current?.position.set(0, 0, 10);
      camera.current?.lookAt(0, 0, 10);
    }
    canvas.current?.addEventListener('dblclick', handleDoubleClick);
    return () => {
      canvas.current?.removeEventListener('dblclick', handleDoubleClick);
    }
  }, []);

  return (
    <div>
      <Canvas
        ref={canvas}
        style={{ width, height, overflow: 'hidden', backgroundColor: 'black' }}
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
    >
      <PerspectiveCamera 
        ref={camera} 
        makeDefault 
        position={[0, 0, 10]} 
        onUpdate={(c) => c.updateProjectionMatrix()} 
        fov={75} 
        near={0.1} 
        far={1000}
      />
      {marjalerosArray.map((marjalero, index) => {
        return (
          <Box
            key={index}
            texture={marjalero.texture as THREE.Texture}
            index={index}
            currentIndex={currentIndex}
            position={marjalero.position as [number, number, number]}
            name={marjalero.name}
            onClick={handleClick}
          />
        )
      })}
      <mesh position={[-3, -0.3, 0]}>
        <Text3D
          font={Poppins as unknown as FontData}
          size={1}
          height={0.2}
        >
          <meshBasicMaterial color="black" />
          Junapsis
        </Text3D>
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableDamping={true} enabled={true} />
      </Canvas>
      <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', bottom: '2%', left: '50%', zIndex: 1000 }}>
        {
          currentIndex === null ? (
            <p style={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>Toca para mas info</p>
          ) : (
            <p style={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>Doble click para volver</p>
          )
        }
      </div>
    </div>
  )
}

export default App
