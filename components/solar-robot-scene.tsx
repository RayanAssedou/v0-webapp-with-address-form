"use client"

import { useEffect, useRef } from "react"

export default function SolarRobotScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Dynamically import Three.js only on client side
    const importThreeJS = async () => {
      try {
        // Import Three.js modules
        const THREE = await import("three")

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xc3e86d)

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
          45,
          containerRef.current!.clientWidth / containerRef.current!.clientHeight,
          0.1,
          1000,
        )
        camera.position.z = 5
        camera.position.y = 1.5

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight)
        renderer.setClearColor(0xc3e86d)
        renderer.shadowMap.enabled = true
        containerRef.current!.appendChild(renderer.domElement)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        // Create robot group
        const robotGroup = new THREE.Group()
        scene.add(robotGroup)

        // Robot body
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 16)
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 })
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
        body.position.y = 0.4
        robotGroup.add(body)

        // Robot lower body
        const lowerBodyGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.3, 16)
        const lowerBodyMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd })
        const lowerBody = new THREE.Mesh(lowerBodyGeometry, lowerBodyMaterial)
        lowerBody.position.y = -0.1
        robotGroup.add(lowerBody)

        // Robot head
        const headGeometry = new THREE.SphereGeometry(0.35, 32, 32)
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 })
        const head = new THREE.Mesh(headGeometry, headMaterial)
        head.position.y = 1.0
        robotGroup.add(head)

        // Robot visor
        const visorGeometry = new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5)
        const visorMaterial = new THREE.MeshPhongMaterial({
          color: 0x000033,
          emissive: 0x000033,
          shininess: 100,
          specular: 0x6666ff,
        })
        const visor = new THREE.Mesh(visorGeometry, visorMaterial)
        visor.rotation.x = Math.PI * 0.5
        visor.position.y = 1.0
        visor.position.z = 0.15
        robotGroup.add(visor)

        // Robot ears/antennas
        const earGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16)
        const earMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd })

        const leftEar = new THREE.Mesh(earGeometry, earMaterial)
        leftEar.position.set(-0.35, 1.05, 0)
        leftEar.rotation.z = Math.PI * 0.5
        robotGroup.add(leftEar)

        const rightEar = new THREE.Mesh(earGeometry, earMaterial)
        rightEar.position.set(0.35, 1.05, 0)
        rightEar.rotation.z = Math.PI * 0.5
        robotGroup.add(rightEar)

        // Robot arms
        const upperArmGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16)
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 })

        // Left arm group
        const leftArmGroup = new THREE.Group()
        leftArmGroup.position.set(-0.5, 0.5, 0)
        robotGroup.add(leftArmGroup)

        const leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial)
        leftUpperArm.position.y = -0.25
        leftUpperArm.rotation.z = Math.PI * 0.1
        leftArmGroup.add(leftUpperArm)

        // Left forearm group
        const leftForearmGroup = new THREE.Group()
        leftForearmGroup.position.y = -0.5
        leftArmGroup.add(leftForearmGroup)

        const leftForearm = new THREE.Mesh(upperArmGeometry, armMaterial)
        leftForearm.position.y = -0.25
        leftForearm.rotation.z = Math.PI * 0.15
        leftForearmGroup.add(leftForearm)

        // Right arm group
        const rightArmGroup = new THREE.Group()
        rightArmGroup.position.set(0.5, 0.5, 0)
        robotGroup.add(rightArmGroup)

        const rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial)
        rightUpperArm.position.y = -0.25
        rightUpperArm.rotation.z = -Math.PI * 0.1
        rightArmGroup.add(rightUpperArm)

        // Right forearm group
        const rightForearmGroup = new THREE.Group()
        rightForearmGroup.position.y = -0.5
        rightArmGroup.add(rightForearmGroup)

        const rightForearm = new THREE.Mesh(upperArmGeometry, armMaterial)
        rightForearm.position.y = -0.25
        rightForearm.rotation.z = -Math.PI * 0.15
        rightForearmGroup.add(rightForearm)

        // Robot legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16)
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 })

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
        leftLeg.position.set(-0.2, -0.5, 0)
        robotGroup.add(leftLeg)

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
        rightLeg.position.set(0.2, -0.5, 0)
        robotGroup.add(rightLeg)

        // Robot feet
        const footGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.25)
        const footMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd })

        const leftFoot = new THREE.Mesh(footGeometry, footMaterial)
        leftFoot.position.set(-0.2, -0.85, 0.05)
        robotGroup.add(leftFoot)

        const rightFoot = new THREE.Mesh(footGeometry, footMaterial)
        rightFoot.position.set(0.2, -0.85, 0.05)
        robotGroup.add(rightFoot)

        // Robot chest details
        const chestDetailGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16)
        const chestDetailMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 })

        const upperChestDetail = new THREE.Mesh(chestDetailGeometry, chestDetailMaterial)
        upperChestDetail.position.set(0, 0.5, 0.35)
        upperChestDetail.rotation.x = Math.PI * 0.5
        robotGroup.add(upperChestDetail)

        const lowerChestDetail = new THREE.Mesh(chestDetailGeometry, chestDetailMaterial)
        lowerChestDetail.position.set(0, 0.3, 0.35)
        lowerChestDetail.rotation.x = Math.PI * 0.5
        robotGroup.add(lowerChestDetail)

        // Create solar panel
        const solarPanelGroup = new THREE.Group()
        leftForearmGroup.add(solarPanelGroup)
        solarPanelGroup.position.set(-0.3, -0.3, 0)
        solarPanelGroup.rotation.z = Math.PI * 0.5

        // Panel frame
        const frameGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8)
        const frameMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa })
        const frame = new THREE.Mesh(frameGeometry, frameMaterial)
        solarPanelGroup.add(frame)

        // Panel glass
        const glassGeometry = new THREE.BoxGeometry(1.1, 0.02, 0.7)
        const glassMaterial = new THREE.MeshPhongMaterial({
          color: 0x0044aa,
          shininess: 100,
          specular: 0x6666ff,
        })
        const glass = new THREE.Mesh(glassGeometry, glassMaterial)
        glass.position.y = 0.035
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

        // Position the entire robot
        robotGroup.position.y = -0.5
        robotGroup.rotation.y = -Math.PI * 0.2

        // Animation loop
        let frameId: number
        const animate = () => {
          frameId = requestAnimationFrame(animate)

          // Gentle bobbing motion
          const time = Date.now() * 0.001
          robotGroup.position.y = -0.5 + Math.sin(time) * 0.05

          // Subtle rotation
          robotGroup.rotation.y = -Math.PI * 0.2 + Math.sin(time * 0.5) * 0.1

          // Animate arms
          leftArmGroup.rotation.x = Math.sin(time * 0.7) * 0.05
          rightArmGroup.rotation.x = Math.sin(time * 0.7 + Math.PI) * 0.05

          // Animate solar panel
          solarPanelGroup.rotation.x = Math.sin(time * 0.5) * 0.1

          // Animate head
          head.rotation.y = Math.sin(time * 0.5) * 0.1

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

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize)
          cancelAnimationFrame(frameId)
          if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement)
          }
          // Dispose of geometries and materials
          ;[
            bodyGeometry,
            lowerBodyGeometry,
            headGeometry,
            visorGeometry,
            earGeometry,
            upperArmGeometry,
            legGeometry,
            footGeometry,
            chestDetailGeometry,
            frameGeometry,
            glassGeometry,
          ]
            .forEach((geometry) => geometry.dispose())

            [
              (bodyMaterial,
              lowerBodyMaterial,
              headMaterial,
              visorMaterial,
              earMaterial,
              armMaterial,
              legMaterial,
              footMaterial,
              chestDetailMaterial,
              frameMaterial,
              glassMaterial)
            ].forEach((material) => material.dispose())

          renderer.dispose()
        }
      } catch (error) {
        console.error("Error initializing Three.js:", error)
      }
    }

    importThreeJS()
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
