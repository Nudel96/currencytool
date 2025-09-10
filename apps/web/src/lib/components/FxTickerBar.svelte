<script lang="ts">
  import type { FxQuote } from 'shared/types';
  
  export let quotes: FxQuote[] = [];
  
  function formatPrice(price?: number | null): string {
    if (price == null) return '—';
    return price.toFixed(4);
  }
  
  function formatChange(change?: number | null): string {
    if (change == null) return '—';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }
  
  function getChangeColor(change?: number | null): string {
    if (change == null) return 'text-gray-400';
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  }
</script>

<div class="pat-card p-4 mb-6">
  <h2 class="text-lg font-semibold mb-3 text-pat-text">FX Quotes</h2>
  
  {#if quotes.length === 0}
    <div class="text-gray-400 text-sm">No FX data available</div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each quotes as quote}
        <div class="bg-pat-muted rounded-lg p-3">
          <div class="font-medium text-pat-text mb-1">{quote.pair}</div>
          <div class="text-xl font-bold text-pat-text">{formatPrice(quote.price)}</div>
          <div class="text-sm {getChangeColor(quote.change_percent)}">
            {formatChange(quote.change_percent)}
          </div>
          {#if quote.last_update}
            <div class="text-xs text-gray-500 mt-1">
              {new Date(quote.last_update).toLocaleTimeString()}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
