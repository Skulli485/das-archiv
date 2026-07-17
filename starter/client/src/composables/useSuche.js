import { ref } from 'vue'

/**
 * useSuche – Capstone: Such-Endpunkt mit Triple-Zustand.
 */
export function useSuche() {
  const zustand = ref('idle')
  const ergebnisse = ref([])
  const query = ref('')

  let controller = null
  let lauf = 0

  async function suchen(q) {
    controller?.abort()
    controller = new AbortController()
    const meine = ++lauf
    query.value = q
    zustand.value = 'laden'
    try {
      const res = await fetch(`/api/suche?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      if (!res.ok) throw new Error(`Server ${res.status}`)
      const body = await res.json()
      if (meine !== lauf) return
      ergebnisse.value = body.ergebnisse || []
      zustand.value = 'fertig'
    } catch (e) {
      if (e.name === 'AbortError' || meine !== lauf) return
      zustand.value = 'fehler'
    }
  }

  function leeren() {
    controller?.abort()
    lauf++
    zustand.value = 'idle'
    ergebnisse.value = []
    query.value = ''
  }

  return { zustand, ergebnisse, query, suchen, leeren }
}
