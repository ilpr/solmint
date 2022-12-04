<template>
  <div class="flex flex-col px-5 bg-black text-white">

    <h3 class="my-10 lg:my-14 text-3xl xl:text-4xl text-white text-center">
      You've successfully created an NFT!
    </h3>

    <div class="flex flex-col lg:px-24 xl:px-40">

      <span v-if="nftData.nft.json != null" class="mb-10">
        <img :src="nftData.nft.json.image" alt="">
      </span>

      <span class="mb-6">
        Tx:
        <a
          :href="'https://explorer.solana.com/tx/' + nftData.tx"
          target="_blank">
          <p class="mt-2 text-pink hover:text-cyan underline cursor-pointer">
            Your transaction
          </p>
        </a>
      </span>

      <span class="mb-6">
        NFT address:
        <p class="mt-2 truncate text-cyan"> {{ nftData.nft.address }} </p>
      </span>

      <span class="mb-6">
        Name:
        <p class="mt-2 text-cyan"> {{ nftData.nft.name }} </p>
      </span>

      <span class="mb-6">
        Symbol:
        <p class="mt-2 text-cyan"> {{ nftData.nft.symbol }} </p>
      </span>

      <span class="mb-6">
        Seller fee:
        <p class="mt-2 text-cyan"> {{ nftData.nft.sellerFeeBasisPoints / 100 + '%' }} </p>
      </span>

      <span class="mb-6">
        Is mutable:
        <p class="mt-2 text-cyan"> {{ nftData.nft.isMutable }} </p>
      </span>

      <div class="mb-6">
        <span v-if="nftData.nft.json != null">
          Description:
          <p class="mt-2 mb-5 text-cyan"> {{ nftData.nft.json.description }} </p>
          Metadata file:
          <a :href="nftData.nft.uri"
            target="_blank"
            class="block mt-2 text-pink hover:text-cyan underline cursor-pointer">
            Your JSON file
          </a>
        </span>
        <span v-else>
          Metadata file:
          <p class="mt-2 text-gray-400"> None </p>
        </span>
      </div>

      <div class="mb-6">
        Collection:
        <span v-if="nftData.nft.collection != null" class="block mt-3 px-3 text-base xl:text-lg border-l-solid border-l-2 border-l-pink">
          Address:
          <p class="my-2 truncate text-cyan"> {{ nftData.nft.collection.address }} </p>
          Verified:
          <p class="mt-2 text-cyan"> {{ nftData.nft.collection.verified }} </p>
        </span>
        <span v-else>
          <p class="mt-2 text-gray-400"> None </p>
        </span>
      </div>

      <div class="mb-10">
        Creator(s):
        <div v-if="nftData.nft.creators.length != 0" class="container w-full mt-3 bg-black text-base xl:text-lg">
          <div v-for="creator in nftData.nft.creators" :key="creator">
            <div class="w-full mb-2 px-3 container bg-black border-l-solid border-l-2 border-l-pink">
              Address:
              <p class="truncate text-cyan my-2"> {{ creator.address }}</p>
              Share:
              <p class="text-cyan my-2">{{ creator.share + '%' }}</p>
            </div>
          </div>
        </div>
        <p v-else class="mt-2 text-gray-400">
          None
        </p>
      </div>
        <button
          class="w-full mt-3 mb-10 lg:mb-14 xl:mb-16 lg:mb-10 p-3 font-bold text-pink bg-black border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
          @click="reloadPage">
          Mint Another NFT
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessMessage',
  props: {
    nftData: {
      tx: String,
      nft: Object
    }
  },
  methods: {
    reloadPage() {
      window.location.reload();
      window.scrollTo(0, 0);
    }
  }
}
</script>
