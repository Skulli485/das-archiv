<script setup>
import { useGalerie } from '../composables/useGalerie.js'
import { useGalerieVorschau } from '../composables/useGalerieVorschau.js'

const emit = defineEmits(['waehle'])

const { ids, zustand } = useGalerie()
const { vorschau } = useGalerieVorschau()

function onKey(e, id) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('waehle', id)
  }
}
</script>

<template>
  <section class="galerie" aria-label="Galerie der Objekte">
    <p class="saaltitel">Saal I — Ständige Sammlung</p>
    <p v-if="zustand === 'laden'" class="hinweis">Galerie wird geladen …</p>
    <p v-else-if="zustand === 'fehler'" class="hinweis fehler">Galerie nicht erreichbar.</p>
    <div v-else class="raster">
      <button
        v-for="id in ids"
        :key="id"
        class="rahmen"
        tabindex="0"
        @click="emit('waehle', id)"
        @keydown="onKey($event, id)"
      >
        <span class="passepartout">
          <img
            v-if="vorschau.get(id)?.bild"
            :src="vorschau.get(id).bild"
            :alt="vorschau.get(id).titel"
            loading="lazy"
            width="140"
            height="140"
            class="werk"
          />
          <span v-else class="werk-platzhalter">{{ id }}</span>
        </span>
        <span class="plakette">
          <span class="plakette-titel">{{ vorschau.get(id)?.titel || `Objekt ${id}` }}</span>
          <span v-if="vorschau.get(id)?.kuenstler" class="plakette-kuenstler">{{ vorschau.get(id).kuenstler }}</span>
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.galerie {
  margin: 0 0 2.5rem;
}
.saaltitel {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tinte-weich);
  margin: 0 0 0.9rem;
}
.hinweis {
  color: var(--tinte-weich);
  padding: 1rem 0;
}
.raster {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.1rem;
}
.rahmen {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0.5rem;
  background: linear-gradient(155deg, var(--messing-hell), var(--messing) 55%, #8a601f);
  border: none;
  border-radius: 0.25rem;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.25) inset,
    0 6px 14px -6px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-family: var(--sans);
  color: var(--tinte);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.rahmen:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.25) inset,
    0 10px 20px -6px rgba(0, 0, 0, 0.55);
}
.rahmen:focus-visible {
  outline: 2px solid var(--patina);
  outline-offset: 3px;
}
.passepartout {
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  background: var(--papier);
  padding: 0.6rem;
  border: 1px solid var(--linie);
}
.werk {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.werk-platzhalter {
  font-family: var(--mono);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--tinte-weich);
}
.plakette {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.55rem 0.3rem 0.3rem;
  text-align: center;
}
.plakette-titel {
  font-family: var(--serif);
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.25;
  color: #2a1c0c;
}
.plakette-kuenstler {
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #4a341a;
}
</style>
