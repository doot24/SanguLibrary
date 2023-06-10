<template>
  <!-- <div class="modal-body" style="border: none"> -->
    <QuillEditor
      class="editor-background"
      :style="{ height: `${Height}px`, border: 'none' }"
      :content-type="'html'"
      v-model:content="contents"
      @update:content="updateContents"
      theme="snow"
      :options="editorOptions"
      ref="editor"
      :placeholder="'დაწერეთ აქ...'"
    />
  <!-- </div> -->
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

</style>
<script lang="ts">
import { defineComponent } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineComponent({
  components: { QuillEditor },
  props: {
    Height: {
      type: Number,
      default: 200
    },
  },
  data() {
    return {
      contents: "" as string,
      editorOptions: {
        placeholder: "",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ align: [] }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ font: [] }],
            ["clean"],
          ],
        },
      }
    };
  },
  methods: {
    updateContents(value: string): void {
      if (value === "<p><br></p>") {
        this.contents = "";
      }
      this.$emit("update:content", this.contents);
    },
  },
});
</script>
