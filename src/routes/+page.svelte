<script lang="ts">
  import Supported from "$lib/components/supported.svelte";
  import Usage from "$lib/components/usage.svelte";
  import dayjs from "dayjs";

  export let data;
</script>

<svelte:head>
  <title>animals API</title>
  <meta
    name="description"
    content="Random animals API with multiple different types of animals including cats, dogs and capybaras. Upload your own pets to be seen by many."
  />
</svelte:head>

<h1
  class="mt-16 w-full bg-gradient-to-r from-primary to-info bg-clip-text text-center text-5xl font-bold text-transparent md:text-8xl"
>
  animals API
</h1>
<p class="text-center text-xs italic text-accent md:text-sm">
  served {#await data.served}
    ...
  {:then served}
    {served.toLocaleString()}
  {/await} images since {#await data.since}
    ...
  {:then since}
    {dayjs(since).format("YYYY-MM-DD")}
  {/await}
</p>

<div class="mt-48 flex w-full justify-center">
  <div class="w-full max-w-4xl px-4 md:px-0">
    <Supported categories={data.categories} />

    <Usage categories={data.categories} result={data.image} />
  </div>
</div>
