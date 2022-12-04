<template>
  <main class="flex flex-col justify-center items-center h-full bg-black font-mono">
    <TheHeader
      title="SolMint"
      subtitle="Mint Solana NFTs"
    />
    <router-view></router-view>
    <TheFooter/>
  </main>
</template>

<script>
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { initWallet } from "solana-wallets-vue"
import { initWorkspace } from '@/composables'
import TheHeader from './components/TheHeader'
import TheFooter from './components/TheFooter'

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter()
  ],
  autoConnect: true
};
initWallet(walletOptions);

initWorkspace();

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  }
}
</script>
