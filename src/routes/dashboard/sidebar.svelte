<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/state.svelte";
  import {
    FileWarning,
    Files,
    Home,
    ImageUp,
    LogOut,
    SearchCheck,
    ShieldCheck,
    UserSearch,
  } from "lucide-svelte";

  interface Props {
    reviews?: number;
    reports?: number;
    drawerToggle: HTMLInputElement;
  }

  let { reviews = 0, reports = 0, drawerToggle }: Props = $props();
</script>

<div class="drawer-side z-10 rounded-lg lg:h-fit">
  <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
  <ul
    class="menu min-h-full w-80 bg-base-200 p-4 text-base-content"
    onclick={() => drawerToggle.click()}
  >
    <li class="lg:hidden">
      <a href="/">
        <Home size={16} strokeWidth={2.5} />
        <span>Home</span>
      </a>
    </li>

    <li>
      <a
        href="/dashboard/images"
        class="{$page.url.pathname.startsWith('/dashboard/images')
          ? 'font-semibold text-secondary'
          : ''} flex items-center"
      >
        <Files size={16} strokeWidth={2.5} />
        <span>Images</span>
      </a>
    </li>

    <li>
      <a
        href="/dashboard/upload"
        class="{$page.url.pathname === '/dashboard/upload'
          ? 'font-semibold text-secondary'
          : ''} flex items-center"
      >
        <ImageUp size={16} strokeWidth={2.5} />
        <span>Upload</span>
      </a>
    </li>

    {#if auth.value?.authenticated && ["admin", "mod"].includes(auth.value.user.type)}
      <ul class="pl-2">
        <li>
          <h2 class="-ml-1 font-semibold">
            <ShieldCheck size={16} strokeWidth={2.5} />
            <span>Admin</span>
          </h2>
        </li>
        <li>
          <a
            href="/dashboard/review"
            class="{$page.url.pathname.startsWith('/dashboard/review')
              ? 'font-semibold text-secondary'
              : ''} flex items-center"
          >
            <SearchCheck size={16} strokeWidth={2.5} />
            <span>Review</span>
            {#if reviews > 0}
              <span>({reviews})</span>
            {/if}
          </a>
        </li>

        {#if auth.value.user.type === "admin"}
          <li>
            <a
              href="/dashboard/reports"
              class="{$page.url.pathname === '/dashboard/reports'
                ? 'font-semibold text-secondary'
                : ''} flex items-center"
            >
              <FileWarning size={16} strokeWidth={2.5} />
              <span>Reports</span>
              {#if reports > 0}
                <span>({reports})</span>
              {/if}
            </a>
          </li>

          <li>
            <a
              href="/dashboard/users"
              class="{$page.url.pathname.startsWith('/dashboard/users')
                ? 'font-semibold text-secondary'
                : ''} flex items-center"
            >
              <UserSearch size={16} strokeWidth={2.5} />
              <span>Users</span>
            </a>
          </li>
        {/if}
      </ul>
    {/if}

    <li>
      <a href="/logout">
        <LogOut size={16} strokeWidth={2.5} />
        <span>Log out</span>
      </a>
    </li>
  </ul>
</div>
