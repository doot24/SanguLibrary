
<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />
  <div class="container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center Bodybackground">
    <search class="w-50"/>
    <div class="w-75 mt-5 p-3 rounded d-flex flex-column gap-5" style="width:90%;height:600px; overflow-y: scroll; background-color: #646074;">
      <book
      bookTitle="The Great Gatsby"
      subtitle="A Novel"
      author="F. Scott Fitzgerald"
      editor="Some Editor"
      description="Lorem ipsum dolor sit amet."
      category="Fiction"
      isbn="1234567890"
      publication="Some Publsisher"
      publicationLocation="New York"
      publicationYear="2023"
      resume="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      remark="Some remark"
      saveCipher="1"
      review="Some review"
    />
   
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import search from '@/components/search.vue'
import book from '@/components/resources/book.vue'
export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    search,
    book
  },
  data() {
    return {
      page: 1 as number,
      pageSize: 10 as number,
      isLoading: false as boolean,
    }
  },
});
</script>
