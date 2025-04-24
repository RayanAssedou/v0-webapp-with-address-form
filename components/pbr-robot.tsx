"use client"

import { useEffect, useRef, useState } from "react"
import CssRobot from "./css-robot"

export default function PBRRobot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let cleanup: () => void = () => {}

    const loadScene = async () => {
      try {
        // Only import core Three.js
        const THREE = await import("three")

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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
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

        // Create a PBR robot model
        createPBRRobot(THREE, robotGroup)

        // Create solar panel
        const solarPanel = createSolarPanel(THREE)
        solarPanel.position.set(-1.2, 0.5, 0.3)
        solarPanel.rotation.y = Math.PI * 0.15
        robotGroup.add(solarPanel)

        // Create document/paper
        const document = createDocument(THREE)
        document.position.set(1.2, 0.5, 0.3)
        document.rotation.y = -Math.PI * 0.15
        robotGroup.add(document)

        // Create glowing eyes
        const { eyeMaterial } = createEyes(THREE, robotGroup)

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
          if (eyeMaterial) {
            const pulseIntensity = Math.sin(time * 2) * 0.5 + 0.5
            eyeMaterial.emissiveIntensity = 0.5 + pulseIntensity * 0.5
          }

          renderer.render(scene, camera)
        }

        animate()

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

    loadScene()

    return () => cleanup()
  }, [])

  // Helper functions to create robot parts
  function createPBRRobot(THREE: any, robotGroup: any) {
    // Create PBR materials
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
    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x000033,
      metalness: 0.1,
      roughness: 0.1,
      emissive: 0x000033,
    })
    const visor = new THREE.Mesh(visorGeometry, visorMaterial)
    visor.rotation.x = Math.PI * 0.5
    visor.position.y = 1.0
    visor.position.z = 0.15
    visor.castShadow = true
    robotGroup.add(visor)

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

    // Position the entire robot
    robotGroup.position.y = -0.5
    robotGroup.rotation.y = -Math.PI * 0.2
  }

  function createSolarPanel(THREE: any) {
    const panelGroup = new THREE.Group()

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
    panelGroup.add(frame)

    // Panel glass
    const glassGeometry = new THREE.BoxGeometry(1.1, 0.02, 0.7)
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x0044aa,
      metalness: 0.1,
      roughness: 0.1,
    })
    const glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.y = 0.035
    glass.castShadow = true
    glass.receiveShadow = true
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

  function createDocument(THREE: any) {
    const docGroup = new THREE.Group()

    // Main paper
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

    return docGroup
  }

  function createEyes(THREE: any, robotGroup: any) {
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 1.0,
      roughness: 0.2,
      metalness: 0.0,
    })

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.2, 1.7, 0.4)
    robotGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.2, 1.7, 0.4)
    robotGroup.add(rightEye)

    return { leftEye, rightEye, eyeMaterial }
  }

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
