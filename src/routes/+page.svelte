<script lang="ts">
  import dayjs from "dayjs";

  export let data;
</script>

<svelte:head>
  <title>animals API</title>
</svelte:head>

<h1 class="mt-16 w-full text-center text-4xl font-bold text-primary sm:text-6xl">animal API</h1>
<p class="text-center italic text-accent">
  served {data.served} requests since {dayjs(data.since).format("YYYY-MM-DD")}
</p>
