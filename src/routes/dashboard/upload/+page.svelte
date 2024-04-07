<script lang="ts">
  import { goto } from "$app/navigation";
  import { sleep } from "$lib/utils.js";
  import Compressor from "compressorjs";
  import { CloudUpload, Loader2, X } from "lucide-svelte";
  import { toast } from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms";

  export let data;

  let formButton: HTMLButtonElement;
  let status: "waiting" | "compressing" | "uploading" | "posting" = "waiting";
  let uploadCount = 0;
  let files: File[] = [];
  let formFiles: FileList;
  const { form, errors, constraints, enhance, message } = superForm(data.form, {
    onSubmit() {
      status = "posting";
    },
  });

  async function compress() {
    console.log("compressing");
    status = "compressing";
    for (let i = 0; i < files.length; i++) {
      const newFile = await new Promise((resolve) => {
        new Compressor(files[i], {
          quality: 0.95,
          retainExif: false,
          maxWidth: 2560,
          maxHeight: 1440,
          success(file: File) {
            resolve(file);
          },
        });
      });

      files[i] = newFile as File;
    }

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

      console.log(uploadResponse);
      console.log((await uploadResponse.body?.getReader().read())?.value?.toString());

      console.log(Array.from(uploadResponse.headers.entries()));

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

  $: {
    $form.sizes = files.map((file) => file.size).join("||");
    $form.types = files.map((file) => file.type).join("||");
  }
</script>

<svelte:head>
  <title>upload / dashboard / animals API</title>
</svelte:head>

<label
  for="dropzone-file"
  class="flex h-fit w-3/4 cursor-pointer flex-col items-center justify-center rounded-lg bg-secondary bg-opacity-20 duration-300 hover:bg-opacity-20"
>
  <div class="flex flex-col items-center justify-center pb-6 pt-5 text-center">
    <CloudUpload strokeWidth={2.7} size={32} class="mb-3 text-primary" />
    <p class="mb-2 font-medium text-primary">Click to upload</p>
    <p class="text-sm text-accent">PNG/JPEG - 5MB limit</p>
  </div>
  <input
    id="dropzone-file"
    type="file"
    class="hidden"
    accept="image/png, image/jpeg"
    bind:files={formFiles}
    on:change={() => {
      for (const file of formFiles) {
        if (files.length >= 50) {
          toast.error("You can upload a max of 50 files at a time");
          return;
        }
        if (file.size > 5000000) {
          toast.error(`${file.name} is too big, max file size: 5mb`);
          continue;
        }
        files = [...files, file];
      }
    }}
  />
</label>

<div class="mt-2 grid w-3/4 grid-cols-1 gap-3">
  {#each files as file, i}
    <div class="flex w-full items-center rounded-lg border border-secondary p-1 pl-2">
      <h2 class="text-zinc-300">{file.name}</h2>
      <div class="grow" />
      <button
        on:click={() => {
          files.splice(i, 1);
          files = [...files];
        }}
        class="rounded-lg border border-secondary border-opacity-0 p-1 duration-300 hover:border-opacity-75"
      >
        <X class="text-secondary" />
      </button>
    </div>
  {/each}
</div>

<form method="post" class="mt-2" use:enhance>
  {#if files.length < 2}
    <input
      class="input input-bordered"
      type="text"
      name="name"
      id="name"
      placeholder="name"
      bind:value={$form.name}
      {...$constraints.name}
    />
    {#if $errors.name && $errors.name[0]}
      <p class="-mt-4 text-center text-red-400">{$errors.name[0]}</p>
    {/if}
  {/if}

  <input
    class="input input-bordered mt-4"
    type="text"
    name="category"
    id="category"
    placeholder="animal type"
    bind:value={$form.category}
    {...$constraints.category}
  />
  {#if $errors.category && $errors.category[0]}
    <p class="-mt-4 text-center text-red-400">{$errors.category[0]}</p>
  {/if}

  <input type="hidden" name="types" bind:value={$form.types} />
  {#if $errors.types && $errors.types[0]}
    <p class="-mt-4 text-center text-red-400">{$errors.types[0]}</p>
  {/if}

  <input type="hidden" name="sizes" bind:value={$form.sizes} />
  {#if $errors.sizes && $errors.sizes[0]}
    <p class="-mt-4 text-center text-red-400">{$errors.sizes[0]}</p>
  {/if}

  <br />

  <button bind:this={formButton} class="hidden"></button>

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

<button
  on:click|preventDefault={async () => {
    await compress();

    console.log("posting");
    formButton.click();
  }}
  class="{status === 'waiting' ? null : 'hidden'}  btn btn-neutral mt-4"
>
  Upload
</button>
