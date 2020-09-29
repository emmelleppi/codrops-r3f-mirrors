import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { Text, useMatcapTexture, Octahedron, useGLTFLoader } from '@react-three/drei'

import useSlerp from './use-slerp'
import useRenderTarget from './use-render-target'
import { ThinFilmFresnelMap } from './ThinFilmFresnelMap'
import { mirrorsData as diamondsData } from './data'
import useLayers from './use-layers'

const TEXT_PROPS = {
  fontSize: 3,
  font: 'http://fonts.gstatic.com/s/stalinistone/v26/MQpS-WezM9W4Dd7D3B7I-UT7SZieOA.woff'
}

function Title({ material, texture, map, layers, ...props }) {
  const textRef = useLayers(layers)

  return (
    <group {...props}>
      <Text ref={textRef} name="text-olga" depthTest={false} position={[0, -1, 0]} {...TEXT_PROPS}>
        OLGA
        <meshPhysicalMaterial envMap={texture} map={map} roughness={0} metalness={0} color="#0050f0" />
      </Text>
    </group>
  )
}

function Diamond({ map, texture, matcap, layers, ...props }) {
  const ref = useLayers(layers)

  useFrame(() => {
    ref.current.rotation.y += 0.001
    ref.current.rotation.z += 0.01
  })

  return (
    <mesh ref={ref} {...props}>
      <meshMatcapMaterial matcap={matcap} transparent opacity={0.9} color="#14CEFF" />
    </mesh>
  )
}

function Diamonds({ layers, ...props }) {
  const [matcapTexture] = useMatcapTexture('17395A_7EBCC7_4D8B9F_65A1B5')
  const { nodes } = useGLTFLoader('/diamond.glb')

  return (
    <group name="diamonds" {...props}>
      {diamondsData.mirrors.map((mirror, index) => (
        <Diamond
          key={`diamond-${index}`}
          name={`diamond-${index}`}
          {...mirror}
          geometry={nodes.Cylinder.geometry}
          matcap={matcapTexture}
          scale={[0.5, 0.5, 0.5]}
          layers={layers}
        />
      ))}
    </group>
  )
}

function Background({ layers, ...props }) {
  const ref = useLayers(layers)
  const [matcapTexture] = useMatcapTexture('686B73_2A2B2D_D5D9DD_B0B3BC')

  return (
    <Octahedron ref={ref} name="background" args={[20, 4, 4]} {...props}>
      <meshMatcapMaterial matcap={matcapTexture} side={THREE.BackSide} color="#FFFFFF" />
    </Octahedron>
  )
}

function Scene() {
  const [cubeCamera, renderTarget] = useRenderTarget()
  const thinFilmFresnelMap = useMemo(() => new ThinFilmFresnelMap(410, 0, 5, 1024), [])
  const group = useSlerp()
  return (
    <>
      <Background layers={[0, 11]} position={[0, 0, -5]} />
      <cubeCamera
        layers={[11]}
        name="cubeCamera"
        ref={cubeCamera}
        args={[0.1, 100, renderTarget]}
        position={[0, 0, -12]}
      />
      <group name="sceneContainer" ref={group}>
        <Diamonds layers={[0, 11]} />
        <group name="text" position={[0, 0, -5]}>
          <Title layers={[0]} name="title" texture={renderTarget.texture} map={thinFilmFresnelMap} />
        </group>
      </group>
    </>
  )
}

export default Scene
