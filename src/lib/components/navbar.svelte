<script>
  import { CircleUser, Home } from "lucide-svelte";
</script>

<header class="flex w-full justify-center pt-4">
  <nav
    class="flex w-full max-w-4xl items-center gap-8 rounded-full bg-secondary bg-opacity-15 p-4 px-6 text-lg shadow"
  >
    <a href="/" class="hidden pr-8 text-2xl font-bold text-primary sm:block">animals</a>
    <a href="/" class="sm:hidden">
      <Home class="text-primary" strokeWidth={2.5} size={28} />
    </a>
    <a href="/docs">docs</a>
    <div class="grow" />
    <a href="/dashboard">
      <CircleUser class="text-primary" strokeWidth={2.5} size={28} />
    </a>
  </nav>
</header>
