<template>
  <div class="d-flex gap-4">
    <div>
      <img style="width: 130px; " src="@/assets/images/person.png">
    </div>
    <div class="d-flex gap-3 text-light">
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ bookTitle }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ subtitle }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ author }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ editor }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ description }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ category }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ isbn }}</span></div>
      </div>
      <div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ publication }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ publicationLocation }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ publicationYear }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resume }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ remark }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ saveCipher }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ review }}</span></div>
      </div>
    </div>
    <div class="d-flex gap-2 flex-column text-light">
      <button style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-pencil-square"></button>
      <button style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-trash3"></button>
      <button style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-download"></button>
      <button style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-clipboard2"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'book',
  props: {
    bookTitle: String,
    subtitle: String,
    author: String,
    editor: String,
    description: String,
    category: String,
    isbn: String,
    publication: String,
    publicationLocation: String,
    publicationYear: String,
    resume: String,
    remark: String,
    saveCipher: String,
    review: String,
  }
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
