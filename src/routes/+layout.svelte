<script>
  import "../app.css";
  import { page } from '$app/stores';
  import favicon from '../favicon.png';
  // Access the pageName from the current page's data
  $: pageName = $page.data.pageName;
</script>

<div class="min-h-screen items-center justify-center bg-blue-100 overflow-x-hidden">
  <div class="header flex items-center justify-center bg-[#075e54] text-white text-center">
      {#if pageName === 'WhatsApp Message Logger'}
          <img src={favicon} alt="Logo" class="w-8 h-8 mr-2" /> <!-- Adjusted size -->
      {:else}
          <a href="/" class="text-2xl text-blue-600 mr-2">🏠</a> <!-- Adjusted size -->
      {/if}
      <h1 class="flex-1 text-center text-lg p-2">{pageName}</h1> <!-- Adjusted size -->
  </div>

  <slot />
</div>

<!-- Optional Footer -->
<!-- <div class="footer">
  <div class="text-center text-sm text-gray-600">
      Copyright &copy; 2024 <a
          href="https://smartlinux.xyz"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline">Smartlinux.xyz</a
      >. All rights reserved.
  </div>
</div> -->

<style>
  .header {
      position: fixed; /* Makes the header stick to the top */
      top: 0;
      left: 0;
      right: 0;
      height: 50px; /* Set a fixed height for the header */
      padding: 0 16px; /* Adjust horizontal padding */
      z-index: 1000; /* Ensure the header is above other content */
  }

  .min-h-screen {
      padding-top: 50px; /* Pushes content down so it's not hidden behind the fixed header */
  }

  .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #f5f5f5;
      border-top: 1px solid #ccc;
      padding: 10px;
      text-align: center;
  }
</style>
