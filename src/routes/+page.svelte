<script lang="ts">
  import dayjs from "dayjs";

  export let data;
</script>

<svelte:head>
  <title>animals API</title>
</svelte:head>

<h1 class="mt-16 w-full text-center text-4xl font-bold text-primary sm:text-6xl">animals API</h1>
<p class="text-center italic text-secondary">
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
