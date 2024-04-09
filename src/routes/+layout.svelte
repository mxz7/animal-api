<script>
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Footer from "$lib/components/footer.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import { inject } from "@vercel/analytics";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";

  if (!dev) inject({ mode: "production" });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<Toaster />

<Navbar />

<div class="min-h-screen pb-40">
  <slot />
</div>

<Footer />
