<script lang="ts">
  import type { Types } from "$lib/types/api";
  import AnimalCard from "./AnimalCard.svelte";

  interface Props {
    categories: Types | Promise<Types>;
  }

  let { categories }: Props = $props();
</script>

<h2 class="text-2xl font-medium text-primary" id="supported">Supported Animal Types</h2>
{#await categories}
  <div class="flex w-full justify-center">
    <span class="loading-spinner"></span>
  </div>
{:then categories}
  <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
    {#each categories as category}
      <AnimalCard
        href="/{category.type}/random"
        title={category.type}
        desc={`${category.count.toLocaleString()} image${category.count > 1 ? "s" : ""}`}
      />
    {/each}
  </div>
  <a class="link mt-4 block w-full text-center text-secondary" href="/dashboard/upload">
    Submit pictures of your own animals here
  </a>
{/await}
