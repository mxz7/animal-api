<script>
  export let data;
</script>

{#await data.images}
  <span class="loading loading-spinner"></span>
{:then images}
  <div class="w-full columns-2 break-inside-avoid gap-2">
    {#each images as image}
      <a href="/{image.type}/{image.id}" class="block break-inside-avoid-column pb-2">
        <img
          class="w-full rounded-lg"
          src="https://r2.animals.maxz.dev/{image.type}/{image.id}"
          alt="user uploaded {image.type}"
          loading="lazy"
        />
      </a>
    {/each}
  </div>
{/await}
