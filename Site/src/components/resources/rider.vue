<template>
  <div class="d-flex gap-4">
    <div>
      <img style="width: 130px;" v-bind:srcset=resource?.digitalResource.coverURL>
    </div>
    <div class="d-flex gap-3 text-light">
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{ resource?.title }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.subTitle }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>{{  resource?.author }}</span></div>
      </div>
      <div>
        <div class="p-2" style="background-color: #3B3748;"><span>{{ resource?.remark }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>შიფრი : {{ resource?.saveCipher }}</span></div>
      </div>
    </div>
    <div class="d-flex gap-2 flex-column text-light">
      <button v-if="editMethod" @click="edit" style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-pencil-square"></button>
      <button v-if="deleteMethod" @click="remove" style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-trash3"></button>
      <button v-if="downloadMethod" @click="download" style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-download"></button>
      <button v-if="clipboardMethod" @click="copyToClipboard" style="font-size:1.4em; background-color: transparent; border: none;" class="text-light bi-clipboard2"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Rider',
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
  methods: {
    edit() {
      if (this.editMethod) {
        this.editMethod(this.resource);
      }
    },
    remove() {
      if (this.deleteMethod) {
        this.deleteMethod(this.resource);
      }
    },
    download() {
      if (this.downloadMethod) {
        this.downloadMethod(this.resource);
      }
    },
    copyToClipboard() {
      if (this.clipboardMethod) {
        this.clipboardMethod(this.resource);
      }
    },
  },
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
