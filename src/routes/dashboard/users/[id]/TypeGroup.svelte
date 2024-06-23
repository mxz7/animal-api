<script lang="ts">
  import AnimalCard from "$lib/components/AnimalCard.svelte";

  export let images: { type: string; count: number }[];
  export let route: string;
</script>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
  {#each images as image}
    <AnimalCard
      href="{route}/{encodeURIComponent(image.type)}"
      title={image.type}
      desc="{image.count.toLocaleString()} image{image.count > 1 ? 's' : ''}"
    />
  {/each}
</div>
