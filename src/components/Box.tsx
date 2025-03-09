import { Html } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

interface BoxProps {
  texture: THREE.Texture;
  index: number;
  currentIndex: number | null;
  position: [number, number, number];
  name: string;
  onClick: (index: number) => void;
}

export const Box = ({texture, index, currentIndex, position, name, onClick}: BoxProps) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ camera, clock}) => {
    if (currentIndex === index) {
      camera.lookAt(new THREE.Vector3(...position));
      camera.position.z = 7;
    } else {
      if (ref.current) {
        ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 3) * 0.9;
      }
    }
  })

  useEffect(()=>{
    if (ref.current) {
      gsap.fromTo(ref.current.position, {
        y: position[1] * 100,
      }, {
        y: position[1],
        duration: 3,
        ease: 'power2.inOut',
      });
    }
  },[])

  return (
      <mesh
        ref={ref}
        position={position}
        onClick={() => onClick(index)}
      >
        <boxGeometry args={[2, 2, 2]}/>
        <meshBasicMaterial map={texture} />
        <Html
          center
          occlude={currentIndex !== index}>
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: currentIndex === index ? 1 : 0,
              backgroundColor: currentIndex === index ? 'black' : 'transparent',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              width: '250px',
              height: '150px',
          }}>
            <h1>
              {name}
            </h1>
            <p style={{ fontSize: '20px' }}>
              {name === 'Burro' ? 'la creatura' : 'focking demonio'}
            </p>
          </div>
        </Html>
      </mesh>
  )
}
