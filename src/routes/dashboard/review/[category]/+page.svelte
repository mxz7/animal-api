<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import dayjs from "dayjs";

  export let data;

  let loading = false;

  function enhanceFunction() {
    loading = true;
    return async () => {
      await invalidate("reviewimage");
      loading = false;
    };
  }
</script>

<svelte:head>
  <title>reviewing {$page.params.category} images / animals api</title>
</svelte:head>

<div class="flex w-fit justify-center gap-4 py-4">
  <form action="?/accept" method="post" use:enhance={enhanceFunction}>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn {loading ? 'btn-disabled' : ''} btn-success">Accept</button>
  </form>
  <form action="?/deny" method="post" use:enhance={enhanceFunction}>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-error {loading ? 'btn-disabled' : ''}">Deny</button>
  </form>

  {#if data.user.type === "admin"}
    <form action="?/denyAll" method="post" use:enhance={enhanceFunction}>
      <button class="btn btn-warning {loading ? 'btn-disabled' : ''}">Deny All</button>
    </form>

    <form action="?/deny" method="post" use:enhance={enhanceFunction}>
      <input type="hidden" name="userid" value={data.image.uploadedBy} />
      <button class="btn btn-warning {loading ? 'btn-disabled' : ''}">Ban User</button>
    </form>
  {/if}
</div>

<p>name: {data.image.name}</p>
<p>created at: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
<p>ip address: {data.image.ip}</p>

<img
  loading="lazy"
  decoding="async"
  src="https://animalscdn.maxz.dev/{data.image.type}/{data.image.id}"
  alt=""
/>
