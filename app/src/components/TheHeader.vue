<template>
    <header class="w-full border-b-2 border-white p-4 xl:p-5 bg-black flex justify-between items-center">
      <div class="lg:ml-7">
        <h1 class="font-['Audiowide'] text-3xl lg:text-4xl text-white cursor-pointer"
          @click="reloadPage">
          {{ title }}
        </h1>
        <h2 class="text-lg lg:text-xl text-gray-400">
          {{ subtitle }}
        </h2>
      </div>
      <div class="lg:mr-7">
        <wallet-multi-button></wallet-multi-button>
      </div>
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
    reloadPage() {
      window.location.reload();
    }
  }
}
</script>
