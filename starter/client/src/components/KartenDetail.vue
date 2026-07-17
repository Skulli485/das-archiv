<script setup>
import { watch } from 'vue'
import { useArchiv } from '../composables/useArchiv.js'
import LaufzettelBadge from './LaufzettelBadge.vue'

const props = defineProps({
  id: { type: Number, default: null }
})

const { zustand, karte, meta, laden } = useArchiv()

watch(() => props.id, (neu) => {
  if (neu !== null) laden(neu)
}, { immediate: true })
</script>

<template>
  <section class="detail" aria-live="polite">
    <!-- idle -->
    <p v-if="zustand === 'idle'" class="platzhalter">
      Wähle ein Objekt aus der Galerie.
    </p>

    <!-- laden (Skeleton) -->
    <div v-if="zustand === 'laden'" class="skeleton" aria-busy="true">
      <div class="skeleton-bild"></div>
      <div class="skeleton-zeile gross"></div>
      <div class="skeleton-zeile"></div>
      <div class="skeleton-zeile kurz"></div>
    </div>

    <!-- fertig -->
    <Transition name="auf" mode="out-in">
      <article v-if="zustand === 'fertig' && karte" :key="karte.id" class="karte">
        <img
          v-if="karte.bild"
          :src="karte.bild"
          :alt="`${karte.titel} – ${karte.kuenstler}`"
          loading="lazy"
          width="400"
          height="300"
          class="bild"
        />
        <div v-else class="bild-platzhalter">Kein Bild</div>
        <div class="kopf">
          <h2>{{ karte.titel }}</h2>
          <p class="kuenstler">{{ karte.kuenstler }}</p>
        </div>
        <dl class="felder">
          <div><dt>Jahr</dt><dd>{{ karte.jahr }}</dd></div>
          <div><dt>Material</dt><dd>{{ karte.material }}</dd></div>
          <div><dt>Abteilung</dt><dd>{{ karte.abteilung }}</dd></div>
        </dl>
        <LaufzettelBadge :meta="meta" />
      </article>
    </Transition>

    <!-- fehler -->
    <p v-if="zustand === 'fehler'" class="fehler">
      Diese Karte konnte nicht geladen werden.
    </p>
  </section>
</template>

<style scoped>
.detail {
  min-height: 320px;
}
.platzhalter {
  color: var(--tinte-weich);
  padding: 2rem 0;
  text-align: center;
}
/* Skeleton */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.skeleton-bild {
  width: 100%;
  height: 300px;
  background: var(--papier-tief);
  border-radius: 0.5rem;
  animation: pulsen 1.3s ease-in-out infinite;
}
.skeleton-zeile {
  height: 0.9rem;
  background: var(--papier-tief);
  border-radius: 0.3rem;
  animation: pulsen 1.3s ease-in-out infinite;
}
.skeleton-zeile.gross { width: 60%; height: 1.4rem; }
.skeleton-zeile.kurz { width: 40%; }
@keyframes pulsen {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}
/* Karte */
.karte {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.bild {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--linie);
}
.bild-platzhalter {
  width: 100%;
  max-width: 400px;
  height: 300px;
  display: grid;
  place-items: center;
  background: var(--papier-tief);
  border-radius: 0.5rem;
  color: var(--tinte-weich);
  font-size: 0.9rem;
}
.kopf h2 {
  font-family: var(--serif);
  font-size: 1.4rem;
  margin: 0;
}
.kuenstler {
  color: var(--tinte-weich);
  margin: 0.2rem 0 0;
}
.felder {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin: 0;
}
.felder div {
  border: 1px solid var(--linie);
  border-radius: 0.4rem;
  padding: 0.4rem 0.6rem;
  background: var(--papier-tief);
}
.felder dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tinte-weich);
}
.felder dd {
  margin: 0.15rem 0 0;
  font-size: 0.92rem;
}
.fehler {
  color: var(--messing);
  padding: 2rem 0;
  text-align: center;
}
/* Transition */
.auf-enter-active, .auf-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.auf-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.auf-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
@media (prefers-reduced-motion: reduce) {
  .auf-enter-active, .auf-leave-active {
    transition: none;
  }
  .skeleton-bild, .skeleton-zeile {
    animation: none;
  }
}
</style>
