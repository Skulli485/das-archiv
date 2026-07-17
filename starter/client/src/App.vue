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
  <div class="saal">
    <header class="wand">
      <p class="augenbraue">Das Archiv</p>
      <h1>Der Leseraum</h1>
      <p class="unterzeile">
        Eine Grenze, ein Gedächtnis. Wähle ein Objekt aus der Galerie oder suche im Met Museum.
      </p>
    </header>

    <main class="raum">
      <SuchForm @waehle="waehle" />
      <GalerieRaster @waehle="waehle" />
      <KartenDetail :id="gewaehlt" />
    </main>
  </div>
</template>

<style scoped>
.saal {
  min-height: 100vh;
}
.wand {
  background:
    radial-gradient(80% 140% at 50% -20%, color-mix(in srgb, var(--messing) 22%, transparent), transparent 65%),
    linear-gradient(180deg, var(--wand) 0%, var(--wand-tief) 100%);
  padding: 3.5rem 1.25rem 3rem;
  border-bottom: 3px solid var(--messing);
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.45);
}
.augenbraue {
  max-width: 720px;
  margin: 0 auto 0.6rem;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--messing-hell);
}
.wand h1 {
  max-width: 720px;
  margin: 0 auto 0.75rem;
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(2rem, 5vw, 2.9rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: #f6ede0;
}
.unterzeile {
  max-width: 56ch;
  margin: 0 auto;
  color: color-mix(in srgb, #f6ede0 75%, var(--messing-hell));
  line-height: 1.6;
}
.raum {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
}
</style>
