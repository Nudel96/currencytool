<script>
  import '../app.css';
</script>

<div class="min-h-screen bg-pat-bg">
  <header class="border-b border-pat-border bg-pat-card">
    <div class="container mx-auto px-4 py-4">
      <h1 class="text-2xl font-bold text-pat-text">
        <span class="text-pat-primary">PAT</span> Macro Calendar
      </h1>
      <p class="text-gray-400 text-sm mt-1">
        Economic events and FX quotes for major currencies
      </p>
    </div>
  </header>
  
  <main class="container mx-auto px-4 py-6">
    <slot />
  </main>
  
  <footer class="border-t border-pat-border bg-pat-card mt-12">
    <div class="container mx-auto px-4 py-4 text-center text-gray-400 text-sm">
      <p>Data provided by FinanceFlow API • Updated every 10 minutes</p>
    </div>
  </footer>
</div>
