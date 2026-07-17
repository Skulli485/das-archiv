import { ref, onMounted } from 'vue'

/**
 * useGalerie – laedt die Liste der kuratierten IDs einmalig.
 */
export function useGalerie() {
  const ids = ref([])
  const zustand = ref('idle') // idle | laden | fertig | fehler

  async function laden() {
    zustand.value = 'laden'
    try {
      const res = await fetch('/api/galerie')
      if (!res.ok) throw new Error(`Server ${res.status}`)
      const body = await res.json()
      ids.value = body.ids
      zustand.value = 'fertig'
    } catch (e) {
      zustand.value = 'fehler'
    }
  }

  onMounted(laden)

  return { ids, zustand }
}
