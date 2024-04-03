<script>
  import { Loader2 } from "lucide-svelte";

  export let data;
</script>

<svelte:head>
  <title>images / dashboard / animals API</title>
</svelte:head>

{#await data.images}
  <div class="h-fit w-fit">
    <Loader2 class="animate-spin text-primary" />
  </div>
{:then images}
  {#if images.length === 0}
    <p>You have no uploaded images</p>
  {:else}
    <div class="w-full columns-2 break-inside-avoid gap-2">
      {#each images as image}
        <a href="/img/{image.id}" class="block pb-2">
          <img
            class="w-full rounded-lg"
            src="https://animalscdn.maxz.dev/{image.id}"
            alt="user uploaded {image.type}"
          />
        </a>
      {/each}
    </div>
  {/if}
{/await}
