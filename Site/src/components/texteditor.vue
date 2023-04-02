<template>
  <div>
    <button
      @click="showEditor = true"
      class="btn btn-light bi bi-pencil-square"
    ></button>
    <div v-if="showEditor">
      <QuillEditor
        class="editor-background"
        :style="{ height: `${Height}px` }"
        :content-type="'html'"
        v-model:content="contents"
        @update:content="updateContents"
        theme="snow"
        :options="editorOptions"
        />
        <button type="button" class="btn btn-primary" @click="savePetition">
          Save changes
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-dismiss="modal"
          @click="showEditor = false"
        >
          დახურვა
        </button>

    </div>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  components: { QuillEditor },
  props: {
    Height: {
      type: String,
    },
  },
  data() {
    return {
      contents: "",
      editorOptions: {
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
      },
      showEditor: false,
    };
  },
  methods: {
    updateContents(value) {
      if (value === "<p><br></p>") {
        this.contents = "";
      }
      this.$emit("update:content", this.contents);
    },
  },
};
</script>
