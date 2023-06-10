<template>
  <div class="modal fade" id="updateRiderModal" role="dialog" aria-labelledby="updateRiderModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addBookModalLabel">რიდერის განახლება</h5>
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
          <div class="form-group ">
            <label for="subtitle">ავტორი</label>
            <input type="text" class="form-control" id="authorInput" v-model="resource.author" required>
          </div>
          <div class="form-group">
            <label for="keywords">რიმარკი</label>
            <input type="text" class="form-control" id="keywordsInput" v-model="resource.remark">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model="resource.saveCipher">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="updateRider()">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Rider } from '@/interfaces/Rider';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RiderUpdate',
  props: {
    add_pressed: {
      type: Function,
      default: (resource: any) => { }
    },
    resource: {
      type: Rider,
      default: {}
    }
  },
  data() {
    return {
      
    };
  },
  methods: {
    updateRider() {
      this.$emit('add_pressed', this.resource);
    },
    ClearInputs() {
      
    }
  }
});
</script>
  