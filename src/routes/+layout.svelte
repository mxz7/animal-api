<script>
  import { page } from "$app/stores";
  import Footer from "$lib/components/footer.svelte";
  import Navbar from "$lib/components/navbar.svelte";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
</script>

<svelte:head>
  <meta name="og:url" content={$page.url.toString()} />

  <script
    defer
    src="https://unpkg.com/@tinybirdco/flock.js"
    data-host="https://api.eu-central-1.aws.tinybird.co"
    data-token="p.eyJ1IjogImVjMDk1Y2EwLWU2M2EtNDJmYy1iOTk2LWI5ZGM2MzUxMWZmMCIsICJpZCI6ICIyMzBlOTMwZS1mMzJjLTRlYmEtYjFlZS04NjU4OWJjYWZkNzIiLCAiaG9zdCI6ICJhd3MtZXUtY2VudHJhbC0xIn0.MEw55QckfzHZ1HHkZxbNxk7T6sTWlPHcyfVyH6EHyh0"
  ></script>
</svelte:head>

<Toaster />

<Navbar />

<div class="min-h-screen pb-40">
  <slot />
</div>

<Footer />
