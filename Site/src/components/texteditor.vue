<template>
    <div class="container-background">
    <QuillEditor class="editor-background" :style="{ height: `${Height}px` }" :content-type="'html'" v-model:content="contents" @update:content="updateContents" theme="snow"
        :options="editorOptions"  />
</div>

</template>
  
<style>
.dark .editor-background {
    background-color: white;
}

.dark .container-background {
    background-color: white;
}

</style>

<script>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    components: { QuillEditor },
    props : {
        Height: {
        type: String
      }
    },
    data() {
        return {
            contents: '',
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
        };
    }, 
    methods: {
        updateContents(value) {
            if (value === "<p><br></p>") {
                this.contents = "";
            }
            this.$emit('update:content', this.contents);
        }
    },
};
</script>
  