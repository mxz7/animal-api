<script>
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Footer from "$lib/components/footer.svelte";
  import Loadbar from "$lib/components/loadbar.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import { getLocalAuth } from "$lib/stores";
  import { onMount } from "svelte";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";

  onMount(() => {
    getLocalAuth();
  });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />

  {#if !dev}
    <script
      defer
      data-domain="animals.maxz.dev"
      src="https://analytics.maxz.dev/js/script.js"
    ></script>
  {/if}
</svelte:head>

<Toaster />

<Loadbar />

<Navbar />

<div class="min-h-screen pb-40">
  <slot />
</div>

<Footer />
