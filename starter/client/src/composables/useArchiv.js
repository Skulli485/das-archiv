import { ref, onUnmounted } from 'vue'

/**
 * useArchiv – das Composable mit dem Triple.
 * Vier Zustaende: idle | laden | fertig | fehler
 * Zwei Waechter: AbortController + mitzaehlende Anfrage-Nummer.
 */
export function useArchiv() {
  const zustand = ref('idle')
  const karte = ref(null)
  const meta = ref(null) // { source, ms }
  let controller = null
  let lauf = 0

  async function laden(id) {
    controller?.abort()
    controller = new AbortController()
    const meine = ++lauf
    zustand.value = 'laden'
    try {
      const res = await fetch(`/api/objekt/${id}`, { signal: controller.signal })
      if (!res.ok) throw new Error(`Server ${res.status}`)
      const body = await res.json()
      if (meine !== lauf) return // neuere Anfrage hat übernommen
      karte.value = body.data
      meta.value = { source: body.source, ms: body.ms }
      zustand.value = 'fertig'
    } catch (e) {
      if (e.name === 'AbortError' || meine !== lauf) return
      zustand.value = 'fehler'
    }
  }

  onUnmounted(() => {
    controller?.abort()
  })

  return { zustand, karte, meta, laden }
}
