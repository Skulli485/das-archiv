<script setup>
import { ref, onMounted } from 'vue'

const erreichbar = ref(null) // null | true | false

onMounted(async () => {
  try {
    const res = await fetch('/api/health')
    erreichbar.value = res.ok
  } catch {
    erreichbar.value = false
  }
})
</script>

<template>
  <main class="raum">
    <header class="kopf">
      <p class="augenbraue">Das Archiv</p>
      <h1>Der Leseraum</h1>
    </header>

    <p v-if="erreichbar === null">Prüfe die Grenze …</p>
    <p v-else-if="erreichbar">Die Grenze ist erreichbar.</p>
    <p v-else>Die Grenze ist nicht erreichbar.</p>
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
</style>
