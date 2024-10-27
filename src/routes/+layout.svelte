<script>
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import Footer from "$lib/components/footer.svelte";
  import Loadbar from "$lib/components/loadbar.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import { getLocalAuth } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

  onMount(() => {
    getLocalAuth();
  });
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
  <meta name="theme-color" content="#1E1E2E" />

  {#if !dev}
    <script
      defer
      src="https://analytics.maxz.dev/script.js"
      data-website-id="318e2912-2ceb-4989-a81e-0f0b3451c6a8"
    ></script>
  {/if}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Toaster />

<Loadbar />

<Navbar />

<div class="min-h-screen pb-40">
  {@render children?.()}
</div>

<Footer />
