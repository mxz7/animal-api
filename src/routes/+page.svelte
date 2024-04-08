<script lang="ts">
  import dayjs from "dayjs";

  export let data;
</script>

<svelte:head>
  <title>animals API</title>
</svelte:head>

<h1 class="mt-16 w-full text-center text-5xl font-bold text-primary md:text-6xl">animals API</h1>
<p class="text-center text-sm italic text-secondary">
  served {#await data.served}
    ...
  {:then served}
    {served.toLocaleString()}
  {/await} random animals since {#await data.since}
    ...
  {:then since}
    {dayjs(since).format("YYYY-MM-DD")}
  {/await}
</p>

<div class="mt-48 flex w-full justify-center">
  <div class="w-full max-w-4xl px-4 md:px-0">
    <h2 class="text-2xl font-medium text-primary" id="supported">Supported Animal Types</h2>
    {#await data.categories}
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
  </div>
</div>
