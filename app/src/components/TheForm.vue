<template>
  <form class="flex flex-col justify-center px-5 md:px-10 lg:px-24 xl:px-40 bg-black text-sm">

    <p v-if="!connected" class="lg:text-base mb-6 text-center text-cyan">
      Connect wallet to create an NFT...
    </p>

    <!-- Receiver field. -->
    <div class="mb-7">
      <label for="receiver" class="flex block text-base text-white mb-2">Receiver*
      </label>
      <input
        type="text"
        id="receiver"
        v-model="mainState.receiver"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="receiver's address"
      >
      <span v-if="v$Main.receiver.$error" class="text-sm text-cyan block mt-2">
        {{ v$Main.receiver.$errors[0].$message }}
      </span>
    </div>

    <!-- Name field. -->
    <div class="mb-7">
      <label for="name" class="flex block text-base text-white mb-2">Name*
      </label>
      <input
        type="text"
        id="name"
        v-model="mainState.name"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. Ape #1"
      >
      <span v-if="v$Main.name.$error" class="text-sm text-cyan block mt-2">
        {{ v$Main.name.$errors[0].$message }}
      </span>
    </div>

    <!-- Symbol field. -->
    <div class="mb-7">
      <label for="symbol" class="flex block text-base text-white mb-2">Symbol*
      </label>
      <input
        type="text"
        id="symbol"
        v-model="mainState.symbol"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. APE"
      >
      <span v-if="v$Main.symbol.$error" class="text-sm text-cyan block mt-2">
        {{ v$Main.symbol.$errors[0].$message }}
      </span>
    </div>

    <!-- Uri field. -->
    <div class="mb-7 text-white">
      <label for="uri" class="flex block text-base text-white mb-2">Metadata file*
        <TheTooltip text="A link to the JSON metadata file stored, for example, on Arweave."/>
      </label>

      <div class="block mb-3">
        <input
          type="radio"
          id="is-uri"
          :value="true"
          v-model="userHasUri"
          class="rounded-none text-pink focus:ring-cyan mr-2"
        />
        <label for="is-uri" class="text-base text-gray-400">I have a file</label>
      </div>

      <div v-if="userHasUri" class="block mb-3">
        <input
          type="text"
          id="uri"
          v-model="mainState.uri"
          class="w-full text-grey focus:ring-cyan focus:border-cyan block"
          placeholder="a link to metadata file"
        >
        <span v-if="v$Main.uri.$error" class="text-sm text-cyan block mt-2">
        {{ v$Main.uri.$errors[0].$message }}
        </span>
      </div>

      <div class="block mb-3">
        <input
          type="radio"
          id="no-uri"
          :value="false"
          v-model="userHasUri"
          class="rounded-none text-pink focus:ring-cyan mr-2"
        />
        <label for="no-uri" class="text-gray-400">I need a file</label>
      </div>

      <div v-if="!userHasUri" class="block mb-5">
        <MetadataFileForm
          :connected="connected"
          @uploaded-metadata="setUri"
        />
      </div>
      
      <div v-if="showUriSuccessMessage">
        <p class="text-cyan block my-2">
          Success! Your file link has been added to the field.
        </p>
      </div>

    </div>

    <!-- Seller fee field. -->
    <div class="mb-7">
      <label for="seller-fee" class="flex block text-base text-white mb-2">Royalties*
        <TheTooltip text="A royalty that is paid to creator(s) in the event of a sale, in basis points. For example, 550 = 5.5%."/>
      </label>
      <input
        type="text"
        id="seller-fee"
        v-model="mainState.sellerFee"
        class="w-full text-gray-500 focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. 500"
      >
      <span v-if="v$Main.sellerFee.$error" class="text-sm text-cyan block mt-2">
        {{ v$Main.sellerFee.$errors[0].$message }}
      </span>
    </div>

    <!-- Is mutable field. -->
    <div class="mb-7">
      <label for="is-mutable" class="flex block text-base text-white mb-2">Is mutable
        <TheTooltip text="If chosen, the NFT can be updated after creation."/>
      </label>
      <input
        type="checkbox"
        id="is-mutable"
        v-model="mainState.isMutable"
        class="text-pink focus:ring-cyan"
      >
    </div>

    <!-- Collection field. -->
    <div class="mb-7">
      <label for="nft-type" class="flex block text-base text-white mb-2">
        Collection
        <TheTooltip text="Optional collection. You must be the collection authority to verifiably set the NFT as part of it."/>
      </label>
      <input
        type="text"
        id="uri"
        v-model="mainState.collection"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="collection address"
      >
    </div>

    <!-- Add a creator field. -->
    <div class="mb-7">
      <label class="flex block text-base text-white mb-2">Add a creator
        <TheTooltip text="Creator(s) of the NFt. Maximum is 5. Note that only a signer (you) can be added as a 'verified' creator."/>
      </label>

      <!-- Address field. -->
      <label class="block text-base text-gray-400 mb-2">Address*</label>
      <input
        type="text"
        id="address"
        v-model="creatorState.address"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block mb-2"
        placeholder="creator's address"
      >
      <span v-if="v$Creator.address.$error" class="text-sm text-cyan block my-2">
        {{ v$Creator.address.$errors[0].$message }}
      </span>

      <!-- Share field. -->
      <label class="flex block text-base text-gray-400 mb-2">Share*
        <TheTooltip text="Share of the royalties to the creator, in percentages. For example, 50 = 50%. Note that the shares must add up to 100."/>
      </label>
      <input
        type="text"
        id="share"
        v-model="creatorState.share"
        class="w-full text-gray-500 focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. 50"
      >
      <span v-if="v$Creator.share.$error" class="text-sm text-cyan block my-2">
        {{ v$Creator.share.$errors[0].$message }}
      </span>

      <!-- 'Add' button. -->
      <button
        class="mt-4 p-2 text-base text-pink border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
        :disabled="!connected"
        :class="!connected ? 'cursor-not-allowed' : 'cursor-allowed'"
        @click="addCreator(creatorState.address, creatorState.share)">
        Add
      </button>

      <!-- Creators container. -->
      <div v-if="!mainState.creators.length == 0">
        <div class="container w-full text-white my-6 bg-black">
          Creators:
          <div v-for="(creator, index) in mainState.creators" :key="creator">
            <div class="container w-full text-gray-400 mt-3 px-3 bg-black border-l-solid border-l-2 border-l-cyan">
              Address:
              <p class="truncate text-white my-1"> {{ creator.address }} </p>
              Share:
              <p class="text-white my-1"> {{ creator.share }}</p>

              <!-- 'Delete' button. -->
              <button
                class="mt-2 p-2 bg-black text-pink border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
                @click="deleteCreator(index)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes. -->
    <p class="mt-3 mb-7 text-cyan">
      *Cost of creating one NFT: ~0.012 SOL<br>
      *This app does not charge fees.
    </p>

    <!-- Submit button. -->
    <button
      class="flex justify-center w-full mb-7 lg:mb-10 p-3 font-bold lg:text-lg text-pink bg-black border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
      :disabled="isMinting || !connected"
      :class="isMinting || !connected ? 'cursor-not-allowed' : 'cursor-allowed'"
      @click="mintNft">
      <span v-if="isMinting" class="flex text-cyan">
        <svg
          class="mr-3 fill-cyan w-5 h-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          >
        <path d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z"/>
        </svg>
        Minting...
      </span>
      <span v-else>
        Mint
      </span>
    </button>

  </form>
