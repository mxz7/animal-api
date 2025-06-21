<script lang="ts">
  import { goto } from "$app/navigation";
  import { sleep } from "$lib/utils.js";
  import Compressor from "compressorjs";
  import { Loader2 } from "lucide-svelte";
  import { toast } from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms";

  let { data } = $props();

  let formButton: HTMLButtonElement | undefined = $state();
  let status: "waiting" | "compressing" | "uploading" | "posting" = $state("waiting");
  let uploadCount = $state(0);
  let files: File[] = $state([]);
  let formFiles: FileList | undefined = $state();
  let compressed = $state(false);

  const { form, errors, enhance, message } = superForm(data.form, {
    onSubmit() {
      status = "posting";
    },
    onResult(event) {
      if (event.result.type === "failure") status = "waiting";
    },
  });

  async function compress() {
    if (!formFiles) {
      toast.error("invalid form");
      return;
    }
    console.log("compressing");
    status = "compressing";
    for (const file of formFiles) {
      if (file.size < 1000000) {
        files = [...files, file];
        continue;
      }
      const newFile = await new Promise((resolve) => {
        new Compressor(file, {
          quality: 0.95,
          retainExif: false,
          maxWidth: 2560,
          maxHeight: 1440,
          success(file: File) {
            resolve(file);
          },
        });
      });

      files = [...files, newFile as File];
    }

    compressed = true;
    await sleep(500);
  }

  async function fileUpload(urls: string) {
    if (files.length !== urls.length) {
      return toast.error("Not enough presigned urls");
    }

    console.log("uploading");
    status = "uploading";
    for (let i = 0; i < files.length; i++) {
      const file = files[0];
      const url = urls[0];

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
      });

      uploadCount++;

      if (!uploadResponse.ok) {
        toast.error(`failed uploading ${file.name}`);
        console.error(uploadResponse);
      }
    }

    toast.success("Images uploaded");

    goto("/dashboard/images");
  }

  message.subscribe((value) => {
    if (value?.urls) {
      fileUpload(value.urls);
    }
  });

  $effect(() => {
    $form.sizes = files.map((file) => file.size).join("||");
    $form.types = files.map((file) => file.type).join("||");
  });
</script>

<svelte:head>
  <title>upload / dashboard / animals</title>
</svelte:head>

<form method="POST" class="mt-2" use:enhance>
  <div class="flex w-full flex-col gap-2 md:w-3/4">
    <input
      type="file"
      class="file-input file-input-bordered file-input-primary"
      accept="image/png, image/jpeg, image/gif"
      bind:files={formFiles}
    />

    {#if files.length < 2}
      <input
        class="input input-bordered min-w-0"
        type="text"
        name="name"
        id="name"
        placeholder="name"
        bind:value={$form.name}
      />
      {#if $errors.name && $errors.name[0]}
        <p class="-mt-2 text-red-400">{$errors.name[0]}</p>
      {/if}
    {/if}

    <input
      class="input input-bordered min-w-0"
      type="text"
      name="category"
      id="category"
      placeholder="animal type"
      bind:value={$form.category}
    />
    {#if $errors.category && $errors.category[0]}
      <p class="-mt-2 text-red-400">{$errors.category[0]}</p>
    {/if}

    <input type="hidden" name="types" bind:value={$form.types} />
    {#if $errors.types && $errors.types[0]}
      <p class="-mt-4 text-center text-red-400">{$errors.types[0]}</p>
    {/if}

    <input type="hidden" name="sizes" bind:value={$form.sizes} />
    {#if $errors.sizes && $errors.sizes[0]}
      <p class="-mt-4 text-center text-red-400">{$errors.sizes[0]}</p>
    {/if}

    <button
      onclick={async (event) => {
        if (formFiles?.length === 0) return event.preventDefault();
        if (!compressed) event.preventDefault();
        else return;
        await compress();

        console.log("posting");
        formButton?.click();
      }}
      bind:this={formButton}
      class="{status === 'waiting' ? null : 'hidden'} {!formFiles || !$form.category
        ? 'btn-disabled'
        : ''} btn btn-primary mt-4"
    >
      Upload
    </button>
  </div>

  {#if status !== "waiting"}
    <div class="mt-12 flex w-fit items-center gap-2">
      <p>
        {status}
        {#if status === "uploading"}
          <span> ({uploadCount}/{files.length})</span>
        {/if}
      </p>
      <div class="animate-spin">
        <Loader2 size={16} strokeWidth={2.5} />
      </div>
    </div>
  {/if}
</form>
