<script>
  import { enhance } from "$app/forms";
  import dayjs from "dayjs";
  import { Trash } from "lucide-svelte";

  export let data;
</script>

<div class="grid w-full grid-cols-1 gap-4">
  {#each data.reports as report}
    <a
      href="/{report.type}/{report.imageId}"
      target="_blank"
      class="flex items-center rounded-lg border border-secondary border-opacity-50 bg-base-200 p-4 duration-300 hover:opacity-75"
    >
      <div class="grow">
        <h2 class="font-medium text-primary">
          {report.imageName ? report.imageName : report.imageId}
          <span class="ml-2 text-sm text-accent">{dayjs(report.date).format("YYYY-MM-DD")}</span>
          <span class="ml-2 font-mono text-sm text-accent">{report.ip}</span>
        </h2>

        <p>{report.report}</p>
      </div>
      <form
        action="?/delete"
        method="POST"
        use:enhance={() => {
          return ({ result }) => {
            data.reports.splice(
              data.reports.findIndex((i) => i.id === report.id),
              1,
            );
            data.reports = [...data.reports];
          };
        }}
      >
        <input type="hidden" name="id" value={report.id} />
        <button class="btn btn-ghost btn-outline btn-error">
          <Trash class="text-error" />
        </button>
      </form>
    </a>
  {/each}
</div>
