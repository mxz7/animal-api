<script lang="ts">
  import { page } from "$app/stores";

  let { data } = $props();
</script>

<h1 class="text-lg text-primary">
  {$page.params.type} images {$page.params.page} by id:{$page.params.id}
</h1>

<div class="grid w-full grid-cols-2 gap-2">
  {#each data.result as image}
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
