<script lang="ts">
  import type { Sentiment } from 'shared/types';
  
  export let sentiment: Sentiment | undefined = 'Neutral';
  
  $: normalizedSentiment = sentiment || 'Neutral';
  $: pillClass = normalizedSentiment === 'Bullish' 
    ? 'sentiment-bullish' 
    : normalizedSentiment === 'Bearish' 
    ? 'sentiment-bearish' 
    : 'sentiment-neutral';
</script>

<span class="sentiment-pill {pillClass}">
  {normalizedSentiment}
</span>
