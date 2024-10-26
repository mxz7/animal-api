<script>
  import TypeGroup from "./TypeGroup.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>images / dashboard / animals</title>
</svelte:head>

<div class="w-full">
  {#await data.images}
    <span class="loading loading-spinner text-accent"></span>
  {:then images}
    {#if images.length === 0}
      <p>
        No uploaded images. <a href="/dashboard/upload" class="link link-accent">Upload here</a>
      </p>
    {/if}
    {@const verified = images.filter((i) => i.verified)}
    {@const unverified = images.filter((i) => !i.verified)}
    {#if verified.length > 0}
      <div class="divider divider-success">Verified</div>
      <TypeGroup verified={1} images={verified} />
    {/if}
    {#if unverified.length > 0}
      <div class="divider divider-error">Unverified</div>
      <TypeGroup verified={0} images={unverified} />
    {/if}
  {/await}
</div>
