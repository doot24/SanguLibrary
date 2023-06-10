<template>
  <div class="modal fade" id="addDissertationModal" role="dialog" aria-labelledby="addDissertationModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addBookModalLabel">დისერტაციის დამატება</h5>
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
          <div class="form-group ">
            <label for="subtitle">ავტორი</label>
            <input type="text" class="form-control" id="authorInput" v-model="author" required>
          </div>
          <div class="form-group">
            <label for="description">პროფესორი</label>
            <input type="text" class="form-control" id="professorInput" v-model="professor">
          </div>
          
          <div class="form-group">
            <label for="publicationYear">გამოცემის წელი</label>
            <input type="text" class="form-control" id="publicationYearInput" v-model=" publicationYear ">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model=" saveCipher ">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="addDissertation(resource)">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';

export default defineComponent({
  name: 'DissertationAdd',
  props: {
    add_pressed: {
      type: Function,
      default: (resource: any) => { }
    }
  },
  data() {
    return {
      resourceType : ResourceType,
      
      title: '' as String,
      author: '' as String,
      subtitle: '' as String,
      professor: '' as String,
      publicationYear: '' as String,
      saveCipher: '' as String
    };
  },
  methods: {
    addDissertation() {
      let resource = {
        title: this.title,
        subTitle: this.subtitle,
        resourceType: this.resourceType.Dissertation,
        author: this.author,
        professor:this.professor,
        publicationYear: this.publicationYear,
        saveCipher: this.saveCipher
      }
      this.$emit('add_pressed', resource);
    },
    ClearInputs() {
        this.title = '',
        this.subtitle = '',
        this.author = '',
        this.publicationYear = '',
        this.professor = '',
        this.saveCipher = ''
    }
  },
});
</script>
  