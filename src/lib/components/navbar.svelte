<script>
  import { page } from "$app/stores";
  import { auth } from "$lib/state.svelte";
  import { AlignLeft, CircleUser } from "lucide-svelte";
</script>

<header class="flex w-full justify-center">
  <div class="navbar bg-base-200 lg:mt-3 lg:max-w-6xl lg:rounded-xl">
    <div class="flex-1">
      {#if $page.url.pathname.startsWith("/dashboard")}
        <label for="my-drawer" class="btn btn-ghost drawer-button text-primary lg:hidden">
          <AlignLeft strokeWidth={2.5} />
        </label>
      {/if}

      <a
        href="/"
        class="btn btn-ghost {$page.url.pathname.startsWith('/dashboard')
          ? 'hidden'
          : ''} text-xl font-semibold lg:inline-flex"
      >
        <span class="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent"
          >animals</span
        >
      </a>
    </div>
    <div class="flex-none">
      {#if !auth.value}
        <div class="btn btn-ghost">
          <span class="loading loading-spinner loading-md"></span>
        </div>
      {:else if !auth.value.authenticated}
        <a href="/login" class="btn btn-ghost text-lg text-primary">Log in</a>
      {:else}
        <a href="/dashboard" class="btn btn-ghost text-primary">
          <CircleUser strokeWidth={2.5} />
        </a>
      {/if}
    </div>
  </div>
</header>
