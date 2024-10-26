<script lang="ts">
  import dayjs from "dayjs";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>upload / dashboard / animals</title>
</svelte:head>

{#key data}
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Type</th>
          <th>Created At</th>
          <th>IP</th>
          <th>Banned</th>
          <th>Uploaded</th>
        </tr>
      </thead>
      <tbody>
        {#each data.rows as row}
          <tr>
            <th>
              <a href="/dashboard/users/{row.id}" class="link">
                {row.username}
              </a>
            </th>
            <td>{row.type}</td>
            <td>{dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
            <td>{row.ip}</td>
            <td>{Boolean(row.banned)}</td>
            <td>{row.uploaded.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="mt-2 flex w-full justify-center">
      <div class="join grid grid-cols-3">
        <a
          class="btn btn-ghost join-item {data.page === 1 ? 'btn-disabled' : ''}"
          href="/dashboard/users?page={data.page - 1 < 1 ? 1 : data.page - 1}"
        >
          <ArrowLeft />
        </a>
        <span class="btn btn-ghost join-item">{data.page}</span>
        <a
          class="btn btn-ghost join-item {data.page === data.lastPage ? 'btn-disabled' : ''}"
          href="/dashboard/users?page={data.page + 1 > data.lastPage
            ? data.lastPage
            : data.page + 1}"
        >
          <ArrowRight />
        </a>
      </div>
    </div>
  </div>
{/key}
