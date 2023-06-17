<template>
  <loadingSpinner v-if="isLoading" />

  <div class="modal fade  text-dark" id="reservationModal" tabindex="-1" aria-labelledby="reservationModalLabel"
    data-bs-backdrop="static" data-keyboard="false" aria-hidden="true">
    <div class="modal-dialog  modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div v-if="errorMessage" class="d-flex flex-column align-items-center">
          <div class="alert d-flex align-items-center w-100 alert-danger" role="alert">
            <i class="p-1 bi bi-info-circle-fill"></i>
            {{ errorMessage }}
          </div>
          <div v-if="showSuccess" class="alert alert-success fade show w-100" role="alert">
            <i class="bi bi-info-circle-fill"></i>
            მოთხოვნა წარმატებით შესრულდა!
          </div>
        </div>
        <div class="modal-header">
          <h5 class="modal-title" id="reservationModalLabel">რეზერვის ნახვა</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="returnDate = ''"></button>
        </div>
        <div class="d-flex gap-2  p-3">
          <div class="modal-body  bg-light border">
            <div class="modal-header mb-2">
              <span class="modal-title" id="reservationModalLabel">სტუდენტი</span>
            </div>
            <div class="mb-3">
              <img width="140" height="190" :src="hold.studentInfo[0].photo" />
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">სახელი</label>
              <input type="text" class="form-control" id="studentName" v-model="hold.studentInfo[0].firstName" readonly>
            </div>
            <div class="mb-3">
              <label for="studentSurname" class="form-label">სახელი</label>
              <input type="text" class="form-control" id="studentSurname" v-model="hold.studentInfo[0].lastName" readonly>
            </div>
            <div class="mb-3">
              <label for="publicNumber" class="form-label">პირადი ნომერი</label>
              <input type="text" class="form-control" id="publicNumber" v-model="hold.studentInfo[0].publicNumber"
                readonly>
            </div>
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">ტელეფონის ნომერი</label>
              <input type="text" class="form-control" id="phoneNumber" v-model="hold.studentInfo[0].phoneNumber" readonly>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">ელფოსტა</label>
              <input type="text" class="form-control" id="email" v-model="hold.studentInfo[0].email" readonly>
            </div>
          </div>
          <div class="modal-body  bg-light border">
            <div class="modal-header mb-2">
              <span class="modal-title " id="reservationModalLabel">მოთხოვნილი რესურსი</span>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">სათაური</label>
              <input type="text" class="form-control" id="studentName" v-model="hold.attachedResource[0].title" readonly>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">გამოცემის წელი</label>
              <input type="text" class="form-control" id="studentName" v-model="hold.attachedResource[0].publicationYear"
                readonly>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">ნაშრომის სახეობა</label>
              <div type="text" class="form-control">{{ GetType(hold.resource) }}</div>
            </div>
            <div class="mb-3">
              <label for="studentSurname" class="form-label">შენახვის შიფრი</label>
              <input type="text" class="form-control" id="studentSurname" v-model="hold.attachedResource[0].saveCipher"
                readonly>
            </div>
          </div>
          <div class="modal-body  bg-light border">
            <div class="modal-header mb-2">
              <span class="modal-title " id="reservationModalLabel">მოთხოვნის პარამეტრები</span>
            </div>
            <div class="mb-3">
              <label for="studentName" class="form-label">გატანის ვადა</label>
              <input type="date" class="form-control" id="studentName" v-model="returnDate">
            </div>
          </div>
        </div>

        <div class="modal-footer justify-content-center flex-column">
          <button v-bind:disabled="!returnDate" type="button" class="btn btn-secondary  w-25"
            @click="SetCheckout('confirmed', hold); returnDate = ''">გატანის დადასტურება</button>
          <button v-bind:disabled="!returnDate" type="button" class="btn btn-danger  w-25"
            @click="SetCheckout('rejected',hold);">გატანის უარყოფა</button>
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
import { ResourceType } from '@/interfaces/Resources';
export default defineComponent({
  name: 'CheckoutConfirmation',
  components: {
    loadingSpinner
  },
  props: {
    hold: Object
  },
  data() {
    return {
      saveCipher: "" as String,
      isLoading: false as boolean,
      returnDate: "" as String,

      showSuccess: false as boolean,
      errorMessage: "" as string,
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
    SetCheckout(status: String, hold: any): void {
      this.showSuccess = false;
      this.errorMessage = "";

      let time = this.convertToUnixTimestamp(String(this.returnDate));
      const body = {
        holdid: hold._id,
        resource_type: hold.resource,
        status: status,
        returnDate: time,
      };
      this.isLoading = true;
      axios
        .post(
          getApiConnectionString() +
          "/admin/checkoutmanagement/setcheckout",
          body,
          {
            withCredentials: true,
          }
        )
        .then((results) => {
          this.isLoading = false;
          this.showSuccess = true;
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          this.isLoading = false;
        });
    },
    ClearInput(): void {
      this.saveCipher = "";
      this.showSuccess = false;
      this.errorMessage = "";
    }
  }
});
</script>
  
<style scoped>/* Add your scoped styles here */</style>
  