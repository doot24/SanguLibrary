<template>
  <div class="d-flex" style="border:none;">
    <button @click="toggleEditor" class="rounded-circle btn messageButton bi-chat-left-text"></button>

    <div v-if="showEditor" class="position-absolute top-50 start-50 translate-middle editor-container">
      <button @click="toggleEditor" class="btn-close closeBtn position-absolute top-3 end-(-3)" aria-label="Close"></button>
      <QuillEditor ref="editor" v-model="editorContent" theme="snow" :options="editorOptions" style="border:none"/>

      <div class="editor-bottom position-absolute bottom-0 end-0">
        <button @click="saveContent" class="btn btn-primary position-absolute bottom-0 end-0 mb-3 me-3 saveButton" style="background-color: rgba(240, 238, 238, 0.31); border: 0.767857px solid #D70E00; border-radius: 20.7321px; color: black;">დამატება</button>
      </div>

      <div class="changeStatus d-flex justify-content-center position-absolute bottom-0 start-0 mb-3 ms-3">

          <h5 class="text-white">სტატუსის შეცვლა</h5>

      </div>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
export default {
  components: { QuillEditor },
  data() {
    return {
      showEditor: false,
      editorContent: '',
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
          ]
        }
      }
    }
  },
  methods: {
    toggleEditor() {
      this.showEditor = !this.showEditor;
    },
    saveContent() {
      console.log(this.editorContent);
      this.toggleEditor();
    }
  },
  beforeUnmount() {
    console.log(this.editorContent);
  }
}
</script>

<style>
.editor-container {
  width: 65vw;
  height: 500px;
  background-color: white;
  color: black;
  border-radius: 12.1857px;
  border: none;
  border-bottom: none;
  margin-top: 10%;
}
.closeBtn {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 1.1rem;
  color: #000;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}
.changeStatus {
  width: 330px;
  height: 120px;
  border: 1px solid black;
  background-color: #322E3D;
  border: 1px solid #322E3D;
  border-radius: 15px;
  color: #E0D9F1;
}
.ql-toolbar.ql-snow {
  border:none;
}
</style>