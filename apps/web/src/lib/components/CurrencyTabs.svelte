<script lang="ts">
  import { supportedCurrencies } from 'shared/pairs';
  
  export let activeCurrency: string = 'USD';
  export let onCurrencyChange: (currency: string) => void;
</script>

<div class="flex flex-wrap gap-2 mb-6">
  {#each supportedCurrencies as currency}
    <button
      class="px-4 py-2 rounded-md font-medium transition-colors {activeCurrency === currency 
        ? 'bg-pat-primary text-white' 
        : 'bg-pat-muted text-pat-text hover:bg-pat-hover'}"
      on:click={() => onCurrencyChange(currency)}
    >
      {currency}
    </button>
  {/each}
</div>
