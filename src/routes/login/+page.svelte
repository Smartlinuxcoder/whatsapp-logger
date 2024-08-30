<!-- src/routes/login/+page.svelte -->
<script>
    let username = '';
    let password = '';

    const login = async () => {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            alert('Login failed');
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br to-blue-500">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <div class="mb-4">
            <input
                type="text"
                bind:value={username}
                placeholder="Username"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>
        <div class="mb-6">
            <input
                type="password"
                bind:value={password}
                placeholder="Password"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>
        <button
            on:click={login}
            class="w-full p-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
        >
            Login
        </button>
    </div>
</div>
