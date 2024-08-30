<!-- src/routes/chat/+page.svelte -->


<script>
    export let data = [];
</script>

<style>
    /* Add your styles here */
    .message {
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
</style>

<main>
    {#if data.messages.length > 0}
        {#each data.messages as message}
            <div class="message flex justify-between items-center">
                <div class="flex">
                    <strong class="mr-2">{message.name}:</strong> 
                    <span>{message.messageText}</span>
                </div>
                <div class="text-right">{message.timestamp}</div>
            </div>
        {/each}
    {:else}
        <div>No messages found.</div>
    {/if}
</main>
