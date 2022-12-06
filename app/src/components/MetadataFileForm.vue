<template>
  <form class="flex flex-col pl-3 text-white border-l-solid border-l-2 border-l-cyan">

    <!-- Name field. -->
    <div class="mb-7">
      <label for="json-name" class="flex block mb-2">
        Name*
        <TheTooltip text="Same as the 'name' above."/>
      </label>
      <input
        type="text"
        id="json-name"
        v-model="mainState.name"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. Ape #1"
      />
      <span v-if="v$Main.name.$error" class="text-cyan block mt-2">
        {{ v$Main.name.$errors[0].$message }}
      </span>
    </div>

    <!-- Symbol field. -->
    <div class="mb-7">
      <label for="json-symbol" class="flex block mb-2">
        Symbol*
        <TheTooltip text="Same as the 'symbol' above."/>
      </label>
      <input
        type="text"
        id="json-symbol"
        v-model="mainState.symbol"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. APE"
      />
      <span v-if="v$Main.symbol.$error" class="text-cyan block mt-2">
        {{ v$Main.symbol.$errors[0].$message }}
      </span>
    </div>

    <!-- Description field. -->
    <div class="mb-7">
      <label for="description" class="flex block mb-2">
        Description*
        <TheTooltip text="Description of your NFT."/>
      </label>
      <input
        type="text"
        id="description"
        v-model="mainState.description"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. AI-generated pixel art on Solana."
      />
      <span v-if="v$Main.description.$error" class="text-cyan block mt-2">
        {{ v$Main.description.$errors[0].$message }}
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
      <span v-if="v$Main.imageFile.$error" class="text-cyan block mt-2">
        {{ v$Main.imageFile.$errors[0].$message }}
      </span>
    </div>

    <!-- Add a trait field. -->
    <div class="mb-7">
      <label class="flex block mb-2">
        Add a trait
        <TheTooltip text="You can add up to 10 specific traits of the NFT."/>
      </label>

      <!-- Trait type field. -->
      <label
        class="block text-gray-400 mb-2"
        for="traitType"
        >Trait type*
      </label>
      <input
        type="text"
        id="traitType"
        v-model="traitState.traitType"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block mb-2"
        placeholder="e.g. hat"
      >
      <span v-if="v$Trait.traitType.$error" class="text-cyan block my-2">
        {{ v$Trait.traitType.$errors[0].$message }}
      </span>

      <!-- Trait value field. -->
      <label
        class="flex block text-gray-400 mb-2"
        for="traitValue"
        >Value*
      </label>
      <input
        type="text"
        id="traitValue"
        v-model="traitState.traitValue"
        class="w-full text-gray-500 focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. beanie"
      >
      <span v-if="v$Trait.traitValue.$error" class="text-cyan block my-2">
        {{ v$Trait.traitValue.$errors[0].$message }}
      </span>

      <!-- 'Add' button. -->
      <button
        class="mt-4 p-2 text-pink border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
        :disabled="!connected"
        :class="!connected ? 'cursor-not-allowed' : 'cursor-allowed'"
        @click="addTrait(traitState.traitType, traitState.traitValue)">
        Add
      </button>

      <!-- Traits container. -->
      <div v-if="!mainState.traits.length == 0"
        class="container w-full text-white mt-6 bg-black">
        Traits:
        <div v-for="(trait, index) in mainState.traits" :key="trait">
          <div class="container w-full text-gray-400 mt-3 px-3 bg-black">
            <p class="mb-1"> Trait type: {{ trait['trait-type'] }} </p>
            <p class="my-1"> Value: {{ trait.value }}</p>

            <!-- 'Delete' button. -->
            <button
              class="my-2 p-2 bg-black text-pink border-solid border-2 border-pink hover:border-cyan hover:text-cyan"
              @click="deleteTrait(index)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Url field. -->
    <div class="mb-10">
      <label for="url" class="flex block mb-2">
        External link
        <TheTooltip text="Optional link pointing to a website defining the NFT."/>
      </label>
      <input
        type="text"
        id="url"
        v-model="mainState.url"
        class="w-full text-grey focus:ring-cyan focus:border-cyan block"
        placeholder="e.g. your art website"
      />
      <span v-if="v$Main.url.$error" class="text-cyan block mt-2">
        {{ v$Main.url.$errors[0].$message }}
      </span>
    </div>

    <!-- Button. -->
    <div class="w-full flex justify-center">
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
    </div>
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

    const mainState = reactive({
      name: "",
      symbol: "",
      description: "",
      imageFile: null,
      url: "",
      traits: []
    });
    const mainRules = computed(() => {
      return {
        name: { required },
        symbol: { required },
        description: { required },
        imageFile: { required },
        url: { url }
      }
    });
    const v$Main = useValidate(mainRules, mainState);

    const traitState = reactive({
      traitType: "",
      traitValue: null
    });
    const traitRules = computed(() => {
      return {
        traitType: { required },
        traitValue: { required }
      }
    });
    const v$Trait = useValidate(traitRules, traitState);

    return { mainState, v$Main, traitState, v$Trait }
  },
  methods: {
   addImage(event) {
      this.mainState.imageFile = event.target.files[0];
    },
    async addTrait(type, value) {

      await this.v$Trait.$validate();

      if (!this.v$Trait.$error) {

        if (this.isTooManyTraits()) {
          alert("Can't add more than 10 traits")
          return;
        }

        this.mainState.traits.push({
          'trait-type': type,
          value
        });

        this.traitState.traitType = "";
        this.traitState.traitValue = null;
      } else {
        alert("Cannot add a trait due to invalid data");
      }
    },
    isTooManyTraits() {
      const len = this.mainState.traits.length;

      return (len > 9);
    },
    deleteTrait(index) {
      this.mainState.traits.splice(index, 1);
    },
    async upload() {

      await this.v$Main.$validate();

      if (!this.v$Main.$error) {

        this.isCreating = true;

        const res = await uploadMetadata(
          this.mainState.name,
          this.mainState.symbol,
          this.mainState.description,
          this.mainState.imageFile,
          this.mainState.url,
          this.mainState.traits
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
