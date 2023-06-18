<template>
  <loadingSpinner v-if="isLoading" />

  <div class="modal fade" id="sendNotificationModal" tabindex="-1" aria-labelledby="sendNotificationModalLabel"
    data-bs-backdrop="static" data-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="sendNotificationModalLabel">მასალის დაბრუნება</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="ClearInput"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="saveCipherInput" class="form-label">შენახვის შიფრი</label>
            <input v-model="saveCipher" type="text" class="form-control" id="saveCipherInput">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="ReturnResource">გაგზავნა</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import loadingSpinner from "@/components/loadingSpinner.vue";

import axios from 'axios';
import { getApiConnectionString } from '@/assets/js/utils';

export default defineComponent({
  name: 'ReturnModal',
  components: {
    loadingSpinner
  },
  emits: ["return-pressed"],
  props: {
    resource: Object
  },
  data() {
    return {
      saveCipher: "" as String,
      isLoading: false as boolean,
    }
  },
  methods: {
    ReturnResource(): void {
      const body = {
        cipher: this.saveCipher
      };
      this.isLoading = true;
      axios
        .post(
          getApiConnectionString() +
          "/admin/checkoutmanagement/return",
          body,
          {
            withCredentials: true,
          }
        )
        .then((results) => {
          this.isLoading = false;
          this.$emit("return-pressed", true, "რესურსი წარმატებით დაბრუნდა!");
        })
        .catch((error) => {
          this.isLoading = false;
          this.$emit("return-pressed", false, error.response.data.message);
        });
    },
    ClearInput(): void {
      this.saveCipher = "";
    }
  }
});
</script>
  
<style scoped>
/* Add your scoped styles here */
</style>
  