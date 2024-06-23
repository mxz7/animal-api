<script lang="ts">
  import AnimalCard from "$lib/components/AnimalCard.svelte";

  export let images: { id: string; type: string }[];
  export let verified: 1 | 0;
</script>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
  {#each Array.from(new Set(images.map((i) => i.type))).map( (i) => ({ type: i, count: images.filter((img) => img.type === i).length }), ) as type}
    <AnimalCard
      href={`/dashboard/images/${encodeURIComponent(type.type)}/${verified}`}
      title={type.type}
      desc="{type.count.toLocaleString()} image{type.count > 1 ? 's' : ''}"
    />
  {/each}
</div>
