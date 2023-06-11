<template>
  <loadingSpinner v-if="isLoading" />
  <div class="modal fade" id="addCategoryModal" role="dialog" aria-labelledby="addCategoryModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addRiderModalLabel">კატეგორიის დამატება</h5>
          <button type="button" class="btn btn-secondary" @click="ClearInputs()" data-bs-dismiss="modal">X</button>
        </div>
        <div class="modal-body d-flex flex-column gap-3">
          <div  class="form-group bg-light p-3 rounded">
            <div v-for="category in categories" class="d-flex justify-content-between">
              <span>{{ category.index }}</span>
              <span>{{ category.text }}</span>
              <button class="mt-2 btn btn-primary" @click="DeleteCategory(category)">წაშლა</button>
            </div>
          </div>
          <div class="form-group">
            <label for="title">ინდექსი</label>
            <input type="text" class="form-control" id="indexInput" v-model="index" required>
          </div>
          <div class="form-group ">
            <label for="subtitle">ტექსტი</label>
            <input type="text" class="form-control" id="textInput" v-model="text" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="AddCategory();">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';

import { getApiConnectionString } from '@/assets/js/utils';
import axios from 'axios'
import loadingSpinner from '@/components/loadingSpinner.vue'

import { Category } from '@/interfaces/Category';

export default defineComponent({
  name: 'CategoryCrud',
  components: {
    loadingSpinner
  },
  props: {
    add_pressed: {
      type: Function,
      default: (resource: any) => { }
    }
  },
  data() {
    return {
      resourceType : ResourceType.Rider,

      index: '' as String,
      text: '' as String,
      isLoading : false as boolean,
      
      categories : [] as Array<Category>
    };
  },
  mounted() {
    this.GetCategories();
  },
  methods: {
    GetCategories() {
      this.isLoading = true;

      axios.get(getApiConnectionString() + '/admin/resourcemanagement/category', {
        withCredentials: true,
      }).then((results) => {
        this.categories = results.data.categories;
        this.isLoading = false;

      }).catch((error) => {
        this.isLoading = false;
      });
    },
    AddCategory() {
      this.isLoading = true;

      axios.post(getApiConnectionString() + '/admin/resourcemanagement/category/add', {index : this.index, text : this.text}, {
        withCredentials: true,
      }).then((results) => {
        this.categories = results.data.categories;
        this.isLoading = false;
        this.GetCategories();

      }).catch((error) => {
        this.isLoading = false;
      });
    },
    DeleteCategory(category : any) {
      this.isLoading = true;

      axios.post(getApiConnectionString() + '/admin/resourcemanagement/category/delete', {index : category.index}, {
        withCredentials: true,
      }).then((results) => {
        this.categories = results.data.categories;
        this.isLoading = false;
        this.GetCategories();

      }).catch((error) => {
        this.isLoading = false;
      });
    },
    ClearInputs() {
        this.index = '';
        this.text = '';
    }
  },
});
</script>
  