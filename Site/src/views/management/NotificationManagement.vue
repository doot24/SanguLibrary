<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex min-vh-100 justify-content-center Bodybackground">
    <div id="tableContainer" class="mt-5 d-flex flex-column">
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''"
          aria-label="Close"></button>
      </div>

      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="errorMessage = ''"
          aria-label="Close"></button>
      </div>
      <div class="align-self-end mt-2 mb-4">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sendNotificationModal">ახალი
          შეტყობინება</button>
      </div>
      <div class="rounded table-responsive mt-1 ">
        <table class="table table-borderless table-default">
          <thead>
            <tr>
              <th scope="col" class="text-center" style="width: 10%;">სათაური</th>
              <th scope="col" class="text-center" style="width: 10%;">ტექსტი</th>
              <th scope="col" class="text-center" style="width: 10%;">ავტორი</th>
              <th scope="col" class="text-center" style="width: 10%;">თარიღი</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(meta) in notifications" :key="meta._id">
              <td>{{ meta.title }}</td>
              <td :id="meta._id" class="text-truncate" @click="toggleTruncation(meta._id)"
                style="max-width: 300px; cursor: pointer;">{{ meta.text }}</td>
              <td class="text-center">{{ meta.author }}</td>
              <td class="text-center">{{ formatDate(meta.created) }}</td>
            </tr>
          </tbody>
        </table>
        <div>
        </div>
      </div>

      <!-- Begin, Pagination -->
      <div class="d-flex  flex-row align-content-center gap-3">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="pageSizeDropdown" data-bs-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            {{ pageSize }}
          </button>
          <div class="dropdown-menu" aria-labelledby="pageSizeDropdown">
            <a class="dropdown-item" href="#" @click="setPageSize(5)">5</a>
            <a class="dropdown-item" href="#" @click="setPageSize(10)">10</a>
            <a class="dropdown-item" href="#" @click="setPageSize(25)">25</a>
            <a class="dropdown-item" href="#" @click="setPageSize(75)">75</a>
            <a class="dropdown-item" href="#" @click="setPageSize(100)">100</a>
          </div>
        </div>

        <nav v-if="paginationData.totalPages">
          <ul class="pagination pagination-sm gap-1">
            <li class="page-item" v-for="index in paginationData.totalPages" :key="index">
              <a class="page-link" href="#" v-on:click="selectPage(index)">
                {{ index }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- End, Pagination -->


    </div>
    <!-- Begin, Send notification -->
    <div class="modal fade" id="sendNotificationModal" tabindex="-1" aria-labelledby="sendNotificationModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title" id="sendNotificationModalLabel">შეტყობინების დამატება</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-dark text-light">
            <div class="was-validated">
              <div class="form-group">
                <label class="form-label" for="title">სათაური</label>
                <input type="text" v-model="title" class="form-control" id="title" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="text">ტექსტი</label>
                <textarea type="text" rows="10" v-model="text" class="form-control" id="text" required></textarea>
              </div>

              <div class="mt-3 d-flex flex-column gap-2 justify-content-center align-items-center">
                <button :disabled="!canSubmit()" class="w-50 btn btn-primary mr-1" v-on:click="addNotification();">
                  დამატება
                </button>
                <button :disabled="isLoading" v-on:click="clearInputs(); getRecentNotifications();"
                  class="w-50 btn btn-primary ml-1" data-bs-dismiss="modal">უკან</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End, Send notification -->
  </div>
</template>

<style scoped>
#tableContainer {
  width: 94%;
}

.bodyClass {
  background: #1A181E;
}

table {
  color: white;
  background-color: rgba(35, 33, 40, 1);
}

.truncate {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

}
</style>
<script>
import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import { getApiConnectionString } from '@/assets/js/utils'

import axios from 'axios'

export default {
  components: {
    hamburger,
    loadingSpinner,
    headerBar
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      notifications: [],
      paginationData: {},

      successMessage: "",
      errorMessage: "",

      title: "",
      text: "",

      selectedBook: {},

      isLoading: false,

      categories: [],
    }
  },
  mounted() {
    this.getRecentNotifications()
  },
  methods: {
    toggleTruncation(id) {
      const el = document.getElementById(id);
      if (el.classList.contains('text-truncate')) {
        el.classList.remove('text-truncate');
      } else {
        el.classList.add('text-truncate');
      }
    },
    clearInputs() {
      this.title = "";
      this.text = "";
    },
    setPageSize(size) {
      this.pageSize = size;
      this.getRecentNotifications();
    },
    selectPage(page) {
      this.page = page;
      this.getRecentNotifications();
    },

    canSubmit() {
      return (!this.title || !this.text) === false;
    },

    // CRUD
    getRecentNotifications() {
      const params = {
        page: this.page,
        pageSize: this.pageSize
      };
      this.isLoading = true;
      axios.get(getApiConnectionString() + '/admin/notificationmanagement/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.notifications = results.data.notifications;
        this.paginationData = results.data;
        this.isLoading = false;
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      });
    },

    formatDate(timestamp) {
      var d = new Date(timestamp);
      const formattedDate = `${d.toLocaleTimeString("ka", { hour12: false })} ${d.toLocaleDateString()}`; // concatenate time and date string
      return formattedDate;
    },


    addNotification() {
      const body = {
        title: this.title,
        text: this.text
      };
      this.isLoading = true;
      axios.post(getApiConnectionString() + '/admin/notificationmanagement/createglobal', body, {
        withCredentials: true,
      }).then((results) => {
        this.notifications = results.data.notifications;
        this.paginationData = results.data;
        this.successMessage = "შეტყობინება წარმატებით გაიგზავნა!";
        this.isLoading = false;
        this.getRecentNotifications();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      });
    }
  }
}
</script>