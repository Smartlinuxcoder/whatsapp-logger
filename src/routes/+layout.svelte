<script>
    import "../app.css";
    import { page } from '$app/stores';
    import favicon from '../favicon.png';
    // Access the pageName from the current page's data
    $: pageName = $page.data.pageName;
  </script>
  
  <div class="min-h-screen items-center justify-center bg-blue-100 overflow-x-hidden">
    <div class="flex items-center justify-center p-4">
      {#if pageName === 'Le app dello spalla'}
        <img src={favicon} alt="Logo" class="w-10 h-10 mr-2" />
      {:else}
        <a href="/" class="text-4xl text-blue-600 mr-2">🏠</a>
      {/if}
      <h1 class="text-3xl font-bold text-blue-600 flex-1 text-center">{pageName}</h1>
    </div>
    
    <slot />
  </div>
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
  