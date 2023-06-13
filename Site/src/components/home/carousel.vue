<template>
  <div v-if="section.length > 0" class="p-3 rounded d-flex flex-column section" >
    <div class="d-flex gap-2">
      <!-- <i class="category-icon bi bi-graph-up rounded p-2" style="font-size:1.3em;"></i> -->
      <span class="align-self-center category-text"><strong>{{ title }}</strong></span>
    </div>
    <div class="p-4 mt-3 rounded">
      <div :id="uniqueID" class="carousel slide d-flex flex-row">
        <div class="col-2 d-flex align-items-center justify-content-center">
          <button v-show="section.length > 4" :data-bs-target="`#${uniqueID}`" class="rounded-circle carouselButton" data-bs-slide="prev">
            <span class="bi-caret-left-fill" aria-hidden="true"></span>
          </button>
        </div>
        <div class="carousel-inner">
          <div v-for="(slideItems, slideIndex) in chunkArray(section, 4)" :class="{'carousel-item': true, 'active': slideIndex === 0}" :key="slideIndex">
            <div class="d-flex flex-row gap-3">
              <div v-for="(resource, resourceIndex) in slideItems" :key="resourceIndex" class="d-flex flex-column gap-3">
                <span class="badge badge-pill bg-danger badge-primary" style="width:46%" v-if="resource.hold">დაჯავშინლია</span>
                <span class="badge badge-pill bg-danger badge-primary" style="width:46%" v-if="resource.checkout">გატანილია</span>
                <div class="d-flex flex-row gap-5">
                  <img width="130" height="180" class="rounded" src="@/assets/images/resource.png" />
                </div>
                <span>სათაური : {{ resource.title }}</span>
                <span v-if="resource.authors">ავტორი : {{ resource.authors.join(", ") }}</span>
                <span v-if="resource.author" >ავტორი : {{ resource.author }}</span>
                <span v-if="resource.editors">რედაქტორი : {{ resource.editors.join(", ") }}</span>
                <span v-if="resource.editor" >რედაქტორი :{{ resource.editor }}</span>
                <span>გამოცემის წელი : {{ resource.publicationYear }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
          <button v-show="section.length > 4" :data-bs-target="`#${uniqueID}`" class="rounded-circle carouselButton" data-bs-slide="next">
            <span class="bi-caret-right-fill" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/components/carousel.css" scoped />

<script>
import { defineComponent } from 'vue';
import uuid4 from 'uuid4';

export default defineComponent({
  name: 'carousel',
  props: {
    section: {
      type: Object,
    },
    title: {
      type: String,
    }
  },
  data() {
    return {
      uniqueID: 'c' + uuid4().replace(/-/g, ''),
    };
  },
  methods: {
    chunkArray(arr, size) {
      const chunkedArray = [];
      for (let i = 0; i < arr.length; i += size) {
        chunkedArray.push(arr.slice(i, i + size));
      }
      return chunkedArray;
    },
  },
});
</script>
