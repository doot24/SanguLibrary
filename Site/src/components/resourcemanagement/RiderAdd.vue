<template>
  <div class="modal fade" id="addRiderModal" role="dialog" aria-labelledby="addRiderModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addRiderModalLabel">რიდერის დამატება</h5>
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
            <label for="keywords">რიმარკი</label>
            <input type="text" class="form-control" id="keywordsInput" v-model=" remark ">
          </div>
          <div class="form-group">
            <label for="encryption">შენახვის შიფრი</label>
            <input type="text" class="form-control" id="encryptionInput" v-model=" saveCipher ">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="addRider();">შენახვა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { ResourceType } from '@/interfaces/Resource';
import { Rider } from '@/interfaces/Rider';

export default defineComponent({
  name: 'RiderAdd',
  props: {
    add_pressed: {
      type: Function,
      default: (resource: any) => { }
    }
  },
  data() {
    return {
      resourceType : ResourceType.Rider,

      title: '' as String,
      subtitle: '' as String,
      remark: '' as String,
      author: '' as string,
      saveCipher: '' as String
    };
  },
  methods: {
    addRider() {
      let resource : any = {
        title: this.title,
        subtitle: this.subtitle,
        author: this.author,
        remark: this.remark,
        resourceType: this.resourceType,
        saveCipher: this.saveCipher
      }
      let rider : Rider = new Rider(resource)
      this.$emit('add_pressed', rider);
    },
    ClearInputs() {
        this.title = '';
        this.author = '';
        this.subtitle = '';
        this.remark = '';
        this.saveCipher = '';
    }
  },
});
</script>
  