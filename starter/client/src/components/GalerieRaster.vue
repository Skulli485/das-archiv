<script setup>
import { useGalerie } from '../composables/useGalerie.js'

const emit = defineEmits(['waehle'])

const { ids, zustand } = useGalerie()

function onKey(e, id) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('waehle', id)
  }
}
</script>

<template>
  <section class="galerie" aria-label="Galerie der Objekte">
    <p v-if="zustand === 'laden'" class="hinweis">Galerie wird geladen …</p>
    <p v-else-if="zustand === 'fehler'" class="hinweis fehler">Galerie nicht erreichbar.</p>
    <div v-else class="raster">
      <button
        v-for="id in ids"
        :key="id"
        class="kachel"
        tabindex="0"
        @click="emit('waehle', id)"
        @keydown="onKey($event, id)"
      >
        <span class="nr">{{ id }}</span>
        <span class="label">Objekt {{ id }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.galerie {
  margin: 0 0 2rem;
}
.hinweis {
  color: var(--tinte-weich);
  padding: 1rem 0;
}
.raster {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}
.kachel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.2rem 0.5rem;
  border: 1px solid var(--linie);
  border-radius: 0.7rem;
  background: var(--papier-tief);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: var(--sans);
  color: var(--tinte);
}
.kachel:hover {
  border-color: var(--messing);
}
.kachel:focus-visible {
  outline: 2px solid var(--messing);
  outline-offset: 2px;
}
.kachel .nr {
  font-family: var(--mono);
  font-size: 1.1rem;
  font-weight: 600;
}
.kachel .label {
  font-size: 0.8rem;
  color: var(--tinte-weich);
}
</style>
