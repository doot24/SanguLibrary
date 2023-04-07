<template>
    <div>
      <button @click="showEditor = true" class="btn btn-light bi bi-pencil-square"></button>
  
      <div class="modal" tabindex="-1" role="dialog" style="display: block;" v-show="showEditor">
        <div class="modal-dialog" role="document" style="max-width: 60%;">
          <div class="modal-content" style="border:none;">
            <div class="modal-header" style="border:none;">
              <h5 class="modal-title" style="color:black;">დაწერეთ კომენტარი</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showEditor = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style="border:none;">
              <QuillEditor class="editor-background" :style="{ height: `${Height}px`, border:'none' }" :content-type="'html'"
      v-model:content="contents" @update:content="updateContents" theme="snow" :options="editorOptions"
      ref="editor" :placeholder="'დაწერეთ აქ...'"/>
            </div>
            <div class="modal-footer d-flex justify-content-between" style="border:none;">
              <div class="changeStatus d-flex flex-column align-items-start ml-2">
                <h5 class="status_title d-flex">სტატუსის რედაქტირება</h5>
                <div class="form-check mt-5">
            <input :checked="status === 'confirmed'" @click="status = 'confirmed'"
              class="form-check-input d-flex " type="radio" name="status">
            <label class="form-check-label">
              დადასტურება
            </label>
          </div>
          <div class="form-check mt-5">
            <input class="form-check-input" type="radio" @click="status = 'rejected'"
              :checked="status === 'rejected'" name="status">
            <label class="form-check-label">
              უარყოფა
            </label>
          </div>
              </div>
              
              <button type="button" @click="updatePetition();" data-bs-dismiss="modal" class="btn btn-primary addBtn1"
              style="background: rgba(240, 238, 238, 0.31); border: 0.767857px solid #D70E00;
                    border-radius: 20.7321px; color: #322E3D;margin-top: 6rem;">შენახვა</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
<style>
.dark .editor-background {
    background-color: white;
}

.dark .container-background {
    background-color: white;
}
.dark .ql-editor {
    color: black;
}
.addBtn1{
    width: 138px;
    height: 49px;
}
.changeStatus{
  width:360px;
  height: 150px;
  background-color: #322E3D;
  border: 1px solid #322E3D;
  border-radius: 15px;
}
.ql-editor{
  max-height:250px;
}
.status_title {
  position: absolute; /* set position relative to enable absolute positioning of the line */
  padding-bottom: 10px; /* add some padding to create space for the line */
  left: 8%;
}

.status_title::after {
  content: ''; /* create the line with a pseudo-element */
  position: absolute; /* position it absolutely within the container */
  left: 0;
  bottom: 0;
  width: 100%; /* make it span the entire width of the container */
  height: 1px; /* set the height to 1 pixel */
  background-color: #E0D9F1; /* set the color to #E0D9F1 */
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default defineComponent({
    components: { QuillEditor },
    props: {
        Height: {
            type: String
        }
    },
    data() {
        return {
            contents: '' as string,
            editorOptions: {
              placeholder: '',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'align': [] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'font': [] }],
                        ['clean'],
                    ],
                },
            },
            showEditor : false
        };
    },
    methods: {
        updateContents(value: string): void {
            if (value === "<p><br></p>") {
                this.contents = "";
            }
            this.$emit('update:content', this.contents);
        }
    }
});
</script>