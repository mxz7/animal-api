<script>
	import { CircleUser, Home } from 'lucide-svelte';
</script>

<header class="flex w-full justify-center">
	<nav class="flex w-full max-w-4xl items-center gap-8 p-4 text-lg">
		<a href="/" class="hidden pr-8 text-2xl font-bold text-primary sm:block">animals</a>
		<a href="/" class="sm:hidden">
			<Home color="#EC3C62" strokeWidth={2.5} size={28} />
		</a>
		<a href="/docs">docs</a>
		<div class="grow" />
		<a href="/account">
			<CircleUser color="#EC3C62" strokeWidth={2.5} size={28} />
		</a>
	</nav>
</header>
