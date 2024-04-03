<script>
  import Navbar from "$lib/components/navbar.svelte";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
</script>

<Toaster />

<Navbar />

<slot />
