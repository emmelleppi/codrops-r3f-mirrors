import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'

function useRenderTarget(settings = {}) {
  const renderTarget = useMemo(() => {
    const renderTargetSettings = {
      format: THREE.RGBAFormat,
      generateMipmaps: true
    }

    return new THREE.WebGLCubeRenderTarget(1024, {
      ...renderTargetSettings,
      ...settings
    })
  }, [settings])

  const cubeCamera = useRef()

  useFrame(({ gl, scene }) => {
    if (!cubeCamera.current) return
    cubeCamera.current.update(gl, scene)
  })

  return [cubeCamera, renderTarget]
}

export default useRenderTarget
