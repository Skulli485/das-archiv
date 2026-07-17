<script setup>
import { useArchiv } from './composables/useArchiv.js'

const GALERIE_IDS = [436535, 436532, 436530, 436528, 436524, 436521, 436518, 436516]

const { zustand, karte, meta, laden } = useArchiv()
</script>

<template>
  <main class="raum">
    <header class="kopf">
      <p class="augenbraue">Das Archiv</p>
      <h1>Der Leseraum</h1>
    </header>

    <nav class="testliste">
      <button v-for="id in GALERIE_IDS" :key="id" @click="laden(id)">{{ id }}</button>
    </nav>

    <p v-if="zustand === 'idle'">Wähle ein Objekt.</p>
    <p v-else-if="zustand === 'laden'">Lädt …</p>
    <article v-else-if="zustand === 'fertig' && karte">
      <h2>{{ karte.titel }}</h2>
      <p>{{ karte.kuenstler }} · {{ karte.jahr }}</p>
      <p class="laufzettel">{{ meta.source }} · {{ meta.ms }} ms</p>
    </article>
    <p v-else-if="zustand === 'fehler'">Diese Karte konnte nicht geladen werden.</p>
  </main>
</template>

<style scoped>
.raum {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.25rem 5rem;
}
.augenbraue {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--messing);
  margin: 0 0 0.6rem;
}
.kopf h1 {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(2rem, 5vw, 2.9rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 0.75rem;
  color: var(--tinte);
}
.testliste {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 1.5rem;
}
.laufzettel {
  color: var(--tinte-weich);
  font-family: var(--mono);
  font-size: 0.85rem;
}
</style>
