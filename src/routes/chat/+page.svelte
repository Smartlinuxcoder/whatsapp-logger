<script>
    import { onMount } from 'svelte';
    export let data = [];

    // Function to format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    let messagesContainer;

    // Scroll to the bottom of the messages
    const scrollToBottom = () => {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    onMount(scrollToBottom);

    // Run scrollToBottom whenever messages change
    $: if (data.messages.length) {
        scrollToBottom();
    }

    // Function to scroll to the quoted message and highlight it
    const scrollToMessage = (messageId) => {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            // Add highlight class
            messageElement.classList.add('highlight');
            // Scroll into view
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // Remove highlight class after 2 seconds
            setTimeout(() => {
                messageElement.classList.remove('highlight');
            }, 2000);
        }
    };
</script>

<style>
    .quoted-message {
        background-color: #f9f9f9;
        border-left: 4px solid #2196F3;
        padding: 8px;
        margin-bottom: 5px;
        cursor: pointer; /* Change cursor to pointer for clickable quotes */
    }

    .highlight {
        background-color: rgba(255, 255, 0, 0.5); /* Light yellow highlight */
        transition: background-color 0.5s ease; /* Smooth transition */
    }

    .edited-message {
        background-color: #e0f7fa; /* Light blue for edited messages */
        border-left: 4px solid #0097A7; /* Blue left border for emphasis */
        padding: 8px; /* Add padding for visual separation */
        margin-bottom: 5px; /* Space between messages */
    }

    .deleted-message-self {
        background-color: rgba(255, 255, 0, 0.3); /* Light yellow for deleted by self */
        padding: 8px;
        margin-bottom: 5px;
        border-left: 4px solid #FFC107; /* Yellow left border */
    }

    .deleted-message-all {
        background-color: rgba(255, 0, 0, 0.1); /* Slight red for deleted for everyone */
        padding: 8px;
        margin-bottom: 5px;
        border-left: 4px solid #F44336; /* Red left border */
    }

    .audio-message {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .deleted-message {
        color: gray; /* Gray text color for deleted messages */
    }

    .forwarded-label {
        font-size: 0.8rem;
        color: #555;
        font-style: italic;
        margin-bottom: 4px;
    }

    video {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin-top: 5px;
    }
</style>

<main class="flex flex-col h-screen bg-gray-100">
    <div bind:this={messagesContainer} class="flex-1 p-4 overflow-y-auto">
        {#if data.loading}
            <div class="text-center italic">Loading messages...</div>
        {:else if data.error}
            <div class="text-red-500 text-center">Error loading messages: {data.error}</div>
        {:else if data.messages.length > 0}
            {#each data.messages as message (message.messageId)}
                <div id={message.messageId} class={`flex my-2 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div class={`max-w-[70%] p-3 rounded-lg ${message.fromMe ? 'bg-green-200' : 'bg-white'} shadow`}>
                        {#if message.deleted === 1}
                            <div class="deleted-message-self">
                                <strong>Deleted by You:</strong>
                                <div class="deleted-message">{message.messageText}</div>
                                {#if message.media}
                                    {#if message.media.endsWith('.mp3')}
                                        <div class="audio-message">
                                            <audio controls>
                                                <source src={message.media} type="audio/mpeg">
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    {:else if message.media.endsWith('.mp4')}
                                        <video controls>
                                            <source src={message.media} type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>
                                    {:else}
                                        <img src={message.media} alt="Deleted message media" class="ml-2 max-w-[100px] rounded-lg" />
                                    {/if}
                                {/if}
                            </div>
                        {:else if message.deleted === 2}
                            <div class="deleted-message-all">
                                <strong>Deleted for Everyone:</strong>
                                <div class="deleted-message">{message.messageText}</div>
                                {#if message.media}
                                    {#if message.media.endsWith('.mp3')}
                                        <div class="audio-message">
                                            <audio controls>
                                                <source src={message.media} type="audio/mpeg">
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    {:else if message.media.endsWith('.mp4')}
                                        <video controls>
                                            <source src={message.media} type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>
                                    {:else}
                                        <img src={message.media} alt="Deleted message media" class="ml-2 max-w-[100px] rounded-lg" />
                                    {/if}
                                {/if}
                            </div>
                        {:else}
                            {#if message.forwarded === 1}
                                <div class="forwarded-label">Forwarded</div>
                            {/if}

                            {#if message.quotedId}
                                {#each data.messages as quotedMessage (quotedMessage.messageId)}
                                    {#if quotedMessage.messageId === message.quotedId}
                                        <div class="quoted-message" on:click={() => scrollToMessage(quotedMessage.messageId)}>
                                            <strong>Replying to {quotedMessage.name}:</strong>
                                            <div>{quotedMessage.messageText}</div>
                                            {#if quotedMessage.media}
                                                <img src={quotedMessage.media} alt="Quoted message media" class="ml-2 max-w-[100px] rounded-lg" />
                                            {/if}
                                        </div>
                                    {/if}
                                {/each}
                            {/if}

                            {#if data.edits.find(edit => edit.messageId === message.messageId)}
                                {#each data.edits as edit (edit.messageId)}
                                    {#if edit.messageId === message.messageId}
                                        <div class="edited-message">
                                            <strong>Edited:</strong>
                                            <div>{edit.messageText}</div>
                                            <div class="text-right text-xs text-gray-500 mt-1">
                                                {formatTimestamp(edit.timestamp)}
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            {/if}

                            <div class="flex items-center">
                                <strong class="mr-2">{message.name}:</strong>
                                <span>{message.messageText}</span>
                                {#if message.media}
                                    {#if message.media.endsWith('.mp3')}
                                        <div class="audio-message">
                                            <audio controls>
                                                <source src={message.media} type="audio/mpeg">
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    {:else if message.media.endsWith('.mp4')}
                                        <video controls>
                                            <source src={message.media} type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>
                                    {:else}
                                        <img src={message.media} alt="Message media" class="ml-2 max-w-[100px] rounded-lg" />
                                    {/if}
                                {/if}
                            </div>
                            <div class="text-right text-xs text-gray-500 mt-1">
                                {formatTimestamp(message.timestamp)}
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        {:else}
            <div class="text-center">No messages found.</div>
        {/if}
    </div>
</main>
