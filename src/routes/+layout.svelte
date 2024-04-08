<script>
  import { page } from "$app/stores";
  import Navbar from "$lib/components/navbar.svelte";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<Toaster />

<Navbar />

<slot />
