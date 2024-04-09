<script>
  export let data;
</script>

<svelte:head>
  <title>images / dashboard / animals API</title>
</svelte:head>

{#await data.images}
  <span class="loading loading-spinner text-accent"></span>
{:then images}
  {#if images.length === 0}
    <p>You have no uploaded images</p>
  {:else}
    <div class="w-full columns-2 break-inside-avoid gap-2">
      {#each images as image}
        <a href="/{image.type}/{image.id}" class="block break-inside-avoid-column pb-2">
          <img
            class="w-full rounded-lg"
            src="https://animalscdn.maxz.dev/{image.type}/{image.id}"
            alt="user uploaded {image.type}"
            loading="lazy"
          />
        </a>
      {/each}
    </div>
  {/if}
{/await}
