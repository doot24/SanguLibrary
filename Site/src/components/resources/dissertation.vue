<template>
  <div class="d-flex gap-4">
    <div>
      <img style="width: 130px;" src="@/assets/images/person.png">
    </div>
    <div class="d-flex gap-3 text-light">
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>სათაური : {{ resource?.title }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>ქვესათაური : {{ resource?.subTitle }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>ავტორი : {{resource?.author }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>პროფესორი : {{ resource?.professor }}</span></div>
      </div>
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>გამოცემის წელი : {{ resource?.publicationYear }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>შენახვის შიფრი : {{ resource?.saveCipher }}</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Journal',
  props: {
    resource : Object,
   
    editMethod: Function,
    deleteMethod: Function, 
    downloadMethod: Function,
    clipboardMethod: Function, 
  }
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
