<script lang="ts">
  import { auth } from "$lib/stores";
  import dayjs from "dayjs";
  import { onDestroy, onMount } from "svelte";
  import DeleteButton from "./deleteButton.svelte";
  import LikeButton from "./likeButton.svelte";
  import ReportButton from "./reportButton.svelte";

  export let data;
  let admin = false;

  let interval: NodeJS.Timeout;

  onMount(() => {
    interval = setInterval(() => {
      if ($auth) {
        clearInterval(interval);
        if ($auth.authenticated) {
          if ($auth.user.type === "admin") {
            admin = true;
          }
        }
      }
    }, 250);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<svelte:head>
  <title>{data.image.name || data.image.id} / animals</title>

  <meta property="og:image" content="https://r2.animals.maxz.dev/{data.image.id}" />
  <meta property="og:type" content="image" />
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <div class="w-full md:w-full md:max-w-4xl">
    <div class="flex w-fit flex-col-reverse justify-center gap-4 md:w-full md:flex-row">
      <div class="px-4 md:w-2/5 md:px-0">
        <img
          class="w-full rounded-lg"
          src="https://r2.animals.maxz.dev/{data.image.type}/{data.image.id}"
          alt={data.image.name}
        />
      </div>
      <div class="px-4">
        <h1
          class="font-semibold text-primary {data.image.name
            ? 'text-2xl md:text-3xl'
            : 'md:text-lg'}"
        >
          {data.image.name || data.image.id}
        </h1>
        {#if data.image.uploaderUsername}
          <h2 class="mb-3 text-sm">by {data.image.uploaderUsername}</h2>
        {/if}

        <p>Uploaded: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
        <p>{data.image.likes.toLocaleString()} like{data.image.likes === 1 ? "" : "s"}</p>
        <div class="mt-4 flex gap-4">
          <LikeButton addLike={() => data.image.likes++} />
          <ReportButton reportForm={data.reportForm} />

          {#if admin}
            <DeleteButton />
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
