<template>
  <div class="modal fade" id="addBookModal" role="dialog" aria-labelledby="addBookModalLabel" aria-hidden="true"
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
            <input type="text" class="form-control" id="titleInput" v-model="title" required>
          </div>
          <div class="form-group ">
            <label for="subtitle">ქვესათაური</label>
            <input type="text" class="form-control" id="subtitleInput" v-model="subtitle" required>
          </div>
          <div class="form-group">
            <label for="authors">ავტორები</label>
            <div>
              <div class="d-flex gap-2">
                <input type="text" class="form-control" id="authorsInput" v-model="authorInput" required>
                <button :disabled="!authorInput" @click="authors.push(authorInput); authorInput = ''" class="btn btn-primary">+</button>
              </div>
              <div v-if="authors.length > 0" class="d-flex flex-column bg-light mt-2 p-2 rounded">
                <div class="d-flex justify-content-between" v-for="author in authors">
                  <span> {{ author }} </span>
                  <button @click="authors.splice(authors.indexOf(author), 1); authorInput = ''" class="btn btn-primary">-</button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="authors">რედაქტორები</label>
            <div>
              <div class="d-flex gap-2">
                <input type="text" class="form-control" id="authorsInput" v-model="editorInput" required>
                <button :disabled="!editorInput" @click="editors.push(editorInput); editorInput = ''" class="btn btn-primary">+</button>
              </div>
              <div v-if="editors.length > 0" class="d-flex flex-column bg-light mt-2 p-2 rounded">
                <div class="d-flex justify-content-between" v-for="editor in editors">
                  <span> {{ editor }} </span>
                  <button @click="authors.splice(editors.indexOf(editor), 1); editors = ''" class="btn btn-primary">-</button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="description">დახასიათება</label>
            <input type="text" class="form-control" id="descriptionInput" v-model=" description ">
          </div>
          <div class="form-group">
            <label for="category">კატეგორია</label>
            <input type="text" class="form-control" id="categoryInput" v-model=" category ">
          </div>
          <div class="form-group">
            <label for="isbn">ISBN</label>
            <input type="text" class="form-control" id="isbnInput" v-model=" isbn ">
          </div>
          <div class="form-group">
            <label for="publisher">გამომცემლობა</label>
            <input type="text" class="form-control" id="publisherInput" v-model=" publication ">
          </div>
          <div class="form-group">
            <label for="publicationPlace">გამოცემის ადგილი</label>
            <input type="text" class="form-control" id="publicationPlaceInput" v-model=" publicationLocation ">
          </div>
          <div class="form-group">
            <label for="publicationYear">გამოცემის წელი</label>
            <input type="text" class="form-control" id="publicationYearInput" v-model=" publicationYear ">
          </div>
          <div class="form-group">
            <label for="summary">რეზიუმე</label>
            <input type="text" class="form-control" id="summaryInput" v-model=" resume ">
          </div>
          <div class="form-group">
            <label for="keywords">რიმარკი</label>
            <input type="text" class="form-control" id="keywordsInput" v-model=" remark ">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model=" saveCipher ">
          </div>
          <div class="form-group">
            <label for="fileUploadCover">ყდის ფაილი</label>
            <input type="file" class="form-control" id="fileUploadCoverInput" @change="HandleCoverUpload">
          </div>
          <div class="form-group d-flex gap-2">
            <label for="fileUploadCover">ციფრული მასალა</label>
            <input type="checkbox" class="form-check-input" v-model=" digital ">
          </div>
          <div v-if=" digital " class="">
            <label for="fileUploadBook">წიგნის ფაილი</label>
            <input type="file" class="form-control" id="fileUploadBookInput" @change="HandleFileUpload">
          </div>
        </div>
        <div class="modal-footer">
          <button v-bind:disabled="pressed" type="button" class="btn btn-primary" @click="addBook(resource); pressed = true">შესახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';

export default defineComponent({
  name: 'BookAdd',
  props: {
    add_pressed: {
      type: Function,
      default: (resource: any) => { }
    }
  },
  data() {
    return {
      authorInput: '' as String,
      editorInput: '' as String,

      pressed : false as boolean,
      resourceType : ResourceType,

      title: '',
      digital: false,
      subtitle: '',
      resume: '',
      remark: '',
      category: '',
      description: '',
      isbn: '',
      authors: [] as any,
      editors: [] as any,
      publication: '',
      publicationYear: '',
      publicationLocation: '',
      saveCipher: '',

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
      let resource = {
        title: this.title,
        digital: this.digital,
        subtitle: this.subtitle,
        resume: this.resume,
        remark: this.remark,
        resourceType: this.resourceType.Book,
        isbn: this.resume,
        authors: this.authors,
        editors: this.editors,
        publication: this.publication,
        publicationYear: this.publicationYear,
        publicationLocation: this.publicationLocation,
        saveCipher: this.saveCipher,
        category: this.category,
        description: this.description,
        file : this.fileBuffer,
        cover: this.coverBuffer
      }
      this.$emit('add_pressed', resource);
    },
    addAuthor() {
      this.authors.push(this.authorInput);
      this.authorInput = '';
    },
    addEditor() {
      this.editors.push(this.editorInput);
      this.editorInput = '';
    },
    ClearInputs() {
        this.authorInput = '',
        this.editorInput = '',

        this.title = '',
        this.digital = false,
        this.subtitle = '',
        this.resume = '',
        this.remark = '',
        this.isbn = '',
        this.authors = [],
        this.editors = [],
        this.publication = '',
        this.publicationYear = '',
        this.publicationLocation = '',
        this.saveCipher = '',
        this.category = '',
        this.description = '',

        this.fileBuffer = '';
        this.coverBuffer = '';

        this.pressed = false
    }
  },
});
</script>
  