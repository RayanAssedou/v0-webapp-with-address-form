"use client"

export default function SketchfabStyles() {
  return (
    <style jsx global>{`
      /* Masquer l'attribution utilisateur et les contrôles Sketchfab */
      .sketchfab-embed-wrapper iframe {
        width: 100%;
        height: 100%;
      }
      
      /* Masquer le texte d'attribution en bas */
      .sketchfab-embed-wrapper p {
        display: none !important;
      }
      
      /* Masquer les contrôles qui pourraient apparaître */
      .sketchfab-embed-wrapper iframe + div,
      .sketchfab-embed-wrapper iframe + p {
        display: none !important;
      }
    `}</style>
  )
}
