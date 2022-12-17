<template>
    <div class="flex flex-col items-center space-y-4 w-full py-10 text-sm lg:text-base">

        <!-- 'Created by' text. -->
        <p class="font-semibold text-white">
            Created by ilpr
        </p>

        <!-- Icons. -->
        <div>
          <a
            href="https://github.com/ilpr"
            class="fa-brands fa-github text-xl text-cyan cursor-pointer"
            target="_blank"
          ></a>
          <a
            href="https://twitter.com/ilprdev"
            class="fa-brands fa-twitter ml-5 text-xl text-cyan cursor-pointer"
            target="_blank"
          ></a>
        </div>

        <!-- Link to the github repo. -->
        <a
          href="https://github.com/ilpr/solmint"
          class="mt-4 text-pink hover:text-cyan cursor-pointer"
          target="_blank"
        >
          Review the code
        </a>

    </div>
</template>

<script>
export default {
    name: 'TheFooter'
}
</script>
