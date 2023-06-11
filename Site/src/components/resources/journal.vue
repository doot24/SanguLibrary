<template>
  <div class="d-flex gap-4">
    <div>
      <img style="width: 130px;" class="rounded" src="@/assets/images/resource.png">
    </div>
    <div class="d-flex gap-3 text-light">
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>სათაური : {{ resource?.title }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>ქვესათაური : {{ resource?.subTitle }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>ავტორი : {{ formattedAuthors }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>რედაქტორი : {{ formattedEditors }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span> განხილვა : {{ resource?.description }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>კოლეგია : {{ resource?.collegues }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>კატეგორია : {{ resource?.category }}</span></div>
      </div>
      <div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>ნომერი : {{ resource?.number }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>რეზიუმე : {{ resource?.resume }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>შენიშვნა : {{ resource?.remark }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span> გამოცემა : {{ resource?.publication }}</span></div>
        <div class="p-2" style="background-color: #3B3748"><span>გამოცემის ადგილი : {{ resource?.publicationLocation }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>გამოცემის წელი : {{ resource?.publicationYear }}</span></div>
        <div class="p-2" style="background-color: #3B3748;"><span>შენახვის შიფრი : {{ resource?.saveCipher }}</span></div>
        <div class="p-2" style="background-color: rgba(61, 55, 71, 0.43);"><span>ISSN : {{ resource?.issn }}</span></div>
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
