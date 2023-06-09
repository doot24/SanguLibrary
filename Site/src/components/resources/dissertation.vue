<template>
  <div class="d-flex gap-4">
    <div>
      <img style="width: 130px;" v-bind:srcset=resource?.digitalResource.coverURL>
    </div>
    <div class="d-flex gap-3 text-light">
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.title }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.subTitle }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span> {{resource?.author }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.professor }}</span></div>
      </div>
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.publicationYear }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>შიფრი : {{ resource?.saveCipher }}</span></div>
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
