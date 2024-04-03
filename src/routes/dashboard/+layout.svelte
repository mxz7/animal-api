<script lang="ts">
  import { page } from "$app/stores";

  export let data;

  const routes: { href: string; text: string; type?: ("mod" | "admin")[] }[] = [
    { href: "/dashboard/images", text: "images" },
    { href: "/dashboard/upload", text: "upload" },
    { href: "/dashboard/review", text: "review", type: ["mod", "admin"] },
  ];
</script>

<div class="mt-14 flex w-full justify-center">
  <div class="w-full px-4 md:max-w-3xl md:px-0">
    <h1 class="text-center text-3xl font-semibold text-primary">animals API dashboard</h1>
    <div class="mt-4 flex w-full gap-8">
      <div class="flex flex-col gap-3 rounded-sm border-r border-secondary py-2 pr-4">
        {#each routes as { href, text, type }, _}
          {#if type}
            {#each type as type}
              {#if data.user.type === type}
                <a class={$page.url.pathname === href ? "text-accent underline" : ""} {href}
                  >{text}</a
                >
              {/if}
            {/each}
          {:else}
            <a class={$page.url.pathname === href ? "text-accent underline" : ""} {href}>{text}</a>
          {/if}
        {/each}
      </div>
      <div class="grow py-4"><slot /></div>
    </div>
  </div>
</div>
