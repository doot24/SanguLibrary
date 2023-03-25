<template>
  <div class="d-none p-2 menu d-md-flex justify-content-end">
    <div class="position-relative">

      <!-- <calendar /> -->
      <button class="lightmodeToggle rounded menubutton" :class="buttonClass" @click="toggleButtonClass"
      style="font-size: 1.5em;"></button>
      <button class="colorToggle bi bi-bell rounded menubutton" style="font-size: 1.5em;" data-bs-toggle="dropdown"
      aria-expanded="false"></button>
      <span v-if="getUnreadAmount() != 0" class="position-absolute top-0 end-0 bi-circle-fill text-danger"
        style="font-size: 0.8em; line-height: 0.8em;"></span>
      <div  class="dropdown-menu dropdown-menu-end dropdown-lg" aria-labelledby="notificationDropdown"
        style="background-color: #322e3d">
        <div>
          <div style="width: 400px;" class="d-flex justify-content-between">
            <span class="text-light p-2">შეტყობინებები</span>
            <span class="text-light p-2">{{ getUnreadAmount() }} წაუკითხავი</span>
          </div>
          <div class="table-border mt-1 mb-1"></div>

          <li v-for="(meta) in notifications" :key="meta._id">
            <div class="dropdownItem dropdown-item d-flex flex-column" data-bs-toggle="modal"
              data-bs-target="#notificationModal"
              v-on:click="this.selectedNotificationMeta = meta; this.selectedNotification = meta.notification[0]; setRead()">
              <div class="d-flex justify-content-between">
                <span style="color: #B3B3B3;">{{ meta.notification[0].title }}</span>
                <span :class="{ 'text-danger': !meta.read, 'text-muted' : meta.read }" class="bi-circle-fill align-self-end"
                  style="font-size: 0.8em; line-height: 0.8em;"></span>
              </div>
              <span style="color:#716E6E">{{ formatDate(meta.notification[0].created) }}</span>
              <div class="table-border"></div>
            </div>
          </li>
        </div>
        <div style="width: 400px;" class="d-flex justify-content-center">
          <button class="justify-content-center text-light btn btn-primary bg-none p-2"
            style="background-color: transparent; border: none;" v-on:click="$router.push({ path: '/notifications' })">
            ყველას ნახვა</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" style="background-color: #322E3D;">
        <div class="modal-header">
          <h5 class="modal-title" id="notificationModalLabel" style="color:#D9D9D9">{{ selectedNotification.title }}</h5>
          <button type="button" class="btn-close"
            v-on:click="this.selectedNotification = {}; this.selectedNotificationMeta = {}" data-bs-dismiss="modal"
            aria-label="Close"></button>
        </div>
        <div class="modal-body" style="color: #B3B3B3;">
          <p>{{ selectedNotification.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.menu {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
}

.menubutton {
  background: none;
  border: none;
  color: whitesmoke;
}

.dropdownItem:hover {
  color: white;
  background-color: #3e394b;
  cursor: pointer;
}
</style>

<script>
import { defineComponent } from 'vue';
import { getApiConnectionString } from '@/assets/js/utils';
import axios from 'axios';
import Cookies from 'js-cookie';
import calendar from '@/components/home/calendar.vue'
export default defineComponent({
  name: 'headerBar',
  components: {
    calendar
  },
  data() {
    return {
      page: 1,
      PageSize: 5,
      selectedNotification: {},
      selectedNotificationMeta: {},

      notifications: [],

      selectedDate: null,
      read : 1,
      time: 604800000,

      buttonClass: "bi bi-cloud-sun",
      theme: 'dark'
    }
  },
  mounted() {
    this.getAllNotifications();

    const theme = Cookies.get('theme');

    if (theme) {
      this.theme = theme;
    }

    const bodyClassList = document.body.classList;

    if (this.theme === 'light') {
      bodyClassList.remove('dark');
      bodyClassList.add('light');
      document.documentElement.setAttribute('data-bs-theme', 'light')
    }
    else {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    }

    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.buttonClass = this.theme === 'light' ? 'bi bi-cloud-sun' : 'bi bi-brightness-high-fill';

  },
  methods: {
    setRead() {
      const body = {
        notificationid: this.selectedNotificationMeta._id
      };
      axios.post(getApiConnectionString() + '/notification/setread', body, {
        withCredentials: true,
      }).then((results) => {
          this.getAllNotifications();
      }).catch((error) => {
      });
    },

    toggleButtonClass() {
      Cookies.set('theme', this.theme, { expires: 31 });
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      this.buttonClass = this.buttonClass === 'bi bi-cloud-sun' ? 'bi bi-brightness-high-fill' : 'bi bi-cloud-sun';
      const bodyClassList = document.body.classList;
      if (this.theme === 'light') {
        bodyClassList.remove('light');
        bodyClassList.add('dark');
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      } else {
        bodyClassList.remove('dark');
        bodyClassList.add('light');
        document.documentElement.setAttribute('data-bs-theme', 'light')

      }
    },

    //CRUD
    getAllNotifications() {
      const params = {
        page: this.page,
        pageSize: this.PageSize
      };
      axios.get(getApiConnectionString() + '/notification/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.notifications = results.data.notifications;
      }).catch((error) => {
      });
    },

    formatDate(timestamp) {
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
