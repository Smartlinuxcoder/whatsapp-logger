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
</style>

<main class="flex flex-col h-screen bg-gray-100">
    <div class="bg-[#075e54] text-white text-center p-4 text-xl">
        Chat with {data.pageName}
    </div>
    <div class="flex-1 p-4 overflow-y-auto">
        {#if data.loading}
            <div class="text-center italic">Loading messages...</div>
        {:else if data.error}
            <div class="text-red-500 text-center">Error loading messages: {data.error}</div>
        {:else if data.messages.length > 0}
            {#each data.messages as message}
                <div class={`flex my-2 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div class={`max-w-[70%] p-3 rounded-lg ${message.fromMe ? 'bg-green-200' : 'bg-white'} shadow`}>
                        <div class="flex items-center">
                            <strong class="mr-2">{message.name}:</strong>
                            <span>{message.messageText}</span>
                            {#if message.media}
                                <img src={message.media} alt="Message media" class="ml-2 max-w-[100px] rounded-lg" />
                            {/if}
                        </div>
                        <div class="text-right text-xs text-gray-500 mt-1">
                            {formatTimestamp(message.timestamp)}
                        </div>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="text-center">No messages found.</div>
        {/if}
    </div>
</main>
