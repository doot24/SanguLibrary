<template>
  <hamburger @click="hamburgerActive = !hamburgerActive" />
  <headerBar />
  <div class="container-fluid min-vh-100 Bodybackground pt-5" >
    <div class="d-flex flex-column pt-5 flex-md-row justify-content-center align-items-center">
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
  </div>
</template>

<style scoped>
.dark
.sectionDark {
  background: #1C1A20;
}

.light
.sectionDark {
  background: #f0f0f0;
}

.dark
.sectionLight {
  background: #1A181E;
}

.light
.sectionLight {
  background: #f3f3f3;
}

</style>

<script lang="ts">
import hamburger from '@/components/hamburger.vue'
import headerBar from '@/components/headerBar.vue'

import { User } from '@/interfaces/User';

import { defineComponent } from 'vue'
import store from '@/store';

export default defineComponent({
  components: {
    hamburger,
    headerBar
  },
  data() {
    return {
      hamburgerActive: false as boolean,
      userData: {} as User
    }
  },
  created() {
    // Retrieve the user object from the Vuex store and assign it to the userData property
    this.userData = store.getters.GetUser
  }
});
</script>