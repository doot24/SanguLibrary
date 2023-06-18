<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex vh-100 justify-content-center Bodybackground">
    <div class="mt-5" style="width: 90%;">
      <div v-if="errorMessage" class="alert d-flex align-items-center gap-2 w-100 alert-danger" role="alert">
        <i class="p-1 bi bi-info-circle-fill"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close align-self-end" data-bs-dismiss="alert" @click="errorMessage = ''"
          style="margin-left: auto;" aria-label="Close"></button>
      </div>
      <div v-if="successMessage" class="alert d-flex alert-success gap-2 fade show w-100" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''" aria-label="Close"
          style="margin-left: auto;"></button>
      </div>
      <div class="d-flex gap-2 mb-4">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sendNotificationModal">
          მასალის დაბრუნება
        </button>
      </div>
      <!-- Begin, Holds -->
      <div class="d-flex gap-3">
        <div class="d-flex flex-column w-50 p-2 gap-2 text-light" style="background-color: rgba(61, 55, 71, 0.43);">
          <span class="align-self-center mt-2 mb-2">რეზერვი</span>
          <button class="btn btn-primary" @click="GetAllHolds"><i class="bi bi-arrow-clockwise"></i></button>
          <div v-for="hold in holds" style="background-color: #3B3748;" class="d-flex flex-column align-items-center">
            <div class="d-flex p-2 gap-2">
              <div class="d-flex flex-column">
                <div>გატანის მოთხოვნა</div>
                <div>{{ formatDate(hold.dateIssued) }}</div>
              </div>
              <button class="btn btn-primary" @click="selectedHold = hold" data-bs-toggle="modal"
                data-bs-target="#reservationModal"><i class="bi bi-eye"></i></button>
            </div>
            <CheckoutConfirmation :hold="hold" @checkout-pressed="OnCheckoutPressed" @close-pressed="onCheckoutClosed" />
          </div>
          <div v-if="holds.length === 0" class="alert alert-info fade show w-100" role="alert">
            <i class="bi bi-info-circle-fill"></i>
            რეზერვი ცარიელია!
          </div>
          <!-- Begin, Pagination -->
          <div v-if="paginationData.totalPages > 1" class="d-flex flex-row align-content-center gap-3">
            <nav v-if="paginationData.totalPages">
              <ul class="pagination pagination-sm gap-1">
                <li class="page-item" v-for="index in paginationData.totalPages" :key="index">
                  <a class="page-link" href="#" v-on:click="selectPageHolds(index)">
                    {{ index }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <!-- End, Pagination -->

        </div>
        <!-- End, Holds -->



        <!-- Begin, Checkouts -->
        <div class="d-flex flex-column w-50 p-2 gap-2 text-light" style="background-color: rgba(61, 55, 71, 0.43);">
          <span class="align-self-center mt-2 mb-2">გატანილი მასალა</span>
          <button class="btn btn-primary" @click="GetAllCheckouts"><i class="bi bi-arrow-clockwise"></i></button>
          <div v-for="checkout in checkouts" class="card mb-3" style="background-color: #3B3748;">
            <span v-if="ReturnLate(checkout)" class="badge badge-primary bg-danger">დაბრუნება დროა!</span>
            <div class="card-body">

              <h5 class="card-title">სათაური: {{ checkout.attachedResource[0].title }}</h5>
              <p class="card-text">შენახვის შიფრი: {{ checkout.attachedResource[0].saveCipher }}</p>
              <hr>
              <p class="card-text">გაცემის თარიღი: {{ formatDate(checkout.dateIssued) }}</p>
              <p class="card-text">დაბრუნების თარიღი: {{ formatDate(checkout.returnDate) }}</p>
            </div>
            <button class="btn btn-primary" data-bs-toggle="modal"
              data-bs-target="#viewCheckout"><i class="bi bi-eye"></i></button>
              <ViewCheckout :checkout="checkout"/>
          </div>

          <div v-if="checkouts.length === 0" class="alert alert-info fade show w-100" role="alert">
            <i class="bi bi-info-circle-fill"></i>
            გატანები ცარიელია!
          </div>
          <!-- Begin, Pagination -->
          <div v-if="paginationDataCheckouts.totalPages > 1" class="d-flex flex-row align-content-center gap-3">
            <nav v-if="paginationDataCheckouts.totalPages">
              <ul class="pagination pagination-sm gap-1">
                <li class="page-item" v-for="index in paginationDataCheckouts.totalPages" :key="index">
                  <a class="page-link" href="#" v-on:click="setPageSizeCheckouts(index)">
                    {{ index }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <!-- End, Pagination -->
        </div>
        <!-- End, Checkouts -->

      </div>
    </div>

  </div>
  <ReturnModal @return-pressed="OnReturnPressed" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

import hamburger from "@/components/hamburger.vue";
import loadingSpinner from "@/components/loadingSpinner.vue";
import headerBar from "@/components/headerBar.vue";
import texteditor from "@/components/texteditor.vue";

import { getApiConnectionString } from "@/assets/js/utils";
import ReturnModal from "@/components/checkoutmanagement/ReturnModal.vue";
import CheckoutConfirmation from "@/components/checkoutmanagement/CheckoutConfirmation.vue";
import ViewCheckout from "@/components/checkoutmanagement/ViewCheckout.vue";

import { PaginationData } from "@/interfaces/PaginationData";

export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    texteditor,
    ReturnModal,
    CheckoutConfirmation,
    ViewCheckout
  },
  data() {
    return {
      pageHolds: 1 as number,
      pageSizeHolds: 10 as number,

      pageCheckouts: 1 as number,
      pageSizeCheckouts: 10 as number,

      holds: [] as any[],
      checkouts: [] as any[],

      paginationData: {} as PaginationData,
      paginationDataCheckouts: {} as PaginationData,

      selectedHold: {} as any,
      selectedCheckout: {} as any,

      successMessage: "" as string,
      errorMessage: "" as string,

      isLoading: false as boolean,
    };
  },
  mounted() {
    this.GetAllHolds();
    this.GetAllCheckouts();
  },
  methods: {
    formatDate(timestamp: number) {
      var d = new Date(timestamp);
      const formattedDate = `${d.toLocaleTimeString("ka", {
        hour12: false,
      })} ${d.toLocaleDateString()}`;
      return formattedDate;
    },
    ReturnLate(resource : any)
    {
      return (Date.now() >= Number(resource.returnDate));
    },
    OnReturnPressed(success: boolean, message: string) {
      if (success) {
        this.successMessage = message;
      }
      else {
        this.errorMessage = message;
      }
      this.GetAllCheckouts();
    },
    setPageSizeHolds(size: number): void {
      this.pageSizeHolds = size;
      this.GetAllHolds();
    },
    selectPageHolds(page: number): void {
      this.pageHolds = page;
      this.GetAllHolds();
    },
    setPageSizeCheckouts(size: number): void {
      this.pageSizeCheckouts = size;
      this.GetAllHolds();
    },
    selectPageCheckouts(page: number): void {
      this.pageCheckouts = page;
      this.GetAllHolds();
    },
    GetAllHolds() {
      this.isLoading = true;
      this.errorMessage = "";

      const params = {
        page: this.pageHolds,
        pageSize: this.pageSizeHolds
      };
      axios.get(getApiConnectionString() + '/admin/checkoutmanagement/holds', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.holds = results.data.holds;
        this.paginationData = results.data.pagination;
        this.isLoading = false;

      }).catch((error) => {
        this.errorMessage = error.response.message;
        this.isLoading = false;
      });
    },
    GetAllCheckouts() {
      this.isLoading = true;
      this.errorMessage = "";

      const params = {
        page: this.pageCheckouts,
        pageSize: this.pageSizeCheckouts
      };
      axios.get(getApiConnectionString() + '/admin/checkoutmanagement/checkouts', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.checkouts = results.data.checkouts;
        this.paginationDataCheckouts = results.data.pagination;
        this.isLoading = false;

      }).catch((error) => {
        this.errorMessage = error.response.message;
        this.isLoading = false;
      });
    },
    OnCheckoutPressed(success: boolean, message: string) {
      if (success) {
        this.successMessage = message;
      }
      else {
        this.errorMessage = message;
      }
    },
    onCheckoutClosed() {
      this.GetAllHolds();
    }
  }
});
</script>
