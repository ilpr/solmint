<template>
    <header class="w-full border-b-2 border-white p-4 xl:p-5 bg-black flex justify-between items-center">
      
      <div class="flex items-center space-x-2">

        <!-- Logo. -->
        <img
          src=".././assets/logo.png"
          width="70"
          height="70"
          class="cursor-pointer"
          @click="goToHome"
        >

        <!-- Title & subtitle. -->
        <div>
          <h1 class="font-['Audiowide'] text-2xl lg:text-3xl text-white">
            {{ title }}
          </h1>
          <h2 class="lg:text-lg text-gray-400">
            {{ subtitle }}
          </h2>
        </div>

      </div>

      <!-- Wallet button. -->
      <wallet-multi-button></wallet-multi-button>

    </header>
</template>

<script>
import { WalletMultiButton } from "solana-wallets-vue";

export default {
    name: 'TheHeader',
    props: {
      title: String,
      subtitle: String
  },
  components: {
    WalletMultiButton
  },
  methods: {
    async goToHome() {
      if (this.$route.name === 'Home') {
        await this.$router.go(0);
      } else {
        await this.$router.push({ name: 'Home' });
      }
    }
  }
}
</script>
