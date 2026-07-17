import { ref, onMounted } from 'vue'

/**
 * useGalerieVorschau – laedt Titel/Kuenstler/Bild fuers Saal-Raster.
 * Getrennt von useArchiv: beruehrt nie den Objekt-Cache, damit der
 * Miss-dann-Hit-Beweis auf /api/objekt/:id unveraendert bleibt.
 */
export function useGalerieVorschau() {
  const vorschau = ref(new Map())
  const zustand = ref('idle') // idle | laden | fertig | fehler

  async function laden() {
    zustand.value = 'laden'
    try {
      const res = await fetch('/api/galerie/vorschau')
      if (!res.ok) throw new Error(`Server ${res.status}`)
      const body = await res.json()
      vorschau.value = new Map((body.vorschau || []).map((e) => [e.id, e]))
      zustand.value = 'fertig'
    } catch (e) {
      zustand.value = 'fehler'
    }
  }

  onMounted(laden)

  return { vorschau, zustand }
}
