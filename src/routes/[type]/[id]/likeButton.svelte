<script lang="ts">
  import { enhance } from "$app/forms";
  import { ThumbsUp } from "lucide-svelte";
  import toast from "svelte-french-toast";

  interface Props {
    addLike: () => void;
  }

  let { addLike }: Props = $props();
</script>

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
        addLike();
        done = 1;
      }
    };
  }}
>
  <button class="btn btn-ghost tooltip flex items-center" data-tip="Like">
    <ThumbsUp size={20} />
  </button>
</form>
