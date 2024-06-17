<script lang="ts">
  export let images: { type: string; count: number }[];
  export let route: string;
</script>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
  {#each images as image}
    <a
      class="rounded-lg border border-secondary bg-secondary bg-opacity-20 p-4 text-center duration-300 hover:opacity-75"
      href="{route}/{encodeURIComponent(image.type)}"
    >
      <h3 class="text-xl font-medium text-primary">{image.type}</h3>
      <p class="mt-2 text-accent">
        {image.count.toLocaleString()} image{image.count > 1 ? "s" : ""}
      </p>
    </a>
  {/each}
</div>
