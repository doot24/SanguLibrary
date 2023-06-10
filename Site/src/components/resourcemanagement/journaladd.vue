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
            <input type="text" class="form-control" id="isbnInput" v-model=" issn ">
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
            <label for="keywords">რიმარკი</label>
            <input type="text" class="form-control" id="keywordsInput" v-model=" remark ">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model=" saveCipher ">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="addJournal();">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';
import { Journal } from '@/interfaces/Journal';

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

      resourceType : ResourceType.Journal,

      title: '' as String,
      subtitle: '' as String,
      remark: '' as String,
      number: 0 as Number,

      category: '' as String,
      description: '' as String,
      issn: '' as String,
      collegues: [] as any,
      authors: [] as any,
      editors: [] as any,
      publication: '' as String,
      publicationYear: '' as String,
      publicationLocation: '' as String,
      saveCipher: '' as String
    };
  },
  methods: {
    addJournal() {
      let resource : any = {
        title: this.title,
        subtitle: this.subtitle,
        remark: this.remark,
        resourceType: this.resourceType,
        issn: this.issn,
        number: this.number,
        collegues: this.collegues,
        authors: this.authors,
        editors: this.editors,
        publication: this.publication,
        publicationYear: this.publicationYear,
        publicationLocation: this.publicationLocation,
        saveCipher: this.saveCipher,
        category: this.category,
        description: this.description
      }
      let journal : Journal = new Journal(resource);
      this.$emit('add_pressed', journal);
    },
    ClearInputs() {
        this.authorInput = '';
        this.editorInput = '';
        this.collegueInput = '';
        
        this.title = '';
        this.subtitle = '';
        this.remark = '';
        this.issn = '';
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
    }
  },
});
</script>
  