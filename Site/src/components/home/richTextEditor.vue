<template>
  <!-- Begin the editor body -->
  <div ref="editorWrapper">
    <button @click="showEditor = !showEditor" class="rounded-circle  messageButton bi-chat-left-text"></button>

    <div v-if="showEditor" class="editor-container">
      <div class="title1">დაწერეთ კომენტარი</div>
      <QuillEditor theme="snow" toolbar="#custom-toolbar">
        <template #toolbar>
          <div id="custom-toolbar">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
            <button class="ql-align" value="center"></button>
            <button class="ql-align" value="right"></button>
          </div>
        </template>
      </QuillEditor>
      <!-- Beggin the დამატება button -->
      <div class="editor-bottom">
        <button class="btn btn-primary mb-3" style="position: absolute; bottom: 10px; right: 10px;background: rgba(240, 238, 238, 0.31);
  border: 0.767857px solid #D70E00;
  border-radius: 20.7321px; color:black;">დამატება</button>
      </div>
      <!-- End button -->
      <div class="changeStatus d-flex justify-content-center">
        <fieldset>
        <h5>სტატუსის შეცვლა</h5>
      </fieldset>
        <fieldset>
        </fieldset>
      </div>
    </div>
  </div>
  <!-- End editor -->
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'


export default {
  components: { QuillEditor },
  data() {
    return {
      showEditor: false,
      editorOptions: {
        modules: {
          toolbar: {
            container: "#custom-toolbar",
            handlers: {
              align: this.handleAlign
            }
          }
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutsideEditor);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutsideEditor);
  },
  methods: {
    handleClickOutsideEditor(event) {
      if (this.showEditor && !this.$refs.editorWrapper.contains(event.target)) {
        this.showEditor = false;
      }
    },
    handleAlign(value){
      const quill = this.$refs.quillEditor.quill;
      const selection = quill.getSelection();
      if(selection){
        quill.format('align', value);
      }
    }
  }
}
</script>

<style>
.editor-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 500px;
  background-color: white;
  color: black;
  border-radius: 12.1857px;
  border: none;
}
.title1{
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
.changeStatus{
  width:330px; 
  height:120px; 
  border:1px solid black; 
  position: absolute; 
  bottom:10px; 
  left:10px;
  background-color: #322E3D;
  border: 1px solid #322E3D;
  border-radius: 15px;
  color:#E0D9F1;
}
fieldset {
  border: none;
  border-bottom: 2px solid #E0D9F1;
}

fieldset:last-of-type {
  border-bottom: none;
}
</style>
