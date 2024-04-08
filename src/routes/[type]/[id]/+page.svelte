<script lang="ts">
  import { enhance } from "$app/forms";
  import dayjs from "dayjs";
  import { ThumbsUp, Trash } from "lucide-svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";

  export let data;
  let user: { type: string };

  onMount(async () => {
    const auth = await fetch("/api/auth").then((r) => r.json());

    if (auth && auth.user) user = auth.user;
  });
</script>

<div class="mt-14 flex w-full justify-center">
  <div class="w-full max-w-4xl">
    <div class="flex w-full justify-center">
      <div class="w-2/5">
        <img
          class="w-full rounded-lg"
          src="https://animalscdn.maxz.dev/{data.image.id}"
          alt={data.image.name}
        />
      </div>
      <div class="px-4">
        <h1 class="font-semibold text-primary {data.image.name ? 'text-3xl' : 'text-lg'}">
          {data.image.name || data.image.id}
        </h1>
        <p>Uploaded: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
        <p>{data.image.likes.toLocaleString()} like{data.image.likes === 1 ? "" : "s"}</p>
        <div class="mt-4 flex gap-4">
          <form
            action="?/addLike"
            method="post"
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
          <!-- <form action="?/report" method="post">
            <button class="btn btn-ghost tooltip flex items-center" data-tip="Report">
              <Flag size={20} />
            </button>
          </form> -->

          {#if user?.type === "admin"}
            <form action="?/delete" method="post" use:enhance>
              <button
                class="btn btn-ghost btn-outline btn-error tooltip tooltip-error flex items-center"
                data-tip="Delete"
              >
                <Trash size={20} />
              </button>
            </form>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
