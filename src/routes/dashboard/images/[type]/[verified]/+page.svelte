<script>
  let { data } = $props();
</script>

{#await data.images}
  <span class="loading loading-spinner"></span>
{:then images}
  <div class="grid w-full grid-cols-2 gap-2">
    {#each images as image}
      <a
        href="/{image.type}/{image.id}"
        target="_blank"
        class="relative h-full min-h-52 w-full rounded-lg"
      >
        <img
          class="h-full w-full rounded-lg object-cover"
          src="https://r2.animals.maxz.dev/{image.type}/{image.id}"
          alt="user uploaded {image.type}"
          loading="lazy"
          decoding="async"
        />
        <div
          class="absolute bottom-0 w-full bg-base-300 bg-opacity-75 py-2 text-center backdrop-blur"
        >
          {image.name} - {new Date(image.createdAt).toLocaleString()}
        </div>
      </a>
    {/each}
  </div>
{/await}
