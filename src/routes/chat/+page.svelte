<!-- src/routes/chat/+page.svelte -->

<script>
    export let data = [];
    
    // Function to format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
</script>

<style>
    /* Add your styles here */
    .message {
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    .message img {
        max-width: 100px; /* Limit image size */
        margin-left: 10px; /* Space between text and image */
    }
    .loading {
        text-align: center;
        font-style: italic;
    }
    .error {
        color: red;
        text-align: center;
    }
</style>

<main>
    {#if data.loading}
        <div class="loading">Loading messages...</div>
    {:else if data.error}
        <div class="error">Error loading messages: {data.error}</div>
    {:else if data.messages.length > 0}
        {#each data.messages as message}
            <div class="message flex justify-between items-center">
                <div class="flex">
                    <strong class="mr-2">{message.name}:</strong> 
                    <span>{message.messageText}</span>
                    {#if message.media}
                        <img src={message.media} alt="Message media">
                    {/if}
                </div>
                <div class="text-right">{formatTimestamp(message.timestamp)}</div>
            </div>
        {/each}
    {:else}
        <div>No messages found.</div>
    {/if}
</main>
