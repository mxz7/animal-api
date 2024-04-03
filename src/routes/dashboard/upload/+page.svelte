<script lang="ts">
  import { sleep } from "$lib/utils.js";
  import Compressor from "compressorjs";
  import { CloudUpload, Loader2, X } from "lucide-svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-french-toast";
  import { superForm } from "sveltekit-superforms";

  export let data;

  let status: "waiting" | "compressing" | "uploading" | "posting" = "waiting";
  let formElement: HTMLFormElement;
  let uploadCount = 0;
  let files: File[] = [];
  let formFiles: FileList;
  const { form, errors, constraints, enhance, message } = superForm(data.form);

  async function compress(file: File): Promise<File> {
    return new Promise((resolve) => {
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
  }

  async function fileUpload() {
    let promises = [];
    const newFiles: File[] = [];

    status = "compressing";
    for (let file of files) {
      const fun = async () => {
        console.log(`before: ${file.size / 1024 / 1024}mb`);
        file = await compress(file);
        console.log(`after: ${file.size / 1024 / 1024}mb`);

        if (file.size > 10000000) {
          toast.error(`file: ${file.name} too large, must be below 10mb`);
        }

        newFiles.push(file);
      };

      if (file.size > 1000000) {
        promises.push(fun());
      } else {
        newFiles.push(file);
      }
    }

    await Promise.all(promises);
    promises = [];

    $form.ids = "";

    status = "uploading";
    for (const file of newFiles) {
      const response = await fetch("/api/upload", { method: "POST" });

      if (!response.ok) {
        console.error(response);
        console.error(Array.from(response.headers.entries()));
        toast.error("Failed to generate presigned URL");
        if (response.status === 429)
          toast.error("You've uploaded too many pictures today. Try again tomorrow.");
        return;
      }

      const { url, key } = await response.json();

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        mode: "cors",
      });

      console.log(`uploaded: ${key} / ${file.name}`);
      uploadCount++;

      if (uploadResponse.ok) {
        $form.ids = [...$form.ids.split("|").filter((i) => Boolean(i)), key].join("|");
      } else {
        toast.error(`Failed to upload image: ${file.name}`);
      }
    }

    status = "posting";
    await sleep(500); // needed so that the input element updates quick enough or some shit

    formElement.submit();
  }

  onMount(async () => {
    await sleep(500);
    console.log("meow");
    console.log($message);
    if ($message) {
      toast.success($message.message);
    }
  });
</script>

<svelte:head>
  <title>Gallery Upload / HRCT</title>
</svelte:head>

<label
  for="dropzone-file"
  class="flex h-fit w-3/4 cursor-pointer flex-col items-center justify-center rounded-lg bg-secondary bg-opacity-30 duration-300 hover:bg-opacity-20"
>
  <div class="flex flex-col items-center justify-center pb-6 pt-5 text-center">
    <CloudUpload class="mb-3 text-primary" />
    <p class="mb-2 text-sm font-medium text-accent">Click to upload</p>
    <p class="text-xs text-accent">PNG or JPEG only</p>
    <p class="text-xs text-accent">10MB per image, max of 50 images per upload</p>
  </div>
  <input
    id="dropzone-file"
    type="file"
    class="hidden"
    accept="image/png, image/jpeg"
    bind:files={formFiles}
    multiple
    on:change={() => {
      console.log(files);
      for (const file of formFiles) {
        if (files.length >= 50) {
          toast.error("You can upload a max of 50 files at a time");
          return;
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

<form method="post" class="mt-2" use:enhance bind:this={formElement}>
  {#if files.length < 2}
    <input
      class=" rounded-lg border-secondary bg-secondary bg-opacity-20 p-1 text-text placeholder:text-accent focus:outline-none"
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
    class=" rounded-lg border-secondary bg-secondary bg-opacity-20 p-1 text-text placeholder:text-accent focus:outline-none"
    type="text"
    name="type"
    id="type"
    placeholder="type"
    bind:value={$form.type}
    {...$constraints.type}
  />
  {#if $errors.type && $errors.type[0]}
    <p class="-mt-4 text-center text-red-400">{$errors.type[0]}</p>
  {/if}

  <input class="hidden" type="text" name="id" id="id" bind:value={$form.ids} />

  <br />

  <button
    on:click|preventDefault={() => {
      if (!files || files.length < 1) {
        $errors.type = ["You need to upload an image"];
        return;
      }
      if (!$form.type || $form.type.length < 3) {
        $errors.type = ["A type is required"];
        return;
      }

      fileUpload();
    }}
    class="{status === 'waiting'
      ? null
      : 'hidden'}  mt-4 rounded-lg border-secondary bg-secondary bg-opacity-20 p-2 text-primary placeholder:text-accent focus:outline-none"
  >
    Upload
  </button>

  {#if status !== "waiting"}
    <div class="mt-12 flex flex-col items-center justify-center">
      <p>
        {status}
        {#if status === "uploading"}
          <span> ({uploadCount}/{files.length})</span>
        {/if}
      </p>
      <div class="animate-spin">
        <Loader2 />
      </div>
    </div>
  {/if}
</form>
