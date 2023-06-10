<template >
  <div class="modal fade" id="updateBookModal" role="dialog" aria-labelledby="updateBookModal" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addBookModalLabel">წიგნის განახლება</h5>
          <button type="button" class="btn btn-secondary" @click="ClearInputs()" data-bs-dismiss="modal">X</button>
        </div>
        <div class="modal-body d-flex flex-column gap-3">
          <div class="form-group">
            <label for="title">სათაური</label>
            <input type="text" class="form-control" id="titleInput" v-model="resource.title" required>
          </div>
          <div class="form-group ">
            <label for="subtitle">ქვესათაური</label>
            <input type="text" class="form-control" id="subtitleInput" v-model="resource.subTitle" required>
          </div>
          <div class="form-group">
            <label for="authors">ავტორები</label>
            <div>
              <div class="d-flex gap-2">
                <input type="text" class="form-control" id="authorsInput" v-model="authorInput" required>
                <button :disabled="!authorInput" @click="resource.authors.push(String(authorInput)); authorInput = ''"
                  class="btn btn-primary">+</button>
              </div>
              <div class="d-flex flex-column bg-light mt-2 p-2 rounded">
                <div class="d-flex justify-content-between" v-for="  author   in   resource.authors  ">
                  <span> {{ author }} </span>
                  <button @click=" resource.authors.splice(resource.authors.indexOf(author), 1); "
                    class="btn btn-primary">-</button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="authors">რედაქტორები</label>
            <div>
              <div class="d-flex gap-2">
                <input type="text" class="form-control" id="authorsInput" v-model=" editorInput " required>
                <button :disabled=" !editorInput " @click=" resource.editors.push(String(editorInput)); editorInput = '' "
                  class="btn btn-primary">+</button>
              </div>
              <div class="d-flex flex-column bg-light mt-2 p-2 rounded">
                <div class="d-flex justify-content-between" v-for="  editor   in   resource.editors  ">
                  <span> {{ editor }} </span>
                  <button @click=" resource.editors.splice(resource.editors.indexOf(editor), 1); "
                    class="btn btn-primary">-</button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="description">დახასიათება</label>
            <input type="text" class="form-control" id="descriptionInput" v-model=" resource.description ">
          </div>
          <div class="form-group">
            <label for="category">კატეგორია</label>
            <input type="text" class="form-control" id="categoryInput" v-model=" resource.category ">
          </div>
          <div class="form-group">
            <label for="isbn">ISBN</label>
            <input type="text" class="form-control" id="isbnInput" v-model=" resource.isbn ">
          </div>
          <div class="form-group">
            <label for="publisher">გამომცემლობა</label>
            <input type="text" class="form-control" id="publisherInput" v-model=" resource.publication ">
          </div>
          <div class="form-group">
            <label for="publicationPlace">გამოცემის ადგილი</label>
            <input type="text" class="form-control" id="publicationPlaceInput" v-model=" resource.publicationLocation ">
          </div>
          <div class="form-group">
            <label for="publicationYear">გამოცემის წელი</label>
            <input type="text" class="form-control" id="publicationYearInput" v-model=" resource.publicationYear ">
          </div>
          <div class="form-group">
            <label for="summary">რეზიუმე</label>
            <input type="text" class="form-control" id="summaryInput" v-model=" resource.resume ">
          </div>
          <div class="form-group">
            <label for="keywords">რიმარკი</label>
            <input type="text" class="form-control" id="keywordsInput" v-model=" resource.remark ">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model=" resource.saveCipher ">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click=" addBook() ">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Book } from '@/interfaces/Book';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BookUpdate',
  props: {
    add_pressed: {
      type: Function,
      default: (resource: any) => { }
    },
    resource: {
      type: Book,
      default: {}
    }
  },
  data() {
    return {
      authorInput: '' as String,
      editorInput: '' as String,
    };
  },
  computed: {
    isResourceEmpty() {
      return Object.keys(this.resource).length === 0;
    }
  },
  methods: {
    addBook() {
      this.$emit('add_pressed', this.resource);
    },
    ClearInputs() {
      this.authorInput = '';
      this.editorInput = '';
    }
  }
});
</script>
  