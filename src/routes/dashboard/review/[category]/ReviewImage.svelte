<script lang="ts">
  interface Props {
    url: string;
  }

  let { url }: Props = $props();
</script>

<img loading="lazy" decoding="async" src={url} alt="" />
