<script>
  import { enhance } from "$app/forms";

  import { Trash } from "lucide-svelte";
</script>

<form action="?/delete" method="POST" use:enhance>
  <button
    class="btn btn-ghost btn-outline btn-error tooltip tooltip-error flex items-center"
    data-tip="Delete"
  >
    <Trash size={20} />
  </button>
</form>
