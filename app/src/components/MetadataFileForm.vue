<template>
  <form class="flex flex-col pl-3 text-white border-l-solid border-l-2 border-l-cyan">

    <!-- Name field. -->
    <div class="mb-7">
      <label for="name" class="flex block mb-2">
        Name*
        <TheTooltip text="Same as the 'name' above."/>
      </label>
      <input
        type="text"
        id="name"
        v-model="state.name"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. Ape #1"
      />
      <span v-if="v$.name.$error" class="text-cyan block mt-2">
        {{ v$.name.$errors[0].$message }}
      </span>
    </div>

    <!-- Symbol field. -->
    <div class="mb-7">
      <label for="symbol" class="flex block mb-2">
        Symbol*
        <TheTooltip text="Same as the 'symbol' above."/>
      </label>
      <input
        type="text"
        id="symbol"
        v-model="state.symbol"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. APE"
      />
      <span v-if="v$.symbol.$error" class="text-cyan block mt-2">
        {{ v$.symbol.$errors[0].$message }}
      </span>
    </div>

    <!-- Description field. -->
    <div class="mb-7">
      <label for="description" class="flex block mb-2">
        Description*
        <TheTooltip text="Short description of your NFT."/>
      </label>
      <input
        type="text"
        id="description"
        v-model="state.description"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. AI-generated pixel art on Solana."
      />
      <span v-if="v$.description.$error" class="text-cyan block mt-2">
        {{ v$.description.$errors[0].$message }}
      </span>
    </div>

    <!-- Image field. -->
    <div class="mb-7">
      <label for="image" class="flex block mb-2">
        Image*
        <TheTooltip text="Image, i.e. the main asset, of the NFT."/>
      </label>
      <input
        id="image"
        type="file"
        @change="addImage"
        accept=".jpg, .png, .svg"
        class="text-gray-400"
      />
      <span v-if="v$.imageFile.$error" class="text-cyan block mt-2">
        {{ v$.imageFile.$errors[0].$message }}
      </span>
    </div>

    <!-- Url field. -->
    <div class="mb-7">
      <label for="url" class="flex block mb-2">
        External link
        <TheTooltip text="Optional link pointing to a website defining the NFT."/>
      </label>
      <input
        type="text"
        id="url"
        v-model="state.url"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. your art website"
      />
      <span v-if="v$.url.$error" class="text-cyan block mt-2">
        {{ v$.url.$errors[0].$message }}
      </span>
    </div>

    <!-- Button. -->
    <button
      class="flex justify-center mb-1 w-44 p-2 text-pink bg-black border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
      :disabled="!connected"
      :class="!connected ? 'cursor-not-allowed' : 'cursor-allowed'"
      @click="upload"  
    >
      <span v-if="isCreating" class="flex text-cyan">
        <svg
          class="mr-2 fill-cyan w-5 h-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          >
        <path d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z"/>
        </svg>
        Creating...
      </span>
      <span v-else>
        Create a file
      </span>
    </button>

  </form>
</template>

<script>
import TheTooltip from './TheTooltip'
import { computed, reactive } from 'vue'
import useValidate from '@vuelidate/core'
import { required, url } from '@vuelidate/validators'
import { uploadMetadata } from '@/api'

export default {
  name: 'MetadataFileForm',
  components: {
    TheTooltip
  },
  props: {
    connected: Boolean
  },
  data() {
    return {
      isCreating: false
    }
  },
  setup() {

    const state = reactive({
      name: "",
      symbol: "",
      description: "",
      imageFile: null,
      url: ""
    });
    const rules = computed(() => {
      return {
        name: { required },
        symbol: { required },
        description: { required },
        imageFile: { required },
        url: { url }
      }
    });
    const v$ = useValidate(rules, state);

    return { state, v$ }
  },
  methods: {
   addImage(event) {
      this.state.imageFile = event.target.files[0];
    },
    async upload() {

      await this.v$.$validate();

      if (!this.v$.$error) {

        this.isCreating = true;

        const res = await uploadMetadata(
          this.state.name,
          this.state.symbol,
          this.state.description,
          this.state.imageFile,
          this.state.url
        );

        if (res instanceof Error) {
          alert(res);
          this.isCreating = false;
          return;
        }

        this.$emit('uploaded-metadata', res);

        this.isCreating = false;

      } else {
        alert("Invalid data inputted");
      }
    }
  }
}
</script>
