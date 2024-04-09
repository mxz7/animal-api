<script lang="ts">
  import { PUBLIC_API_URL } from "$env/static/public";
  import type { Image, Types } from "$lib/types/api";

  export let categories: Types | Promise<Types>;

  let selected: string;
  export let result: Promise<Image> | Image | undefined;

  $: {
    (async () => {
      if (typeof selected === "string") {
        if (result && (await result).type === selected) {
          // do nothing
        } else {
          console.log("fetching new result");
          result = fetch(`/api/${selected}/random`).then((r) => r.json());
        }
      }
    })();
  }
</script>

<h2 class="mt-14 text-2xl font-medium text-primary" id="usage">API Usage</h2>
{#await categories}
  <span class="loading loading-spinner"></span>
{:then categories}
  <select class="select select-bordered select-sm mt-2 max-w-xs" bind:value={selected}>
    {#each categories as category}
      {#if category.type === "cat"}
        <option selected value={category.type}>{category.type}</option>
      {:else}
        <option value={category.type}>{category.type}</option>
      {/if}
    {/each}
  </select>
  <div class="mt-4 w-full">
    <div class="w-fit rounded-lg bg-black bg-opacity-20 p-4">
      <code>{PUBLIC_API_URL}/{selected}/random</code>
    </div>

    <p class="mt-2">Result:</p>
    {#if result}
      {#await result}
        <span class="loading loading-spinner"></span>
      {:then result}
        <div class="w-fit rounded-lg bg-black bg-opacity-20 p-4">
          <code class="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</code>
        </div>
      {/await}
    {/if}
  </div>
{/await}
