<script setup>
defineProps({
  meta: { type: Object, default: null } // { source, ms, ttl }
})
</script>

<template>
  <div v-if="meta" class="laufzettel" :class="meta.source">
    <span class="quelle">{{ meta.source === 'netz' ? 'Tresor' : 'Tisch' }}</span>
    <span class="ms">{{ meta.ms }} ms</span>
    <span v-if="meta.source === 'cache'" class="ttl">TTL {{ meta.ttl }}s</span>
  </div>
</template>

<style scoped>
.laufzettel {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  font-family: var(--mono);
  border: 1px solid var(--linie);
}
.laufzettel.netz {
  background: color-mix(in srgb, var(--messing) 10%, transparent);
  border-color: color-mix(in srgb, var(--messing) 40%, var(--linie));
  color: var(--messing);
}
.laufzettel.cache {
  background: color-mix(in srgb, var(--patina) 10%, transparent);
  border-color: color-mix(in srgb, var(--patina) 40%, var(--linie));
  color: var(--patina);
}
.ms {
  font-variant-numeric: tabular-nums;
  color: var(--tinte-weich);
}
.ttl {
  color: var(--tinte-weich);
}
</style>
