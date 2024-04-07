<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import dayjs from "dayjs";

  export let data;
</script>

<svelte:head>
  <title>reviewing {$page.params.category} images / animals api</title>
</svelte:head>

<div class="flex w-fit justify-center gap-4 py-4">
  <form action="?/accept" method="post" use:enhance>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-success">Accept</button>
  </form>
  <form action="?/deny" method="post" use:enhance>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-error">Deny</button>
  </form>

  {#if data.user.type === "admin"}
    <form action="?/denyAll" method="post" use:enhance>
      <button class="btn btn-warning">Deny All</button>
    </form>

    <form action="?/deny" method="post" use:enhance>
      <input type="hidden" name="userid" value={data.image.uploadedBy} />
      <button class="btn btn-warning">Ban User</button>
    </form>
  {/if}
</div>

<p>name: {data.image.name}</p>
<p>created at: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
<p>ip address: {data.image.ip}</p>

<img src="https://animalscdn.maxz.dev/{data.image.id}" alt="" />
