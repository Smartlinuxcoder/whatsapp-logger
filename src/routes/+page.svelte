<!-- src/routes/+page.svelte -->

<script>
    export let data = [];

    // Function to handle opening the chat with the selected contact
    function openChat(contact) {
        // Redirect to /chat with the contact as a query parameter
        
        window.location.href = `/chat?contact=${encodeURIComponent(contact)}`;
    }
</script>

<style>
    /* Add your styles here */
    .contact {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        cursor: pointer; /* Change cursor to indicate clickable */
    }
    .contact:hover {
        background-color: #f0f0f0; /* Add hover effect */
    }
</style>

<main>
    {#if data.contacts.length > 0}
        {#each data.contacts as contact}
            <div class="contact" on:click={() => openChat(contact[0])}>
                {contact[1]} {contact[0].endsWith('g.us') ? '(Group)' : '(Contact)'}
            </div>
        {/each}
    {:else}
        <div>No contacts found.</div>
    {/if}
</main>
