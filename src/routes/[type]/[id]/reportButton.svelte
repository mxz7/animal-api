<script lang="ts">
  import { Flag } from "lucide-svelte";
  import toast from "svelte-french-toast";
  import { superForm, type SuperValidated } from "sveltekit-superforms";

  let modal: HTMLDialogElement = $state();
  interface Props {
    reportForm: SuperValidated<{
    id: string;
    text: string;
  }>;
  }

  let { reportForm }: Props = $props();

  const { form, constraints, enhance, errors, submitting } = superForm(reportForm, {
    onUpdated(event) {
      if (event.form.message) {
        modal.close();
        toast.success(event.form.message);
      }
    },
  });
</script>

<dialog class="modal" bind:this={modal}>
  <form class="modal-box flex flex-col gap-4 p-4" action="?/report" method="POST" use:enhance>
    <div class="flex items-center justify-center gap-3 text-error">
      <Flag />

      <h2 class="text-center text-2xl font-semibold">Report Image</h2>
    </div>
    <input
      class="input input-disabled"
      type="text"
      name="id_show"
      id="id_show"
      bind:value={$form.id}
      disabled
    />
    <input type="hidden" name="id" id="id" bind:value={$form.id} />
    <textarea
      name="text"
      id="text"
      class="textarea textarea-error"
      placeholder="Report reason"
      bind:value={$form.text}
      {...$constraints.text}
></textarea>
    {#if $errors.text && $errors.text[0]}
      <p class="-mt-2 text-error">{$errors.text[0]}</p>
    {/if}

    {#if $submitting}
      <button class="btn btn-disabled" disabled>
        <span class="loading loading-dots"></span>
      </button>
    {:else}
      <button class="btn btn-error">Report</button>
    {/if}
  </form>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<button
  onclick={() => modal.showModal()}
  class="btn btn-ghost tooltip flex items-center"
  data-tip="Report"
>
  <Flag size={20} />
</button>
