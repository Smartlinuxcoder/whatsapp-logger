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
            <div class="message">
                <strong>{message.fromNumber === data.pageName ? 'Me' : data.pageName}:</strong> {message.messageText}
            </div>
        {/each}
    {:else}
        <div>No messages found.</div>
    {/if}
</main>
