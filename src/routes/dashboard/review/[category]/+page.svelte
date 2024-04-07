<script lang="ts">
  import { page } from "$app/stores";

  export let data;
</script>

<h2 class="ml-4 text-3xl font-medium text-primary">Reviewing {$page.params.category} images</h2>

<div class="flex w-full justify-center">
  <form action="?/accept">
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-primary">Accept</button>
  </form>
</div>
