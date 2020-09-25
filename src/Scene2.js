import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { Text, useMatcapTexture, Octahedron, useGLTFLoader, PerspectiveCamera } from 'drei'

import { ThinFilmFresnelMap } from './ThinFilmFresnelMap'
import { mirrorsData as diamondsData } from './data'
import useSlerp from './use-slerp'

const TEXT_PROPS = {
  fontSize: 5,
  font: 'http://fonts.gstatic.com/s/monoton/v10/5h1aiZUrOngCibe4TkHLRA.woff'
}

function Title({ material, texture, map, ...props }) {
  return (
    <group {...props}>
      <Text name="text-olga" depthTest={false} position={[0, -1, 0]} {...TEXT_PROPS}>
        OLGA
        <meshPhysicalMaterial envMap={texture} map={map} roughness={0} metalness={1} toneMapped={false} />
      </Text>
    </group>
  )
}

function Diamond({ map, texture, matcap, ...props }) {
  const ref = useRef()

  useFrame(() => void ((ref.current.rotation.y += 0.001), (ref.current.rotation.z += 0.01)))

  return (
    <mesh ref={ref} {...props}>
      <meshMatcapMaterial matcap={matcap} transparent opacity={0.9} color="#14ceff" />
    </mesh>
  )
}

function Diamonds(props) {
  const [matcapTexture] = useMatcapTexture('2E763A_78A0B7_B3D1CF_14F209')
  const { nodes } = useGLTFLoader('/diamond.glb')
  return (
    <group name="diamonds" {...props}>
      {diamondsData.mirrors.map((mirror, index) => (
        <Diamond key={`0${index}`} name={`diamond-${index}`} {...mirror} geometry={nodes.Cylinder.geometry} matcap={matcapTexture} scale={[0.5, 0.5, 0.5]} />
      ))}
    </group>
  )
}

function Scene() {
  const [renderTarget] = useState(new THREE.WebGLCubeRenderTarget(1024, { format: THREE.RGBAFormat, generateMipmaps: true, minFilter: THREE.LinearFilter }))
  const [thinFilmFresnelMap] = useState(new ThinFilmFresnelMap(410, 0, 5, 1024))

  const cubeCamera = useRef()
  const text = useRef()
  const group = useSlerp()

  const [matcapTexture] = useMatcapTexture('BA5DBA_F2BEF2_E69BE6_DC8CDC')

  useFrame(({ gl, scene }) => {
    if (!cubeCamera.current) return
    text.current.visible = false
    cubeCamera.current.update(gl, scene)
    text.current.visible = true
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 2]} fov={70} />
      <group name="sceneContainer" ref={group}>
        <Octahedron name="background" args={[20, 4, 4]} position={[0, 0, -5]}>
          <meshMatcapMaterial matcap={matcapTexture} side={THREE.BackSide} />
        </Octahedron>
        <cubeCamera name="cubeCamera" ref={cubeCamera} args={[0.1, 100, renderTarget]} position={[0, 0, -12]} />
        <Diamonds />
        <group ref={text} name="text" position={[0, 0, -5]}>
          <Title name="title" texture={renderTarget.texture} map={thinFilmFresnelMap} />
        </group>
      </group>
    </>
  )
}

export default Scene
