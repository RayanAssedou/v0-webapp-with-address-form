export interface PBRTextures {
  diffuse?: any
  normal?: any
  metallic?: any
  roughness?: any
}

export async function loadPBRTextures(THREE: any, basePath: string): Promise<PBRTextures> {
  const textureLoader = new THREE.TextureLoader()

  const loadTexture = (path: string) => {
    return new Promise<any>((resolve, reject) => {
      textureLoader.load(
        path,
        (texture) => resolve(texture),
        undefined,
        (error) => {
          console.warn(`Failed to load texture: ${path}`, error)
          resolve(null)
        },
      )
    })
  }

  try {
    const [diffuse, normal, metallic, roughness] = await Promise.all([
      loadTexture(`${basePath}/texture_diffuse.png`),
      loadTexture(`${basePath}/texture_normal.png`),
      loadTexture(`${basePath}/texture_metallic.png`),
      loadTexture(`${basePath}/texture_roughness.png`),
    ])

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
