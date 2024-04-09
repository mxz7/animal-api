<script lang="ts">
  export let images: { id: string; type: string }[];
  export let verified: 1 | 0;
</script>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
  {#each Array.from(new Set(images.map((i) => i.type))).map( (i) => ({ type: i, count: images.filter((img) => img.type === i).length }), ) as type}
    <a
      class="rounded-lg border border-secondary bg-secondary bg-opacity-20 p-4 text-center duration-300 hover:opacity-75"
      href="/dashboard/images/{encodeURIComponent(type.type)}/{verified}"
    >
      <h3 class="text-xl font-medium text-primary">{type.type}</h3>
      <p class="mt-2 text-accent">
        {type.count.toLocaleString()} image{type.count > 1 ? "s" : ""}
      </p>
    </a>
  {/each}
</div>
