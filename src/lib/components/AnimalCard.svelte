<script lang="ts">
  interface Props {
    href: string;
    title: string;
    desc: string | undefined;
  }

  let { href, title, desc }: Props = $props();
</script>

<a
  {href}
  class="rounded-lg border border-secondary border-opacity-10 bg-base-200 p-4 text-center duration-200 hover:border-opacity-25"
>
  <h3 class="text-2xl font-medium text-primary">{title}</h3>
  {#if desc}
    <p class="mt-2 text-lg text-accent">
      {desc}
    </p>
  {/if}
</a>
