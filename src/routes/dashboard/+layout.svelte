<script lang="ts">
  import { page } from "$app/stores";
  import { ArrowLeft, ArrowRightFromLine } from "lucide-svelte";

  export let data;
  let showNav = false;

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
      <div
        class="{showNav
          ? 'flex'
          : 'hidden'} flex-col gap-3 rounded-sm border-r border-secondary py-2 pr-4 md:flex"
      >
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
        <div class=" flex items-center gap-2 pb-4">
          <button class="-ml-2 md:hidden" on:click={() => (showNav = !showNav)}>
            {#if showNav}
              <ArrowLeft />
            {:else}
              <ArrowRightFromLine />
            {/if}
          </button>
          <div class="breadcrumbs text-sm">
            <ul>
              {#each $page.url.pathname.split("/") as path, i}
                {#if path}
                  {@const paths = $page.url.pathname.split("/")}
                  <li><a href="/{paths.slice(1, i + 1).join('/')}">{path}</a></li>
                {/if}
              {/each}
            </ul>
          </div>
        </div>
        <slot />
      </div>
    </div>
  </div>
</div>
