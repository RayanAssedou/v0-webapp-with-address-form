"use client"

import { useEffect, useRef, useState } from "react"
import CssRobot from "./css-robot"

export default function Robot3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let cleanup: () => void = () => {}

    const loadThreeJS = async () => {
      try {
        // Import Three.js and required loaders
        const THREE = await import("three")
        const { OBJLoader } = await import("three/examples/jsm/loaders/OBJLoader")
        const { TextureLoader } = THREE

        // Create scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xc3e86d)

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          45,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000,
        )
        camera.position.set(0, 1.5, 5)

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.0
        containerRef.current.appendChild(renderer.domElement)

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 1024
        directionalLight.shadow.mapSize.height = 1024
        scene.add(directionalLight)

        // Add fill light from the front
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
        fillLight.position.set(0, 0, 5)
        scene.add(fillLight)

        // Add rim light from behind for metallic highlight
        const rimLight = new THREE.DirectionalLight(0x00ffff, 0.3)
        rimLight.position.set(-5, 0, -5)
        scene.add(rimLight)

        // Create robot group
        const robotGroup = new THREE.Group()
        scene.add(robotGroup)

        // Create solar panel
        const createSolarPanel = () => {
          const panelGroup = new THREE.Group()

          // Panel frame
          const frameGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8)
          const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2,
          })
          const frame = new THREE.Mesh(frameGeometry, frameMaterial)
          panelGroup.add(frame)

          // Panel glass
          const glassGeometry = new THREE.BoxGeometry(1.1, 0.02, 0.7)
          const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x0044aa,
            metalness: 0.1,
            roughness: 0.1,
            envMapIntensity: 1.0,
          })
          const glass = new THREE.Mesh(glassGeometry, glassMaterial)
          glass.position.y = 0.035
          panelGroup.add(glass)

          // Panel grid lines
          const createGridLine = (isHorizontal: boolean, position: number) => {
            const lineGeometry = new THREE.BoxGeometry(isHorizontal ? 1.05 : 0.01, 0.03, isHorizontal ? 0.01 : 0.65)
            const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const line = new THREE.Mesh(lineGeometry, lineMaterial)
            line.position.y = 0.04

            if (isHorizontal) {
              line.position.z = position
            } else {
              line.position.x = position
            }

            panelGroup.add(line)
          }

          // Create horizontal grid lines
          for (let i = -3; i <= 3; i++) {
            createGridLine(true, i * 0.1)
          }

          // Create vertical grid lines
          for (let i = -5; i <= 5; i++) {
            createGridLine(false, i * 0.1)
          }

          return panelGroup
        }

        // Create document/paper
        const createDocument = () => {
          const docGroup = new THREE.Group()

          // Main paper
          const paperGeometry = new THREE.BoxGeometry(0.8, 1.1, 0.01)
          const paperMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
          const paper = new THREE.Mesh(paperGeometry, paperMaterial)
          docGroup.add(paper)

          // Text lines
          const lineGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.015)
          const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })

          for (let i = 0; i < 7; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial)
            line.position.y = 0.4 - i * 0.1
            docGroup.add(line)
          }

          return docGroup
        }

        // Load OBJ models
        const objLoader = new OBJLoader()
        const textureLoader = new TextureLoader()

        // Raw GitHub URLs for the OBJ files
        const baseObjUrl = "https://raw.githubusercontent.com/RayanAssedou/ObjModels/main/base.obj"
        const base2ObjUrl = "https://raw.githubusercontent.com/RayanAssedou/ObjModels/main/base2.obj"

        // PBR textures paths
        const texturePaths = {
          diffuse: "/models/pbr/texture_diffuse.png",
          normal: "/models/pbr/texture_normal.png",
          metallic: "/models/pbr/texture_metallic.png",
          roughness: "/models/pbr/texture_roughness.png",
        }

        // Shaded texture path
        const shadedTexturePath = "/models/shaded/shaded.png"

        // Pre-load textures
        const loadTexture = (path: string) => {
          return new Promise<THREE.Texture>((resolve, reject) => {
            textureLoader.load(
              path,
              (texture) => resolve(texture),
              undefined,
              (error) => {
                console.warn(`Failed to load texture: ${path}`, error)
                reject(error)
              },
            )
          })
        }

        // Load PBR textures
        const loadPBRTextures = async () => {
          try {
            const [diffuseMap, normalMap, metallicMap, roughnessMap] = await Promise.all([
              loadTexture(texturePaths.diffuse).catch(() => null),
              loadTexture(texturePaths.normal).catch(() => null),
              loadTexture(texturePaths.metallic).catch(() => null),
              loadTexture(texturePaths.roughness).catch(() => null),
            ])

            return { diffuseMap, normalMap, metallicMap, roughnessMap }
          } catch (error) {
            console.warn("Error loading PBR textures:", error)
            return { diffuseMap: null, normalMap: null, metallicMap: null, roughnessMap: null }
          }
        }

        // Load shaded texture
        const loadShadedTexture = async () => {
          try {
            return await loadTexture(shadedTexturePath)
          } catch (error) {
            console.warn("Error loading shaded texture:", error)
            return null
          }
        }

        // Load textures first
        const [pbrTextures, shadedTexture] = await Promise.all([loadPBRTextures(), loadShadedTexture()])

        // Create PBR material
        const createPBRMaterial = () => {
          const material = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2,
            envMapIntensity: 1.0,
          })

          // Apply textures if available
          if (pbrTextures.diffuseMap) {
            material.map = pbrTextures.diffuseMap
            material.map.encoding = THREE.sRGBEncoding
          }

          if (pbrTextures.normalMap) {
            material.normalMap = pbrTextures.normalMap
          }

          if (pbrTextures.metallicMap) {
            material.metalnessMap = pbrTextures.metallicMap
          }

          if (pbrTextures.roughnessMap) {
            material.roughnessMap = pbrTextures.roughnessMap
          }

          return material
        }

        // Create shaded material
        const createShadedMaterial = () => {
          const material = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            shininess: 100,
            specular: 0x666666,
          })

          // Apply texture if available
          if (shadedTexture) {
            material.map = shadedTexture
            material.map.encoding = THREE.sRGBEncoding
          }

          return material
        }

        // Create materials
        const pbrMaterial = createPBRMaterial()
        const shadedMaterial = createShadedMaterial()

        // Load the PBR model
        const loadPBRModel = new Promise<void>((resolve, reject) => {
          objLoader.load(
            baseObjUrl,
            (object) => {
              try {
                // Apply material to all meshes
                object.traverse((child) => {
                  if ((child as THREE.Mesh).isMesh) {
                    ;(child as THREE.Mesh).material = pbrMaterial
                    ;(child as THREE.Mesh).castShadow = true
                    ;(child as THREE.Mesh).receiveShadow = true
                  }
                })

                // Scale and position
                object.scale.set(0.5, 0.5, 0.5)
                object.position.set(0, 0, 0)

                // Add to robot group
                robotGroup.add(object)
                resolve()
              } catch (error) {
                console.error("Error processing PBR model:", error)
                reject(error)
              }
            },
            (xhr) => {
              console.log(`PBR model ${(xhr.loaded / xhr.total) * 100}% loaded`)
            },
            (error) => {
              console.error("Error loading PBR model:", error)
              reject(error)
            },
          )
        })

        // Load the shaded model
        const loadShadedModel = new Promise<void>((resolve, reject) => {
          objLoader.load(
            base2ObjUrl,
            (object) => {
              try {
                // Apply material to all meshes
                object.traverse((child) => {
                  if ((child as THREE.Mesh).isMesh) {
                    ;(child as THREE.Mesh).material = shadedMaterial
                    ;(child as THREE.Mesh).castShadow = true
                    ;(child as THREE.Mesh).receiveShadow = true
                  }
                })

                // Scale and position
                object.scale.set(0.5, 0.5, 0.5)
                object.position.set(0, 0, 0)

                // Add to robot group
                robotGroup.add(object)
                resolve()
              } catch (error) {
                console.error("Error processing shaded model:", error)
                reject(error)
              }
            },
            (xhr) => {
              console.log(`Shaded model ${(xhr.loaded / xhr.total) * 100}% loaded`)
            },
            (error) => {
              console.error("Error loading shaded model:", error)
              reject(error)
            },
          )
        })

        // Load both models
        Promise.all([loadPBRModel, loadShadedModel])
          .then(() => {
            // Add solar panel to the robot's left hand
            const solarPanel = createSolarPanel()
            solarPanel.position.set(-1.2, 0.5, 0.3)
            solarPanel.rotation.y = Math.PI * 0.15
            robotGroup.add(solarPanel)

            // Add document to the robot's right hand
            const document = createDocument()
            document.position.set(1.2, 0.5, 0.3)
            document.rotation.y = -Math.PI * 0.15
            robotGroup.add(document)

            // Create glowing eyes
            const createEyes = () => {
              const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16)
              const eyeMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                emissive: 0x00ff00,
                emissiveIntensity: 1.0,
              })

              const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
              leftEye.position.set(-0.2, 1.7, 0.4)
              robotGroup.add(leftEye)

              const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
              rightEye.position.set(0.2, 1.7, 0.4)
              robotGroup.add(rightEye)

              return { leftEye, rightEye, eyeMaterial }
            }

            const { eyeMaterial } = createEyes()

            setIsLoading(false)

            // Animation loop
            let frameId: number
            const animate = () => {
              frameId = requestAnimationFrame(animate)

              // Gentle bobbing motion
              const time = Date.now() * 0.001
              robotGroup.position.y = Math.sin(time) * 0.05
              robotGroup.position.x = Math.sin(time * 0.7) * 0.05 // Add x-axis movement

              // Subtle rotation
              robotGroup.rotation.y = Math.sin(time * 0.5) * 0.1

              // Animate eyes
              const pulseIntensity = Math.sin(time * 2) * 0.5 + 0.5
              eyeMaterial.emissiveIntensity = 0.5 + pulseIntensity * 0.5

              renderer.render(scene, camera)
            }

            animate()
          })
          .catch((error) => {
            console.error("Error loading models:", error)
            setHasError(true)
            setIsLoading(false)
          })

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return

          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener("resize", handleResize)

        // Cleanup function
        cleanup = () => {
          window.removeEventListener("resize", handleResize)
          cancelAnimationFrame(0) // This will be updated in the animation loop

          if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement)
          }

          // Dispose of all Three.js resources
          renderer.dispose()
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose()

              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((material) => material.dispose())
                } else {
                  object.material.dispose()
                }
              }
            }
          })
        }
      } catch (error) {
        console.error("Error initializing Three.js:", error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadThreeJS()

    return () => cleanup()
  }, [])

  // Show CSS fallback if there's an error or while loading
  if (hasError) {
    return <CssRobot />
  }

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#c3e86d]">
          <div className="w-16 h-16 border-4 border-t-4 border-[#2c3e50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease-in-out" }}
      />
    </div>
  )
}
