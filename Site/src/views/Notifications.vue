<template>
  <hamburger @click="hamburgerActive = !hamburgerActive" />
  <headerBar />
  <div class="container-fluid d-flex flex-column min-vh-100 bodyClass py-5">
  <div class="container d-flex flex-wrap justify-content-center" style="width: 99%;">
    <div class="col-12 col-md-8 col-lg-6">
      <h2 class="text-light mb-5 text-center"> შეტყობინებები </h2>
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 mb-3 mb-md-0">
          <button id="read" :class="{'smallButtonHighlight':selectedSection == 'read'}" class="smallButton p-3 w-100" v-on:click="getWithStatus(1); selectedSection='read'">წაკითხული</button>
        </div>
        <div class="col-12 col-md-6">
          <button :class="{'smallButtonHighlight':selectedSection == 'notread'}" class="smallButton p-3 w-100" v-on:click="getWithStatus(0); selectedSection='notread'">წაუკითხავი</button>
        </div>
        <div class="col-12 my-3">
          <label for="time-dropdown" class="bi bi-clock text-light mb-3 d-block text-center"> დროის მიხედვით</label>
          <select id="time-dropdown" class="d-flex smallButton p-3 w-100 text-center">
            <option value="all">ყველა</option>
            <option value="lastWeek">ბოლო კვირა</option>
            <option value="lastMonth">ბოლო თვე</option>
            <option value="lastYear">ბოლო წელი</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-3 container-fluid vh-100 rounded d-flex flex-column gap-2 p-5"
  style="background-color: #322E3D; width: 90%; overflow-y: scroll;">
  <div v-for="(meta) in notifications" :key="meta._id" v-on:click="this.selectedNotificationMeta = meta; this.selectedNotification = meta.notification[0]; setRead();"
  data-bs-toggle="modal" data-bs-target="#notificationModals" class="d-flex flex-column gap-2">
      <h3 class="text-light">{{ meta.notification[0].title }}</h3>
      <span style="color: #716E6E;">{{ formatDate(meta.notification[0].created) }}</span>
      <div class="table-border mt-3"></div>
    </div>
  </div>
  
  <div class="modal fade" id="notificationModals" tabindex="-1" aria-labelledby="notificationModalsLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" style="background-color: #322E3D;">
        <div class="modal-header">
          <h5 class="modal-title" id="notificationModalsLabel" style="color:#D9D9D9">{{ selectedNotification.title }}
          </h5>
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
</div>
</template>

<style scoped>
.bodyClass {
  background-color: rgba(26, 24, 30, 1)
}

.smallButton {
  background: #322E3D;
  font-weight: 600;
  font-size: 15px;
  line-height: 31px;
  border: none;
  color: #B3B3B3;
  border-radius: 40px;
}

.smallButtonHighlight {
  color: white;
  background: #d72926;
}
</style>

<script>
import hamburger from '@/components/hamburger.vue'
import headerBar from '@/components/headerBar.vue'
import { getApiConnectionString } from '@/assets/js/utils';
import axios from 'axios';

export default {
  components: {
    hamburger,
    headerBar
  },
  data() {
    return {
      page: 1,
      PageSize: 20,

      hamburgerActive: false,
      selectedNotification: {},
      selectedNotificationMeta: {},
      notifications: [],

      selectedSection : "read",

      userData: null
    }
  },
  created() {
    // Retrieve the user object from the Vuex store and assign it to the userData property
    this.userData = this.$store.getters.GetUser
  },

  mounted() {
    this.getWithStatus(1);
    document.getElementById("read").focus()
  },

  methods: {
    setRead() {
      const body = {
        notificationid: this.selectedNotificationMeta._id
      };
      axios.post(getApiConnectionString() + '/notification/setread', body, {
        withCredentials: true,
      }).then((results) => {
        if(this.selectedSection === "read")
        {
           this.getWithStatus(1);
        }
        else {
          this.getWithStatus(0);
        }
      }).catch((error) => {
      });
    },
    getWithStatus(status) {
      const params = {
        read: status,
        page: this.page,
        pageSize: this.PageSize
      };
      axios.get(getApiConnectionString() + '/notification/status', {
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
}
</script>