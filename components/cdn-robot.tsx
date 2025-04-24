"use client"

import { useEffect, useRef, useState } from "react"

export default function CDNRobot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [textureLoadStatus, setTextureLoadStatus] = useState({
    diffuse: false,
    normal: false,
    metallic: false,
    roughness: false,
  })

  useEffect(() => {
    if (!containerRef.current) return

    let cleanup: () => void = () => {}

    // Function to load PBR textures with retries
    async function loadPBRTextures(THREE: any, basePath: string, maxRetries = 2) {
      const textureLoader = new THREE.TextureLoader()
      textureLoader.crossOrigin = "anonymous"

      const loadTexture = (path: string, textureName: string) => {
        console.log(`Attempting to load texture from: ${path}`)

        return new Promise<any>((resolve) => {
          let retries = 0

          const attemptLoad = () => {
            textureLoader.load(
              path,
              (texture) => {
                console.log(`Successfully loaded texture: ${path}`)
                setTextureLoadStatus((prev) => ({ ...prev, [textureName]: true }))
                resolve(texture)
              },
              (progressEvent) => {
                console.log(`Loading texture progress: ${path}`, progressEvent)
              },
              (error) => {
                console.warn(`Failed to load texture: ${path}`, error)
                retries++
                if (retries < maxRetries) {
                  console.log(`Retrying texture load (${retries}/${maxRetries}): ${path}`)
                  setTimeout(attemptLoad, 1000) // Wait 1 second before retrying
                } else {
                  console.error(`Max retries reached for texture: ${path}`)
                  resolve(null) // Resolve with null instead of rejecting
                }
              },
            )
          }

          attemptLoad()
        })
      }

      try {
        // Log the base path to verify it's correct
        console.log(`Loading textures from base path: ${basePath}`)

        // Try with both relative and absolute paths
        const diffusePath = `${basePath}/texture_diffuse.png`
        const normalPath = `${basePath}/texture_normal.png`
        const metallicPath = `${basePath}/texture_metallic.png`
        const roughnessPath = `${basePath}/texture_roughness.png`

        console.log(`Full paths being used:`, {
          diffusePath,
          normalPath,
          metallicPath,
          roughnessPath,
        })

        // Try to load textures in parallel
        const [diffuse, normal, metallic, roughness] = await Promise.all([
          loadTexture(diffusePath, "diffuse"),
          loadTexture(normalPath, "normal"),
          loadTexture(metallicPath, "metallic"),
          loadTexture(roughnessPath, "roughness"),
        ])

        // Log which textures were successfully loaded
        console.log("Texture loading results:", {
          diffuse: !!diffuse,
          normal: !!normal,
          metallic: !!metallic,
          roughness: !!roughness,
        })

        return {
          diffuse,
          normal,
          metallic,
          roughness,
        }
      } catch (error) {
        console.error("Error loading PBR textures:", error)
        return {}
      }
    }

    // Update the loadScene function to not depend on texture loading success
    const initScene = async () => {
      if (!window.THREE || !containerRef.current) {
        setHasError(true)
        setIsLoading(false)
        return
      }

      try {
        const THREE = window.THREE

        // Create scene first so we can start rendering even while textures are loading
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        containerRef.current.appendChild(renderer.domElement)

        // Add lighting for PBR
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
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

        // Create a basic robot first without textures
        createPBRRobot(THREE, robotGroup)

        // Start rendering
        setIsLoading(false)

        // Animation loop
        let frameId: number
        const animate = () => {
          frameId = requestAnimationFrame(animate)

          // Gentle bobbing motion
          const time = Date.now() * 0.001
          robotGroup.position.y = Math.sin(time) * 0.05
          robotGroup.position.x = Math.sin(time * 0.7) * 0.05

          // Subtle rotation
          robotGroup.rotation.y = Math.sin(time * 0.5) * 0.1

          // Animate eyes
          const eyeMaterials = robotGroup.children
            .filter((child: any) => child.name === "eye")
            .map((eye: any) => eye.material)

          if (eyeMaterials.length > 0) {
            const pulseIntensity = Math.sin(time * 2) * 0.5 + 0.5
            eyeMaterials.forEach((material: any) => {
              material.emissiveIntensity = 0.5 + pulseIntensity * 0.5
            })
          }

          // Animate arms
          const leftArm = robotGroup.children.find((child: any) => child.name === "leftArmGroup")
          const rightArm = robotGroup.children.find((child: any) => child.name === "rightArmGroup")

          if (leftArm && rightArm) {
            leftArm.rotation.x = Math.sin(time * 0.7) * 0.1
            rightArm.rotation.x = Math.sin(time * 0.7 + Math.PI) * 0.1
          }

          renderer.render(scene, camera)
        }

        animate()

        // Try to load textures in the background, but don't block rendering
        loadPBRTextures(THREE, "/models/pbr")
          .then((pbrTextures) => {
            // If any textures were loaded, update the materials
            if (pbrTextures.diffuse || pbrTextures.normal || pbrTextures.metallic || pbrTextures.roughness) {
              // Find all metallic materials and update them
              robotGroup.traverse((object: any) => {
                if (object.isMesh && object.material && object.material.metalness > 0.5) {
                  // Only apply textures if they were successfully loaded
                  if (pbrTextures.diffuse) {
                    object.material.map = pbrTextures.diffuse
                    object.material.needsUpdate = true
                  }
                  if (pbrTextures.normal) {
                    object.material.normalMap = pbrTextures.normal
                    object.material.needsUpdate = true
                  }
                  if (pbrTextures.metallic) {
                    object.material.metalnessMap = pbrTextures.metallic
                    object.material.needsUpdate = true
                  }
                  if (pbrTextures.roughness) {
                    object.material.roughnessMap = pbrTextures.roughness
                    object.material.needsUpdate = true
                  }
                }
              })

              console.log("Updated materials with loaded textures")
            } else {
              console.log("No textures were loaded, using basic materials")
            }
          })
          .catch((error) => {
            console.error("Error loading textures:", error)
            console.log("Continuing with basic materials")
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
          cancelAnimationFrame(frameId)

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

    // Load Three.js from CDN
    const loadThreeJS = () => {
      // Create a script element to load Three.js from CDN
      const script = document.createElement("script")
      script.type = "text/javascript"

      // Add a timeout to detect slow or failed loads
      const timeoutId = setTimeout(() => {
        console.error("Three.js load timeout")
        setHasError(true)
        setIsLoading(false)
      }, 10000) // 10 seconds timeout

      script.onload = () => {
        clearTimeout(timeoutId)
        console.log("Three.js loaded successfully")
        initScene()
      }

      script.onerror = (error) => {
        clearTimeout(timeoutId)
        console.error("Error loading Three.js:", error)
        setHasError(true)
        setIsLoading(false)
      }

      // Try unpkg CDN instead of jsdelivr
      script.src = "https://unpkg.com/three@0.159.0/build/three.min.js"

      // Add the script to the document
      document.head.appendChild(script)
      scriptRef.current = script
    }

    // Start loading Three.js
    loadThreeJS()

    // Cleanup function
    return () => {
      cleanup()
      // Remove the script element if it exists
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current)
      }
    }
  }, [])

  // Helper function to create robot parts with PBR materials
  function createPBRRobot(THREE: any, robotGroup: any) {
    // Create PBR materials - without textures since they're not loading
    const metallicMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.8,
      roughness: 0.2,
    })

    const plasticMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.1,
      roughness: 0.8,
    })

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.5,
    })

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x0044aa,
      metalness: 0.1,
      roughness: 0.1,
    })

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 1.0,
      roughness: 0.2,
      metalness: 0.0,
    })

    // Robot body
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 16)
    const body = new THREE.Mesh(bodyGeometry, metallicMaterial)
    body.position.y = 0.4
    body.castShadow = true
    body.receiveShadow = true
    robotGroup.add(body)

    // Robot lower body
    const lowerBodyGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.3, 16)
    const lowerBody = new THREE.Mesh(lowerBodyGeometry, metallicMaterial)
    lowerBody.position.y = -0.1
    lowerBody.castShadow = true
    lowerBody.receiveShadow = true
    robotGroup.add(lowerBody)

    // Robot head
    const headGeometry = new THREE.SphereGeometry(0.35, 32, 32)
    const head = new THREE.Mesh(headGeometry, metallicMaterial)
    head.position.y = 1.0
    head.castShadow = true
    head.receiveShadow = true
    robotGroup.add(head)

    // Robot visor
    const visorGeometry = new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const visor = new THREE.Mesh(visorGeometry, glassMaterial)
    visor.rotation.x = Math.PI * 0.5
    visor.position.y = 1.0
    visor.position.z = 0.15
    visor.castShadow = true
    robotGroup.add(visor)

    // Robot eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16)

    const leftEye = new THREE.Mesh(eyeGeometry, glowMaterial)
    leftEye.position.set(-0.1, 1.0, 0.3)
    leftEye.name = "eye" // Add name for animation targeting
    robotGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, glowMaterial)
    rightEye.position.set(0.1, 1.0, 0.3)
    rightEye.name = "eye" // Add name for animation targeting
    robotGroup.add(rightEye)

    // Robot ears/antennas
    const earGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16)

    const leftEar = new THREE.Mesh(earGeometry, darkMaterial)
    leftEar.position.set(-0.35, 1.05, 0)
    leftEar.rotation.z = Math.PI * 0.5
    leftEar.castShadow = true
    robotGroup.add(leftEar)

    const rightEar = new THREE.Mesh(earGeometry, darkMaterial)
    rightEar.position.set(0.35, 1.05, 0)
    rightEar.rotation.z = Math.PI * 0.5
    rightEar.castShadow = true
    robotGroup.add(rightEar)

    // Robot arms
    const upperArmGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16)

    // Left arm group
    const leftArmGroup = new THREE.Group()
    leftArmGroup.position.set(-0.5, 0.5, 0)
    leftArmGroup.name = "leftArmGroup"
    robotGroup.add(leftArmGroup)

    const leftUpperArm = new THREE.Mesh(upperArmGeometry, metallicMaterial)
    leftUpperArm.position.y = -0.25
    leftUpperArm.rotation.z = Math.PI * 0.1
    leftUpperArm.castShadow = true
    leftArmGroup.add(leftUpperArm)

    // Left forearm group
    const leftForearmGroup = new THREE.Group()
    leftForearmGroup.position.y = -0.5
    leftArmGroup.add(leftForearmGroup)

    const leftForearm = new THREE.Mesh(upperArmGeometry, metallicMaterial)
    leftForearm.position.y = -0.25
    leftForearm.rotation.z = Math.PI * 0.15
    leftForearm.castShadow = true
    leftForearmGroup.add(leftForearm)

    // Right arm group
    const rightArmGroup = new THREE.Group()
    rightArmGroup.position.set(0.5, 0.5, 0)
    rightArmGroup.name = "rightArmGroup"
    robotGroup.add(rightArmGroup)

    const rightUpperArm = new THREE.Mesh(upperArmGeometry, metallicMaterial)
    rightUpperArm.position.y = -0.25
    rightUpperArm.rotation.z = -Math.PI * 0.1
    rightUpperArm.castShadow = true
    rightArmGroup.add(rightUpperArm)

    // Right forearm group
    const rightForearmGroup = new THREE.Group()
    rightForearmGroup.position.y = -0.5
    rightArmGroup.add(rightForearmGroup)

    const rightForearm = new THREE.Mesh(upperArmGeometry, metallicMaterial)
    rightForearm.position.y = -0.25
    rightForearm.rotation.z = -Math.PI * 0.15
    rightForearm.castShadow = true
    rightForearmGroup.add(rightForearm)

    // Robot legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16)

    const leftLeg = new THREE.Mesh(legGeometry, metallicMaterial)
    leftLeg.position.set(-0.2, -0.5, 0)
    leftLeg.castShadow = true
    robotGroup.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeometry, metallicMaterial)
    rightLeg.position.set(0.2, -0.5, 0)
    rightLeg.castShadow = true
    robotGroup.add(rightLeg)

    // Robot feet
    const footGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.25)

    const leftFoot = new THREE.Mesh(footGeometry, darkMaterial)
    leftFoot.position.set(-0.2, -0.85, 0.05)
    leftFoot.castShadow = true
    leftFoot.receiveShadow = true
    robotGroup.add(leftFoot)

    const rightFoot = new THREE.Mesh(footGeometry, darkMaterial)
    rightFoot.position.set(0.2, -0.85, 0.05)
    rightFoot.castShadow = true
    rightFoot.receiveShadow = true
    robotGroup.add(rightFoot)

    // Robot chest details
    const chestDetailGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16)

    const upperChestDetail = new THREE.Mesh(chestDetailGeometry, darkMaterial)
    upperChestDetail.position.set(0, 0.5, 0.35)
    upperChestDetail.rotation.x = Math.PI * 0.5
    robotGroup.add(upperChestDetail)

    const lowerChestDetail = new THREE.Mesh(chestDetailGeometry, darkMaterial)
    lowerChestDetail.position.set(0, 0.3, 0.35)
    lowerChestDetail.rotation.x = Math.PI * 0.5
    robotGroup.add(lowerChestDetail)

    // Create solar panel with PBR materials
    const solarPanelGroup = new THREE.Group()
    solarPanelGroup.position.set(-1.2, 0.5, 0.3)
    solarPanelGroup.rotation.y = Math.PI * 0.15
    robotGroup.add(solarPanelGroup)

    // Panel frame
    const frameGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    frame.castShadow = true
    frame.receiveShadow = true
    solarPanelGroup.add(frame)

    // Panel glass with PBR properties
    const glassGeometry = new THREE.BoxGeometry(1.1, 0.02, 0.7)
    const panelGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x0044aa,
      metalness: 0.1,
      roughness: 0.1,
    })
    const glass = new THREE.Mesh(glassGeometry, panelGlassMaterial)
    glass.position.y = 0.035
    glass.castShadow = true
    glass.receiveShadow = true
    solarPanelGroup.add(glass)

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

      solarPanelGroup.add(line)
    }

    // Create horizontal grid lines
    for (let i = -3; i <= 3; i++) {
      createGridLine(true, i * 0.1)
    }

    // Create vertical grid lines
    for (let i = -5; i <= 5; i++) {
      createGridLine(false, i * 0.1)
    }

    // Create document/paper with PBR materials
    const docGroup = new THREE.Group()
    docGroup.position.set(1.2, 0.5, 0.3)
    docGroup.rotation.y = -Math.PI * 0.15
    robotGroup.add(docGroup)

    // Main paper with PBR properties
    const paperGeometry = new THREE.BoxGeometry(0.8, 1.1, 0.01)
    const paperMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.0,
    })
    const paper = new THREE.Mesh(paperGeometry, paperMaterial)
    paper.castShadow = true
    paper.receiveShadow = true
    docGroup.add(paper)

    // Text lines
    const lineGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.015)
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })

    for (let i = 0; i < 7; i++) {
      const line = new THREE.Mesh(lineGeometry, lineMaterial)
      line.position.y = 0.4 - i * 0.1
      docGroup.add(line)
    }

    // Add a simple ground shadow
    const shadowGeometry = new THREE.CircleGeometry(0.8, 32)
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
    })
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -0.95
    shadow.receiveShadow = true
    robotGroup.add(shadow)

    // Position the entire robot
    robotGroup.position.y = -0.5
    robotGroup.rotation.y = -Math.PI * 0.2
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

      {/* Debug overlay for texture loading status */}
      <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white p-1 rounded opacity-50 pointer-events-none">
        Textures: {Object.values(textureLoadStatus).filter(Boolean).length}/4
      </div>
    </div>
  )
}
