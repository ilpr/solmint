<template>
  <div>
    <span class="ml-2 group relative inline-block">
      <i class="fa-regular fa-circle-question text-pink"/>
      <span class="absolute text-center text-sm lg:text-base text-gray-300 hidden group-hover:flex
      -top-2 -right-3 translate-x-full w-64
      px-2 py-1 bg-grey before:content-['']
      before:absolute before:top-5 before:right-[100%] before:-translate-y-1/2
      before:border-8 before:border-y-transparent before:border-l-transparent
      before:border-r-grey">
        {{ text }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
    name: 'TheTooltip',
    props: {
        text: String
    }
}
</script>
