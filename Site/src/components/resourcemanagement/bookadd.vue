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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="addBook(resource)">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';
import { Book } from '@/interfaces/Book';

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

      resourceType : ResourceType,
      
      title: '' as String,
      subtitle: '' as String,
      resume: '' as String,
      remark: '' as String,
      category: '' as String,
      description: '' as String,
      isbn: '' as String,
      authors: [] as any,
      editors: [] as any,
      publication: '' as String,
      publicationYear: '' as String,
      publicationLocation: '' as String,
      saveCipher: '' as String
    };
  },
  methods: {
    addBook() {
      let resource : any = {
        title: this.title,
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
        description: this.description
      }
      let book : Book = new Book(resource);
      this.$emit('add_pressed', book);
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
        this.description = ''
    }
  },
});
</script>
  