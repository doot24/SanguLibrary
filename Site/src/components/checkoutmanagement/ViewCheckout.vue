<template>
  <loadingSpinner v-if="isLoading" />

  <div class="modal fade  text-dark" id="viewCheckout" tabindex="-1" aria-labelledby="viewCheckoutLabel"
    data-bs-backdrop="static" data-keyboard="false" aria-hidden="true">
    <div class="modal-dialog  modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="reservationModalLabel">გატანის ნახვა</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="ClearInput"></button>
        </div>
        <div class="d-flex gap-2  p-3">
          <div class="modal-body  bg-light border">
            <div class="modal-header mb-2">
              <span class="modal-title" id="reservationModalLabel">სტუდენტი</span>
            </div>
            <div class="mb-3">
              <img width="140" height="190" :src="checkout.studentInfo[0].photo" />
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">სახელი</label>
              <input type="text" class="form-control" id="studentName" v-model="checkout.studentInfo[0].firstName" readonly>
            </div>
            <div class="mb-3">
              <label for="studentSurname" class="form-label">სახელი</label>
              <input type="text" class="form-control" id="studentSurname" v-model="checkout.studentInfo[0].lastName" readonly>
            </div>
            <div class="mb-3">
              <label for="publicNumber" class="form-label">პირადი ნომერი</label>
              <input type="text" class="form-control" id="publicNumber" v-model="checkout.studentInfo[0].publicNumber"
                readonly>
            </div>
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">ტელეფონის ნომერი</label>
              <input type="text" class="form-control" id="phoneNumber" v-model="checkout.studentInfo[0].phoneNumber" readonly>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">ელფოსტა</label>
              <input type="text" class="form-control" id="email" v-model="checkout.studentInfo[0].email" readonly>
            </div>
          </div>
          <div class="modal-body  bg-light border">
            <div class="modal-header mb-2">
              <span class="modal-title " id="reservationModalLabel">მოთხოვნილი რესურსი</span>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">სათაური</label>
              <input type="text" class="form-control" id="studentName" v-model="checkout.attachedResource[0].title" readonly>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">გამოცემის წელი</label>
              <input type="text" class="form-control" id="studentName" v-model="checkout.attachedResource[0].publicationYear"
                readonly>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">ნაშრომის სახეობა</label>
              <div type="text" class="form-control">{{ GetType(checkout.attachedResource[0].resourceType) }}</div>
            </div>
            <div class="mb-3">
              <label for="studentSurname" class="form-label">შენახვის შიფრი</label>
              <input type="text" class="form-control" id="studentSurname" v-model="checkout.attachedResource[0].saveCipher"
                readonly>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import loadingSpinner from "@/components/loadingSpinner.vue";

import { ResourceType } from '@/interfaces/Resources';
export default defineComponent({
  name: 'CheckoutConfirmation',
  components: {
    loadingSpinner
  },
  props: {
    checkout: Object
  },
  emits: ['checkout-pressed', 'close-pressed'],
  data() {
    return {
      isLoading: false as boolean,
      pressed : false as boolean
    }
  },
  methods: {
    convertToUnixTimestamp(dateString: string) {
      const date = new Date(dateString);
      const unixTimestampMs = date.getTime();

      return unixTimestampMs;
    },
    GetType(type: number): String {
      let value: string = "";
      switch (type) {
        case ResourceType.Book:
          value = "წიგნი";
          break;
        case ResourceType.Journal:
          value = "ჟურნალი";
          break;
        case ResourceType.Dissertation:
          value = "დისერტაცია";
          break;
        case ResourceType.Rider:
          value = "რიდერი";
          break;
      }
      return value;
    },
    ClearInput(): void {
      this.$emit('close-pressed');
      this.pressed = false;
    }
  }
});
</script>
  
<style scoped>/* Add your scoped styles here */</style>
  