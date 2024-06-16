<script>
  export let data;
</script>

<svelte:head>
  <title>review / dashboard / animals</title>
</svelte:head>

{#if data.categories.length > 0}
  <div class="mt-14 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
    {#each data.categories as category}
      <a
        class="rounded-lg border border-secondary bg-secondary bg-opacity-20 p-4 text-center duration-300 hover:opacity-75"
        href="/dashboard/review/{encodeURIComponent(category.type)}"
      >
        <h3 class=" text-xl font-medium text-primary">{category.type}</h3>
        <p class="mt-2 text-accent">
          {category.amount.toLocaleString()} image{category.amount > 1 ? "s" : ""}
        </p>
      </a>
    {/each}
  </div>
{:else}
  <p>No images to review</p>
{/if}
