<script>
  import { auth } from "$lib/stores";
  import { CircleUser, Home } from "lucide-svelte";
</script>

<header class="flex w-full justify-center">
  <div class="navbar bg-base-200 lg:mt-3 lg:max-w-6xl lg:rounded-xl">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl font-semibold text-primary">
        <span class="hidden lg:inline-block">animals</span>
        <span class="lg:hidden">
          <Home strokeWidth={2.5} />
        </span>
      </a>
    </div>
    <div class="flex-none">
      {#if !$auth}
        <div class="btn btn-ghost">
          <span class="loading loading-spinner loading-md" />
        </div>
      {:else if !$auth.authenticated}
        <a href="/login" class="btn btn-ghost text-lg text-primary">Log in</a>
      {:else}
        <a href="/dashboard" class="btn btn-ghost text-primary">
          <CircleUser strokeWidth={2.5} />
        </a>
      {/if}
    </div>
  </div>
</header>
