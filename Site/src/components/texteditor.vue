<template>
    <div>
      <button @click="showEditor = true" class="btn btn-light bi bi-pencil-square"></button>
  
      <div class="modal" tabindex="-1" role="dialog" style="display: block;" v-show="showEditor">
        <div class="modal-dialog" role="document" style="max-width: 60%;">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" style="color:black;">დაწერეთ კომენტარი</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showEditor = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <QuillEditor class="editor-background" :style="{ height: `${Height}px` }" :content-type="'html'" v-model:content="contents" @update:content="updateContents" theme="snow"
                :options="editorOptions" />
            </div>
            <div class="modal-footer">
              <button type="button" @click="updatePetition();" data-bs-dismiss="modal" class="btn btn-primary addBtn1"
              style="background: rgba(240, 238, 238, 0.31); border: 0.767857px solid #D70E00;
                    border-radius: 20.7321px; color: #322E3D;">შენახვა</button>
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
    },
});
</script>