</template>

<script>
import TheTooltip from './TheTooltip'
import MetadataFileForm from './MetadataFileForm'
import { computed, reactive } from 'vue'
import { useWallet } from 'solana-wallets-vue'
import useValidate from '@vuelidate/core'
import { required, numeric, maxValue, url } from '@vuelidate/validators'
import { mintNft } from '@/api'

export default {
  name: 'TheForm',
  components: {
    TheTooltip,
    MetadataFileForm
  },
  data() {
    return {
      userHasUri: true,
      showUriSuccessMessage: false,
      connected: useWallet().connected,
      userAddress: useWallet().publicKey,
      isMinting: false
    }
  },
  setup() {

    const { publicKey } = useWallet();

    const mainState = reactive({
      receiver: publicKey,
      name: "",
      symbol: "",
      uri: "",
      sellerFee: 0,
      isMutable: false,
      collection: "",
      creators: []
    });
    const mainRules = computed(() => {
      return {
        receiver: { required },
        name: { required },
        symbol: { required },
        uri: { required, url },
        sellerFee: {
          required,
          numeric,
          maxValue: maxValue(10000)
        }
      }
    });
    const v$Main = useValidate(mainRules, mainState);

    const creatorState = reactive({
      address: "",
      share: 0
    });
    const creatorRules = computed(() => {
      return {
        address: { required },
        share: {
          required,
          numeric,
          maxValue: maxValue(100)
        }
      }
    });
    const v$Creator = useValidate(creatorRules, creatorState);

    return { mainState, creatorState, v$Main, v$Creator }
  },
  methods: {
    setUri(data) {
      this.mainState.uri = data.uri;
      this.userHasUri = true;
      this.showUriSuccessMessage = true;
    },
    async mintNft() {

      await this.v$Main.$validate();

      if (!this.v$Main.$error) {

        if (!this.isValidShares()) {
          alert("Creator shares must add up to 100.")
          return;
        }

        this.isMinting = true;

        const res = await mintNft(
          this.mainState.receiver,
          this.mainState.name,
          this.mainState.symbol,
          this.mainState.uri,
          parseInt(this.mainState.sellerFee, 10),
          this.mainState.isMutable,
          this.mainState.collection,
          this.mainState.creators
        );

        if (res instanceof Error) {
          alert(res);
          this.isMinting = false;
          return;
        }

        this.$emit('created-nft', res);

        this.isMinting = false;
        
      } else {
        alert("Invalid data inputted");
      }
    },
    async addCreator(address, share) {

      await this.v$Creator.$validate();

      if (!this.v$Creator.$error) {

        if (this.isTooManyCreators()) {
          alert("Can't add more than 5 creators")
          return;
        }
        if (!this.isUniqueCreator(address)) {
          alert("That address is already added");
          return;
        }

        this.mainState.creators.push({
          address,
          share: parseInt(share, 10)
        });

        this.creatorState.address = "";
        this.creatorState.share = 0;

      } else {
        alert("Cannot add a creator due to invalid data");
      }
    },
    deleteCreator(index) {
      this.mainState.creators.splice(index, 1);
    },
    isTooManyCreators() {
      const len = this.mainState.creators.length;

      return (len > 4);
    },
    isUniqueCreator(address) {
      let res = true;
      this.mainState.creators.forEach(creator => {
        if (creator.address == address) {
          res = false;
        }
      });

      return res;
    },
    isValidShares() {
      if (this.mainState.creators.length == 0) {
       return true;
      }

      const totalShare = computed(() => {
        let sum = 0;
        this.mainState.creators.forEach(creator => {
        sum = sum + creator.share;
        });
        return sum;
      });

      return (totalShare.value == 100);
    }
  }
}
</script>
