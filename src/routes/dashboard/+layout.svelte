<script lang="ts">
  import { page } from "$app/stores";

  export let data;

  const routes: { href: string; text: string; perms?: ("mod" | "admin")[] }[] = [
    { href: "/dashboard/images", text: "images" },
    { href: "/dashboard/upload", text: "upload" },
    { href: "/dashboard/review", text: "review", perms: ["mod", "admin"] },
  ];
</script>

<div class="mt-14 flex w-full justify-center">
  <div class="w-full px-4 md:max-w-3xl md:px-0">
    <!-- <h1 class="text-center text-3xl font-semibold text-primary">animals dashboard</h1> -->
    <div class=" flex w-full gap-8">
      <div class="flex flex-col gap-3 rounded-sm border-r border-secondary py-2 pr-4">
        {#each routes as { href, text, perms }}
          {#if perms}
            {#each perms as perm}
              {#if data.user.type === perm}
                <a
                  class={$page.url.pathname.split("/")[2] === text ? "text-accent underline" : ""}
                  {href}>{text}</a
                >
              {/if}
            {/each}
          {:else}
            <a
              class={$page.url.pathname.split("/")[2] === text ? "text-accent underline" : ""}
              {href}>{text}</a
            >
          {/if}
        {/each}
      </div>
      <div class="grow">
        <div class="breadcrumbs pb-4 text-sm">
          <ul>
            {#each $page.url.pathname.split("/") as path, i}
              {#if path}
                {@const paths = $page.url.pathname.split("/")}
                <li><a href="/{paths.slice(1, i + 1).join('/')}">{path}</a></li>
              {/if}
            {/each}
          </ul>
        </div>
        <slot />
      </div>
    </div>
  </div>
</div>
