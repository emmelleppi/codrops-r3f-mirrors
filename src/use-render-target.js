import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'

function useRenderTarget(settings = {}) {
  const renderTargetSettings = { 
    format: THREE.RGBAFormat, 
    generateMipmaps: true, 
    minFilter: THREE.LinearMipmapLinearFilter
 }
  
    const renderTarget = useMemo(() => 
    new THREE.WebGLCubeRenderTarget(1024, {
      ...renderTargetSettings,
      ...settings
    })
  , [])
  
    const cubeCamera = useRef()

    useFrame(({ gl, scene }) => {
        if (!cubeCamera.current) return
        cubeCamera.current.update(gl, scene)
    })

  return [cubeCamera, renderTarget]
}


export default useRenderTarget
