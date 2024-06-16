<script lang="ts">
  import { auth } from "$lib/stores";
  import Sidebar from "./sidebar.svelte";

  export let data;
  let drawerToggle: HTMLInputElement;

  $auth = data.auth;
</script>

<div class="flex w-full justify-center">
  <div class="drawer w-full p-3 pl-0 lg:drawer-open lg:max-w-6xl">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" bind:this={drawerToggle} />

    {#await data.reportCount}
      <Sidebar {drawerToggle} />
    {:then reportCount}
      {#await data.reviewCount}
        <Sidebar {drawerToggle} />
      {:then reviewCount}
        <Sidebar {drawerToggle} reports={reportCount} reviews={reviewCount} />
      {/await}
    {/await}

    <div class="drawer-content pl-3">
      <slot />
    </div>
  </div>
</div>

<!-- <div class="mt-14 flex w-full justify-center">
  <div class="w-full px-4 md:max-w-3xl md:px-0">
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
                  {href}
                >
                  <p class="whitespace-nowrap">
                    {text}
                    {#if text === "reports" && data.reportCount}
                      {#await data.reportCount then reportCount}
                        {#if reportCount > 0}
                          ({reportCount.toLocaleString()})
                        {/if}
                      {/await}
                    {:else if text === "review" && data.reviewCount}
                      {#await data.reviewCount then reviewCount}
                        {#if reviewCount > 0}
                          ({reviewCount.toLocaleString()})
                        {/if}
                      {/await}
                    {/if}
                  </p>
                </a>
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
</div> -->
