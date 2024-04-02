<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.error?.message} / animals API</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-center">
	<h1 class="text-9xl font-bold text-primary">{$page.status}</h1>
	<p class="mt-2 text-2xl text-zinc-400">{$page.error?.message}</p>
</div>
