import type { Texture } from "three"

export interface TextureSet {
  diffuse?: Texture
  normal?: Texture
  metallic?: Texture
  roughness?: Texture
  shaded?: Texture
}

export async function loadTextures(
  textureLoader: any,
  paths: {
    diffuse?: string
    normal?: string
    metallic?: string
    roughness?: string
    shaded?: string
  },
): Promise<TextureSet> {
  const textures: TextureSet = {}

  try {
    if (paths.diffuse) {
      textures.diffuse = await new Promise((resolve, reject) => {
        textureLoader.load(paths.diffuse, resolve, undefined, reject)
      })
    }

    if (paths.normal) {
      textures.normal = await new Promise((resolve, reject) => {
        textureLoader.load(paths.normal, resolve, undefined, reject)
      })
    }

    if (paths.metallic) {
      textures.metallic = await new Promise((resolve, reject) => {
        textureLoader.load(paths.metallic, resolve, undefined, reject)
      })
    }

    if (paths.roughness) {
      textures.roughness = await new Promise((resolve, reject) => {
        textureLoader.load(paths.roughness, resolve, undefined, reject)
      })
    }

    if (paths.shaded) {
      textures.shaded = await new Promise((resolve, reject) => {
        textureLoader.load(paths.shaded, resolve, undefined, reject)
      })
    }
  } catch (error) {
    console.error("Error loading textures:", error)
  }

  return textures
}
