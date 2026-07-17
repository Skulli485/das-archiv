<script setup>
import { ref } from 'vue'
import { useSuche } from '../composables/useSuche.js'

const emit = defineEmits(['waehle'])

const { zustand, ergebnisse, suchen } = useSuche()
const input = ref('')
let timer = null

function onInput(e) {
  const q = e.target.value.trim()
  clearTimeout(timer)
  if (!q) return
  // Debounce 350ms
  timer = setTimeout(() => suchen(q), 350)
}

function onKey(e, id) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('waehle', id)
  }
}
</script>

<template>
  <section class="suche" aria-label="Suche">
    <input
      v-model="input"
      @input="onInput"
      type="search"
      placeholder="Suche im Met Museum …"
      class="such-input"
      aria-label="Suchbegriff"
    />

    <div v-if="zustand === 'laden'" class="such-hinweis">Suche läuft …</div>
    <div v-else-if="zustand === 'fehler'" class="such-hinweis fehler">Suche fehlgeschlagen.</div>
    <div v-else-if="zustand === 'fertig' && ergebnisse.length === 0" class="such-hinweis">
      Nichts gefunden.
    </div>
    <ul v-else-if="zustand === 'fertig'" class="such-liste">
      <li v-for="treffer in ergebnisse" :key="treffer.id">
        <button
          class="treffer"
          tabindex="0"
          @click="emit('waehle', treffer.id)"
          @keydown="onKey($event, treffer.id)"
        >
          <img
            v-if="treffer.bild"
            :src="treffer.bild"
            :alt="treffer.titel"
            loading="lazy"
            width="60"
            height="60"
            class="treffer-bild"
          />
          <span class="treffer-text">
            <span class="treffer-titel">{{ treffer.titel }}</span>
            <span class="treffer-kuenstler">{{ treffer.kuenstler }}</span>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.suche {
  margin: 0 0 2rem;
  border: 1px solid var(--linie);
  border-radius: 0.7rem;
  padding: 1rem;
  background: var(--papier-tief);
}
.such-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--linie);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--papier);
  color: var(--tinte);
}
.such-input:focus-visible {
  outline: 2px solid var(--messing);
  outline-offset: 1px;
}
.such-hinweis {
  color: var(--tinte-weich);
  padding: 0.6rem 0;
  font-size: 0.9rem;
}
.such-hinweis.fehler { color: var(--messing); }
.such-liste {
  list-style: none;
  padding: 0;
  margin: 0.6rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.treffer {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--linie);
  border-radius: 0.5rem;
  background: var(--papier);
  cursor: pointer;
  text-align: left;
}
.treffer:hover { border-color: var(--messing); }
.treffer:focus-visible {
  outline: 2px solid var(--messing);
  outline-offset: 1px;
}
.treffer-bild {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.3rem;
  flex: none;
}
.treffer-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.treffer-titel {
  font-weight: 600;
  font-size: 0.92rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.treffer-kuenstler {
  font-size: 0.82rem;
  color: var(--tinte-weich);
}
</style>
