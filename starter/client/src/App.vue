<script setup>
import { ref } from 'vue'
import GalerieRaster from './components/GalerieRaster.vue'
import KartenDetail from './components/KartenDetail.vue'
import SuchForm from './components/SuchForm.vue'

const gewaehlt = ref(null)

function waehle(id) {
  gewaehlt.value = id
}
</script>

<template>
  <main class="raum">
    <header class="kopf">
      <p class="augenbraue">Das Archiv</p>
      <h1>Der Leseraum</h1>
      <p class="unterzeile">
        Eine Grenze, ein Gedächtnis. Wähle ein Objekt aus der Galerie oder suche im Met Museum.
      </p>
    </header>

    <SuchForm @waehle="waehle" />
    <GalerieRaster @waehle="waehle" />
    <KartenDetail :id="gewaehlt" />
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
.unterzeile {
  color: var(--tinte-weich);
  max-width: 56ch;
  line-height: 1.6;
  margin: 0 0 2rem;
}
</style>
