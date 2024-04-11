<script lang="ts">
  import { enhance } from "$app/forms";
  import dayjs from "dayjs";
  import { ThumbsUp } from "lucide-svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import DeleteButton from "./deleteButton.svelte";
  import ReportButton from "./reportButton.svelte";

  export let data;
  let user: { type: string };

  onMount(async () => {
    const auth = await fetch("/api/auth").then((r) => r.json());

    if (auth && auth.user) user = auth.user;
  });
</script>

<svelte:head>
  <title>{data.image.name || data.image.id} / animals API</title>

  <meta property="og:image" content="https://animalscdn.maxz.dev/{data.image.id}" />
  <meta property="og:type" content="image" />
</svelte:head>

<div class="mt-8 flex w-full justify-center">
  <div class="w-fit md:w-full md:max-w-4xl">
    <div class="flex w-fit flex-col-reverse justify-center gap-4 md:w-full md:flex-row">
      <div class="px-4 md:w-2/5 md:px-0">
        <img
          class="w-full rounded-lg"
          src="https://animalscdn.maxz.dev/{data.image.type}/{data.image.id}"
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
        <p>Uploaded: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
        <p>{data.image.likes.toLocaleString()} like{data.image.likes === 1 ? "" : "s"}</p>
        <div class="mt-4 flex gap-4">
          <form
            action="?/like"
            method="POST"
            use:enhance={() => {
              let done = 0;

              toast.promise(
                new Promise((resolve, reject) => {
                  const interval = setInterval(() => {
                    if (done === 1) {
                      resolve(1);
                      clearInterval(interval);
                    } else if (done === 2) {
                      reject(2);
                      clearInterval(interval);
                    }
                  });
                }),
                { error: "Failed to add like", success: "Added like", loading: "Adding like..." },
              );

              return ({ result }) => {
                console.log(result);
                if (result.status !== 200) {
                  done = 2;
                } else {
                  done = 1;
                }
              };
            }}
          >
            <button class="btn btn-ghost tooltip flex items-center" data-tip="Like">
              <ThumbsUp size={20} />
            </button>
          </form>

          <ReportButton reportForm={data.reportForm} />

          {#if user?.type === "admin"}
            <DeleteButton />
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
