<template>
  <div class="d-flex gap-4">
    <div>
      <img style="width: 130px;"  :src="resource?.digitalResource.coverURL">
    </div>
    <div class="d-flex gap-3 text-light">
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.title }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.subTitle }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ formattedAuthors }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ formattedEditors }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.description }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.category }}</span></div>
      </div>
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.resume }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.remark }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.publication }}</span></div>
        <div class="p-2" style="background-color: #3B3748"><span>{{ resource?.publicationLocation }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.publicationYear }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>შიფრი : {{ resource?.saveCipher }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.isbn }}</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Book',
  props: {
    resource : Object,
   
    editMethod: Function,
    deleteMethod: Function, 
    downloadMethod: Function,
    clipboardMethod: Function, 
  },
  computed: {
    formattedAuthors() {
      if (this.resource?.authors && this.resource?.authors.length > 0) {
        return this.resource?.authors.join(', ');
      }
      return '';
    },
    formattedEditors() {
      if (this.resource?.editors && this.resource?.editors.length > 0) {
        return this.resource.editors.join(', ');
      }
      return '';
    },
  },
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
