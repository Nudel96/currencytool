<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { CurrencyOverview } from '$lib/shared';
  import CurrencyTabs from '$lib/components/CurrencyTabs.svelte';
  import FxTickerBar from '$lib/components/FxTickerBar.svelte';
  import EventTable from '$lib/components/EventTable.svelte';
  
  let activeCurrency = 'USD';
  let overview: CurrencyOverview | null = null;
  let loading = false;
  let error: string | null = null;
  
  async function fetchOverview(currency: string) {
    if (!browser) return;
    
    loading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/currency/${currency}/overview`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      overview = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to fetch overview:', err);
    } finally {
      loading = false;
    }
  }
  
  function handleCurrencyChange(currency: string) {
    activeCurrency = currency;
    fetchOverview(currency);
  }
  
  onMount(() => {
    fetchOverview(activeCurrency);
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchOverview(activeCurrency);
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  });
</script>

<svelte:head>
  <title>PAT Macro Calendar - {activeCurrency}</title>
</svelte:head>

<div class="space-y-6">
  <CurrencyTabs {activeCurrency} onCurrencyChange={handleCurrencyChange} />
  
  {#if error}
    <div class="pat-card p-4 border-red-500 bg-red-900/20">
      <div class="text-red-400 font-medium">Error loading data</div>
      <div class="text-red-300 text-sm mt-1">{error}</div>
      <button 
        class="pat-button-primary mt-3"
        on:click={() => fetchOverview(activeCurrency)}
      >
        Retry
      </button>
    </div>
  {:else}
    <FxTickerBar quotes={overview?.pairs || []} />
    <EventTable events={overview?.events || []} {loading} />
  {/if}
  
  {#if overview && !loading}
    <div class="text-center text-gray-400 text-sm">
      Showing {overview.events.length} events for {activeCurrency}
    </div>
  {/if}
</div>
