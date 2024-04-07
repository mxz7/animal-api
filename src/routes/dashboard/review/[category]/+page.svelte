<script lang="ts">
  import { enhance } from "$app/forms";
  import dayjs from "dayjs";

  export let data;
</script>

<div class="flex w-fit justify-center gap-4 py-4">
  <form action="?/accept" method="post" use:enhance>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-success">Accept</button>
  </form>
  <form action="?/deny" method="post" use:enhance>
    <input type="hidden" name="id" value={data.image.id} />
    <button class="btn btn-error">Deny</button>
  </form>
</div>

<p>name: {data.image.name}</p>
<p>created at: {dayjs(data.image.createdAt).format("YYYY-MM-DD")}</p>
<p>ip address: {data.image.ip}</p>

<img src="https://animalscdn.maxz.dev/{data.image.id}" alt="" />
