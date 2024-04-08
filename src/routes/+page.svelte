<script lang="ts">
  import Supported from "$lib/components/supported.svelte";
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
    <Supported categories={data.categories} />
  </div>
</div>
