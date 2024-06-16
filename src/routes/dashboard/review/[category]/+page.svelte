<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import dayjs from "dayjs";

  export let data;

  let loading = false;
  let modal: HTMLDialogElement;

  function enhanceFunction() {
    loading = true;
    if (modal.open) modal.close();
    return async () => {
      await invalidate("reviewimage");
      loading = false;
    };
  }
</script>

<svelte:head>
  <title>reviewing {$page.params.category} images / animals api</title>
</svelte:head>

<dialog class="modal" bind:this={modal}>
  <form
    class="modal-box flex flex-col gap-4 p-4"
    action="?/changeType"
    method="POST"
    use:enhance={enhanceFunction}
  >
    <h2 class="text-center text-2xl font-semibold text-primary">Change Type</h2>
    <input
      type="text"
      name="type"
      id="type"
      class="input input-secondary"
      placeholder="New type"
      value={data.image.type}
    />
    <input type="hidden" name="id" id="id" value={data.image.id} />

    <button class="btn btn-primary">Change</button>
  </form>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<div class="flex w-fit justify-center gap-4 py-4">
  <form action="?/accept" method="POST" use:enhance={enhanceFunction}>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn {loading ? 'btn-disabled' : ''} btn-success">Accept</button>
  </form>
  <form action="?/deny" method="POST" use:enhance={enhanceFunction}>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-error {loading ? 'btn-disabled' : ''}">Deny</button>
  </form>

  <button
    on:click={() => modal.showModal()}
    class="btn btn-secondary {loading ? 'btn-disabled' : ''}">Change Type</button
  >

  {#if data.auth.user.type === "admin"}
    <form action="?/denyAll" method="POST" use:enhance={enhanceFunction}>
      <button class="btn btn-warning {loading ? 'btn-disabled' : ''}">Deny All</button>
    </form>

    <form action="?/deny" method="POST" use:enhance={enhanceFunction}>
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
