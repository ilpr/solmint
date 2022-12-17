<template>
  <div class="w-2/3 mb-2 bg-black border-x-solid border-x-2 border-x-white border-b-solid border-b-2 border-b-white">
    
    <!-- Title and info. -->
    <div v-show="!nftIsCreated" class="w-full bg-black p-5 lg:px-24">
      <h2 class="mt-5 lg:mt-10 font-bold text-3xl xl:text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-pink to-cyan">
        Mint and send Solana NFTs easily...
      </h2>
      <p class="xl:px-28 mt-5 lg:mt-10 mb-5 xl:text-lg text-center text-gray-300">
        ...using the Metaplex standard.<br>
        If you are dabbling with NFTs for the first time,
        <a
          href="https://blog.magiceden.io/playbook"
          class="underline text-pink hover:text-cyan"
          target="_blank"
        >here</a>
        is a good overview to get you plugged-in.
        You can also read about the Metaplex standard on Solana
        <a
          href="https://docs.metaplex.com/programs/token-metadata/overview"
          class="underline text-pink hover:text-cyan"
          target="_blank"
        >here</a>.
      </p>
    </div>

    <!-- Form — show by default. -->
    <TheForm v-if="!nftIsCreated"
      @created-nft="success"
    />

    <!-- Success message — show after successful form submit. -->
    <PageSuccess v-else
      :nftData="nftData"/>
  </div>
</template>

<script>
import TheForm from './TheForm'
import PageSuccess from './PageSuccess'

export default {
  name: 'PageHome',
  components: {
    TheForm,
    PageSuccess
  },
  data() {
    return {
      nftIsCreated: false,
      nftData: {
        tx: String,
        nft: Object
      }
    }
  },
  methods: {
    success(nftData) {

      this.nftData = nftData;

      this.nftIsCreated = true;

      window.scrollTo(0, 0);
    }
  }
}
</script>
