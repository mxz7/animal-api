<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import dayjs from "dayjs";
  import { Ellipsis } from "lucide-svelte";

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
  <title>reviewing {$page.params.category} / dashboard / animals</title>
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

<div class="flex w-full justify-center gap-2 py-4">
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

  <span class="grow"></span>

  {#if data.auth.user.type === "admin"}
    <div class="dropdown dropdown-hover">
      <div tabindex="0" role="button" class="btn {loading ? 'btn-disabled' : ''} btn-ghost">
        <Ellipsis strokeWidth={2.5} />
      </div>
      <ul tabindex="0" class="menu dropdown-content z-[1] w-52 rounded-box bg-base-200 p-2 shadow">
        <li>
          <form action="?/denyAll" method="POST" use:enhance={enhanceFunction}>
            <button class="">Deny All</button>
          </form>
        </li>

        <li>
          <form action="?/deny" method="POST" use:enhance={enhanceFunction}>
            <input type="hidden" name="userid" value={data.image.uploaderId} />
            <button class="">Ban User</button>
          </form>
        </li>
      </ul>
    </div>
  {/if}
</div>

<p>name: {data.image.name}</p>
<p>created at: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
<p>ip address: {data.image.ip}</p>
<p>username: {data.image.uploadederUsername}</p>

<img
  loading="lazy"
  decoding="async"
  src="https://animalscdn.maxz.dev/{data.image.type}/{data.image.id}"
  alt=""
/>
