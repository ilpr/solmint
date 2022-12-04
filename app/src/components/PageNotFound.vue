<template>
    <div class="p-8 text-gray-400 text-center">
        <p>404 — Not Found</p>
        <router-link
            :to="{ name: 'Home' }"
            class="block text-pink hover:text-cyan cursor-pointer">
            Go back home
        </router-link>
    </div>
</template>
