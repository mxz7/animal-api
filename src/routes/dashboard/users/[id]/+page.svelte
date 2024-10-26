<script lang="ts">
  import { page } from "$app/stores";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms";
  import TypeGroup from "./TypeGroup.svelte";

  let { data } = $props();
  let changed = $state(0);

  const { form, enhance, constraints, delayed, message } = superForm(data.form);

  message.subscribe((value) => {
    if (value === "ok") {
      changed = 1;
      toast.success("Updated user");
    }
  });

  onMount(() => {
    // superforms cant set the value for some reason
    $form.type = data.user.type as "user" | "mod" | "admin";

    form.subscribe(() => changed++);
  });
</script>

<h1 class="text-2xl font-bold text-primary">
  {data.user.username || data.user.id}
</h1>

<p>Created: {dayjs(data.user.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
<p>Created IP: {data.user.createdIp}</p>
<p>Discord ID: {data.user.discordId}</p>

{#if data.auth.user.id !== data.user.id && data.auth.user.type === "admin"}
  <div class="divider"></div>

  <form method="POST" class="form-control w-fit gap-4" use:enhance>
    <input type="text" name="id" id="id" class="hidden" bind:value={$form.id} />

    <div class="flex gap-4">
      <select
        name="type"
        id="type"
        class="select select-bordered {delayed ? 'disabled' : ''}"
        bind:value={$form.type}
        {...$constraints.type}
      >
        <option value="user">user</option>
        <option value="mod">mod</option>
        <option value="admin">admin</option>
      </select>

      <label class="label cursor-pointer gap-2">
        <span class="label-text">Banned</span>
        <input
          type="checkbox"
          name="banned"
          id="banned"
          class="checkbox checkbox-lg {delayed ? 'disabled' : ''}"
          bind:checked={$form.banned}
        />
      </label>
    </div>

    <button class="btn btn-primary {changed > 1 ? '' : 'btn-disabled'} {delayed ? 'disabled' : ''}">
      Save
    </button>
  </form>
{/if}

{#if data.images}
  <div class="divider">uploads</div>

  <TypeGroup route="/dashboard/users/{$page.params.id}/uploaded" images={data.images} />
{/if}

{#if data.accepted}
  <div class="divider">accepted</div>

  {#await data.accepted then accepted}
    <TypeGroup route="/dashboard/users/{$page.params.id}/accepted" images={accepted} />
  {/await}
{/if}
