<template>
  <div class="modal fade" id="addJournalModal" role="dialog" aria-labelledby="addJournalModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addRiderModalLabel">ჟურნალის დამატება</h5>
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
            <label for="authors">კოლეგია</label>
            <div>
              <div class="d-flex gap-2">
                <input type="text" class="form-control" id="authorsInput" v-model="collegueInput" required>
                <button :disabled="!collegueInput" @click="collegues.push(collegueInput); collegueInput = ''" class="btn btn-primary">+</button>
              </div>
              <div v-if="authors.length > 0" class="d-flex flex-column bg-light mt-2 p-2 rounded">
                <div class="d-flex justify-content-between" v-for="collegue in collegues">
                  <span> {{ collegue }} </span>
                  <button @click="authors.splice(collegues.indexOf(collegue), 1); collegueInput = ''" class="btn btn-primary">-</button>
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
            <label for="description">ნომერი</label>
            <input type="text" class="form-control" id="descriptionInput" v-model=" number ">
          </div>
          <div class="form-group">
            <label for="category">კატეგორია</label>
            <input type="text" class="form-control" id="categoryInput" v-model=" category ">
          </div>
          <div class="form-group">
            <label for="isbn">ISSN</label>
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
          <button v-bind:disabled="pressed" type="button" class="btn btn-primary" @click="addJournal(resource); pressed = true">შესახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';

export default defineComponent({
  name: 'JournalAdd',
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
      collegueInput: '' as String,

      pressed : false as boolean,
      resourceType : ResourceType.Journal,

      title: '',
      digital: false,
      subtitle: '',
      resume: '',
      remark: '',
      number: 0,

      category: '',
      description: '',
      isbn: '',
      collegues: [] as any,
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
    },
    addJournal() {
      let resource = {
        title: this.title,
        digital: this.digital,
        subtitle: this.subtitle,
        resume: this.resume,
        remark: this.remark,
        resourceType: this.resourceType,
        isbn: this.resume,
        number: this.number,
        collegues: this.collegues,
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
        this.authorInput = '';
        this.editorInput = '';
        this.collegueInput = '';
        
        this.title = '';
        this.digital = false;
        this.subtitle = '';
        this.resume = '';
        this.remark = '';
        this.isbn = '';
        this.authors = [];
        this.editors = [];
        this.collegues = [];
        this.publication = '';
        this.publicationYear = '';
        this.publicationLocation = '';
        this.saveCipher = '';
        this.category = '';
        this.description = '';
        this.number = 0;

        this.fileBuffer = '';
        this.coverBuffer = '';

        this.pressed = false
    }
  },
});
</script>
  