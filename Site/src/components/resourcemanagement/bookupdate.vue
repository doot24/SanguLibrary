<template>
  <div class="modal fade" id="updateBookModal" role="dialog" aria-labelledby="updateBookModal" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addBookModalLabel">წიგნის დამატება</h5>
          <button type="button" class="btn btn-secondary" @click="ClearInputs()" data-bs-dismiss="modal">X</button>
        </div>
        <div class="modal-body d-flex flex-column gap-3">
          <div class="form-group">
            <label for="title">სათაური</label>
            <input type="text" class="form-control" id="titleInput" v-model="resource.title" required>
          </div>
          <div class="form-group ">
            <label for="subtitle">ქვესათაური</label>
            <input type="text" class="form-control" id="subtitleInput" v-model="resource.subtitle" required>
          </div>
          <div class="form-group">
            <label for="authors">ავტორები</label>
            <div class="d-flex gap-2">
              <input type="text" class="form-control" id="authorsInput" v-model="authorInput" required>
              <button @click="resource.authors.push(authorInput); authorInput = ''" class="btn btn-primary">+</button>
            </div>
          </div>
          <div class="form-group">
            <label for="editors">რედაქტორები</label>
            <div class="d-flex gap-2">
              <input type="text" class="form-control" id="editorsInput" v-model=" editorInput " required>
              <button @click=" resource.editors.push(editorInput); editorInput = '' " class="btn btn-primary">+</button>
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
            <input type="text" class="form-control" id="publisherInput" v-model="resource.publication ">
          </div>
          <div class="form-group">
            <label for="publicationPlace">გამოცემის ადგილი</label>
            <input type="text" class="form-control" id="publicationPlaceInput" v-model="resource.publicationLocation ">
          </div>
          <div class="form-group">
            <label for="publicationYear">გამოცემის წელი</label>
            <input type="text" class="form-control" id="publicationYearInput" v-model="resource.publicationYear ">
          </div>
          <div class="form-group">
            <label for="summary">რეზიუმე</label>
            <input type="text" class="form-control" id="summaryInput" v-model="resource.resume ">
          </div>
          <div class="form-group">
            <label for="keywords">რიმარკი</label>
            <input type="text" class="form-control" id="keywordsInput" v-model="resource.remark ">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model="resource.saveCipher ">
          </div>
          <div class="form-group">
            <label for="fileUploadCover">ყდის ფაილი</label>
            <input type="file" class="form-control" id="fileUploadCoverInput" @change="HandleCoverUpload">
          </div>
          <div class="form-group d-flex gap-2">
            <label for="fileUploadCover">ციფრული მასალა</label>
            <input type="checkbox" class="form-check-input" v-model="resource.digital">
          </div>
          <div v-if="resource.digital" class="">
            <label for="fileUploadBook">წიგნის ფაილი</label>
            <input type="file" class="form-control" id="fileUploadBookInput" @change="HandleFileUpload">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click=" addBook() ">შესახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BookUpdate',
  props : {
    add_pressed: {
            type: Function,
            default: (resource : any) => { }
        },
        resource:{
          type: Object,
          default: {}
        }
  },
  data() {
    return {
      authorInput: '' as String,
      editorInput: '' as String,

      fileBuffer :  null as any,
      coverBuffer : null as any,
    };
  },
  methods: {
    HandleFileUpload(event : any)
    {
      this.fileBuffer = event.target.files[0]
    },
    HandleCoverUpload(event : any)
    {
      this.coverBuffer = event.target.files[0]
      console.log(this.coverBuffer)
    },
    addBook() {
      this.resource.file = this.fileBuffer;
      this.resource.cover = this.coverBuffer;

      this.$emit('add_pressed', this.resource);
    },
    addAuthor() {
      this.resource.authors.push(this.authorInput);
      this.authorInput = '';
    },
    addEditor() {
      this.resource.editors.push(this.editorInput);
      this.editorInput = '';
    },
    ClearInputs() {
      this.authorInput = '';
      this.editorInput = '';
    }
  }
});
</script>
  