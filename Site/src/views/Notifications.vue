<template>
  <hamburger @click="hamburgerActive = !hamburgerActive" />
  <headerBar />
  <!-- Begin, Notification Settings -->
  <div class="container-fluid d-flex flex-column min-vh-100 Bodybackground py-5">
    <div v-if="errorMessage" class="alert alert-danger w-50 align-self-center alert-dismissible fade show mt-3" role="alert">
          <i class="bi bi-info-circle-fill"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" @click="errorMessage = ''"
            aria-label="Close"></button>
        </div>
    <div class="container d-flex flex-wrap" style="width: 99%;">
      <div class="col-12 col-md-8 col-lg-6 mx-auto">
        <h2 class="headerText mb-5 text-center">შეტყობინებები</h2>
        <div class="row">
          <div class="col-12 col-md-6 mb-3 mb-md-0">
            <button id="read" :class="{ 'smallButtonHighlight': selectedSection == 'read' }" class="smallButton p-3 w-100"
              v-on:click="setReadValue(1); selectedSection = 'read'">წაკითხული</button>
          </div>
          <div class="col-12 col-md-6">
            <button :class=" { 'smallButtonHighlight': selectedSection == 'notread' } " class="smallButton p-3 w-100"
              v-on:click=" setReadValue(0); selectedSection = 'notread' ">წაუკითხავი</button>
          </div>
          <div class="col-12 my-3">
            <label for="time-dropdown" class="bi bi-clock headerText mb-3 d-block text-center"> დროის
              მიხედვით</label>
            <select id="time-dropdown" v-model=" selectedTime " class="smallButton p-3 w-100 text-center"
              @change=" setByTime(selectedTime) ">
              <option value="all_time">ყველა</option>
              <option value="last_week">ბოლო კვირა</option>
              <option value="last_month">ბოლო თვე</option>
              <option value="last_year">ბოლო წელი</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <!-- End, Notification Settings -->

    <!-- Begin, Notification Display -->
    <div class="mt-3 notificationDisplay container-fluid vh-100 rounded d-flex flex-column gap-2 p-5"
      style="width: 90%; overflow-y: scroll;">
      <div v-for="( meta ) in  notifications "
        v-on:click=" selectedNotificationMeta = meta; selectedNotification = meta.notification[0]; setRead(); "
        data-bs-toggle="modal" data-bs-target="#notificationModals" class="d-flex flex-column gap-2">
        <h3 class="headerText">{{ meta.notification[0].title }}</h3>
        <span style="color: #716E6E;">{{ formatDate(meta.notification[0].created) }}</span>
        <div class="table-border mt-3"></div>
      </div>
    </div>
    <!-- End, Notification Display -->

    <!-- Begin, Notification Modal -->
    <div class="modal fade" id="notificationModals" tabindex="-1" aria-labelledby="notificationModalsLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background-color: #322E3D;">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationModalsLabel" style="color:#D9D9D9">{{ selectedNotification?.title }}
            </h5>
            <button type="button" class="btn-close"
              v-on:click=" selectedNotification = null; selectedNotificationMeta = null " data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body" style="color: #B3B3B3;">
            <p v-html=" selectedNotification?.text "></p>
          </div>
        </div>
      </div>
    </div>
    <!-- End, Notification Modal -->
  </div>
</template>

<style src="@/assets/css/pages/notifications.css" scoped/>

<script lang="ts">
import hamburger from '@/components/hamburger.vue'
import headerBar from '@/components/headerBar.vue'
import { getApiConnectionString } from '@/assets/js/utils';
import axios from 'axios';
import { defineComponent } from 'vue'

import { User } from '@/interfaces/User';
import { Notification, NotificationMetaData } from '../interfaces/Notification'
import store from '@/store';
export default defineComponent({
  components: {
    hamburger,
    headerBar
  },
  data() {
    return {
      page: 1 as number,
      PageSize: 20 as number,

      hamburgerActive: false as boolean,
      selectedNotification: null as Notification | null,
      selectedNotificationMeta: null as NotificationMetaData | null,
      notifications: [] as NotificationMetaData[],

      read: 1 as number,
      time: 604800000 as number,

      selectedTime: 'all_time' as string,
      selectedSection: "read" as string,

      errorMessage : '' as string,

      userData: {} as User,
    }
  },
  created() {
    this.userData = store.getters.GetUser
  },

  mounted() {
    this.getNotifications();
    document.getElementById("read")?.focus()
  },

  methods: {
    setReadValue(value: number): void {
      this.read = value;

      this.getNotifications();
    },
    getNotifications() {
      this.errorMessage = "";

      const params = {
        read: this.read,
        time: this.time,
        page: this.page,
        pageSize: this.PageSize
      };
      axios.get(getApiConnectionString() + '/notification/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.notifications = results.data.notifications;
      }).catch((error) => {
        this.errorMessage = error.data.message;
      });
    },
    setByTime(timeSpan: string): void {
      switch (timeSpan) {
        case 'week':
          this.time = 604800000;
          break;

        case 'month':
          this.time = 2629743000;
          break;

        case 'year':
          this.time = 31556926000;
          break;
      }
      this.getNotifications();
    },
    setRead(): void {
      this.errorMessage = "";
      const body = {
        notificationid: this.selectedNotificationMeta?._id
      };
      axios.post(getApiConnectionString() + '/notification/setread', body, {
        withCredentials: true,
      }).then((results) => {
        this.getNotifications();
      }).catch((error) => {
        this.errorMessage = error.data.message;
      });
    },
    formatDate(timestamp: number) {
      var d = new Date(timestamp);
      const formattedDate = `${d.toLocaleTimeString("ka", { hour12: false })} ${d.toLocaleDateString()}`; // concatenate time and date string
      return formattedDate;
    },

    getUnreadAmount() {
      return this.notifications.filter(notification => !notification.read).length;
    }
  }
});
</script>