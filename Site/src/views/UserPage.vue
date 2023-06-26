<template>
  <hamburger @click="hamburgerActive = !hamburgerActive" />
  <headerBar />
  <loadingSpinner v-if="isLoading" />

  <div class="d-flex flex-column container-fluid min-vh-100 Bodybackground pt-5">
    <div class="d-flex flex-column gap-2  pt-5 flex-md-row justify-content-center align-items-center">
      <img class="rounded-circle mb-5 mb-md-0 me-0 me-md-5 mt-md-0" width="190" height="190" v-bind:src="userData.photo">
      <div class="w-75 table-responsive">
        <table class="table table-dark">
          <tbody>
            <tr>
              <div class="p-2 d-flex justify-content-between sectionDark">
                <span scope="row">სახელი</span>
                <span class="text-muted">{{ userData.firstName }}</span>
              </div>
            </tr>
            <tr>
              <div class="p-2 d-flex justify-content-between sectionLight">
                <span scope="row">გვარი</span>
                <span class="text-muted">{{ userData.lastName }}</span>
              </div>
            </tr>
            <tr>
              <div class="p-2 d-flex justify-content-between text-wrap sectionDark">
                <span style="padding-right: 60px;" class="text-nowrap" scope="row">ელ-ფოსტა</span>
                <span class="text-muted">{{ userData.email }}</span>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="container checkouts shadow-sm rounded mt-5 gap-3">
      <h5 class="checkoutText">გატანილი მასალა</h5>
      <div class="d-flex overflow-auto gap-2">
        <div v-for="checkout in checkouts">
          <div class="card bg-light mb-3">
            <div class="card-body">
              <span class="card-title"><strong>{{ checkout.attachedResource[0].title }}</strong></span>
              <p class="card-text"> დაბრუნების ვადა {{ formatDate(checkout.returnDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped>
.dark .sectionDark {
  background: #1C1A20;
}

.dark .checkoutText {
  color: white;
}

.light .checkoutText {
  color: rgb(68, 68, 68);
}

.light .sectionDark {
  background: #f3f3f3;
}

.dark .sectionLight {
  background: #1A181E;
}

.light .sectionLight {
  background: #fafafa;
}

.dark .checkouts {
  background-color: #1C1A20;
}
.light .checkouts {
  background-color: #f8f8f8;
}
</style>

<script lang="ts">
import hamburger from '@/components/hamburger.vue'
import headerBar from '@/components/headerBar.vue'

import { User } from '@/interfaces/User';

import { defineComponent } from 'vue'
import store from '@/store';
import { getApiConnectionString } from '@/assets/js/utils'
import loadingSpinner from '@/components/loadingSpinner.vue'
import axios from 'axios'

export default defineComponent({
  components: {
    hamburger,
    headerBar,
    loadingSpinner
  },
  data() {
    return {
      hamburgerActive: false as boolean,
      userData: {} as User,
      isLoading: false as boolean,

      checkouts: {} as any
    }
  },
  mounted() {
    this.GetCheckouts()
  },
  methods: {
    formatDate(timestamp: number) {
      var d = new Date(timestamp);
      const formattedDate = d.toLocaleDateString().split(',')[0];
      return formattedDate;
    },
    GetCheckouts() {
      this.isLoading = true;
      axios.get(getApiConnectionString() + 'user/checkouts', {
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        this.checkouts = results.data.checkouts;
      }).catch(() => {
        this.isLoading = false;
      })

    }
  },
  created() {
    // Retrieve the user object from the Vuex store and assign it to the userData property
    this.userData = store.getters.GetUser
  }
});
</script>