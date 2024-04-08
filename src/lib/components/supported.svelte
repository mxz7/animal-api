<script lang="ts">
  import type { Types } from "$lib/types/api";

  export let categories: Types | Promise<Types>;
</script>

<h2 class="text-2xl font-medium text-primary" id="supported">Supported Animal Types</h2>
{#await categories}
  <div class="flex w-full justify-center">
    <span class="loading-spinner" />
  </div>
{:then categories}
  <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
    {#each categories as category}
      <a
        href="/{category.type}/random"
        class="mt-2 rounded-lg border border-secondary bg-secondary bg-opacity-20 p-4 text-center"
      >
        <h3 class="text-2xl font-medium text-primary">{category.type}</h3>
        <p class="mt-2 text-lg text-accent">
          {category.count.toLocaleString()} image{category.count > 1 ? "s" : ""}
        </p>
      </a>
    {/each}
  </div>
  <a class="link mt-4 block w-full text-center text-secondary" href="/dashboard/upload">
    Submit pictures of your own animals here
  </a>
{/await}
