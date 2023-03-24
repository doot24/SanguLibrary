<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div
    class="container-fluid d-flex min-vh-100 justify-content-center Bodybackground"
  >
    <div id="tableContainer" class="mt-5 d-flex flex-column">
      <div
        v-if="SearchErrors"
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        <i class="bi bi-info-circle-fill"></i>
        {{ SearchErrors }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          @click="SearchErrors = ''"
          aria-label="Close"
        ></button>
      </div>

      <div
        v-if="successMessage"
        class="alert alert-success alert-dismissible fade show"
        role="alert"
      >
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          @click="successMessage = ''"
          aria-label="Close"
        ></button>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <div
          class="input-group d-flex align-items-center w-50 p-3 pt-2 pb-2 rounded-pill"
          style="background: #322e3d"
        >
          <div class="form-group">
            <div class="dropdown">
              <button
                class="bi-sliders btn text-light"
                type="button"
                id="categoryDropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                :aria-expanded="false"
                style="font-size: 1.5em"
              ></button>
              <div
                class="dropdown-menu text-dark"
                aria-labelledby="categoryDropdown"
              >
                <a
                  class="dropdown-item"
                  :class="{ active: selectedOption === 'publicNumber' }"
                  href="#"
                  @click="selectedOption = 'publicNumber'"
                  >პირადი ნომერი</a
                >
                <a
                  class="dropdown-item"
                  :class="{ active: selectedOption === 'phoneNumber' }"
                  href="#"
                  @click="selectedOption = 'phoneNumber'"
                  >მობილურის ნომერი</a
                >
              </div>
              <input type="hidden" v-model="selectedOption" id="category" />
            </div>
          </div>
          <input
            type="text"
            v-model="searchInput"
            class="form-control rounded-pill"
            v-on:keyup.enter="searchFilthered()"
            placeholder="ძებნა..."
          />
          <div class="input-group-append" style="margin-left: 10px">
            <button
              class="btn text-light bi bi-search"
              style="font-size: 1.2em"
              v-on:click="searchFilthered()"
              type="button"
            ></button>
          </div>
        </div>
      </div>
      <div class="rounded table-responsive">
        <table class="table table-borderless table-default">
          <thead>
            <tr>
              <th scope="col" class="text-center" style="width: 10%">
                სტატუსი
              </th>
              <th scope="col" class="text-center" style="width: 10%">
                განცხადების ტიპი
              </th>
              <th scope="col" class="text-center" style="width: 10%">თარიღი</th>
              <th scope="col" class="text-center" style="width: 10%">
                განცხადების კომენტარი
              </th>
              <th scope="col" class="text-center" style="width: 10%">
                განცხადების ტექსტი
              </th>
              <th scope="col" class="text-center" style="width: 10%">
                განცხადების ავტორი
              </th>
              <th scope="col" class="text-center" style="width: 10%">
                პირადი ნომერი
              </th>
              <th scope="col" class="text-center" style="width: 10%">
                მობილურის ნომერი
              </th>
              <th scope="col" class="text-center" style="width: 10%">მეილი</th>
              <th scope="col" class="text-center" style="width: 10%">
                ქმედებები
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="petition in petitions"
              :key="petition.petitionid"
              :class="{
                'table-border':
                  petition.length > 0 &&
                  petition[0].petitionid === petition.petitionid,
              }"
            >
            <td class="p-5">
                  <div v-bind:class="petition.status" class="bi-circle-fill" style="font-size: 1.3em;"></div>
                </td>
                <td class="statementText p-4 pt-5">
                  <span>{{ petition.usedtemplate[0].title }}</span>
                </td>
                <td class="p-4 pt-5 dateText">
                  <span>{{ formatDate(petition.timestamp) }}</span>
                </td>
                <td class="p-4 pt-5 ">
                  <span>{{ petition.comment }}</span>
                </td>
                <td :id="petition._id" class="text-truncate" @click="toggleTruncation(petition._id)"
                style="max-width: 300px; cursor: pointer;">{{ petition.text }}</td>
                <td class="p-4 pt-5 ">
                  <span>{{ petition.user[0].firstName + " " + petition.user[0].lastName}}</span>
                </td>
                <td class="p-4 pt-5 ">
                  <span>{{ petition.user[0].publicNumber }}</span>
                </td>
                <td class="p-4 pt-5 ">
                  <span>{{ petition.user[0].phoneNumber }}</span>
                </td>
                <td class="p-4 pt-5 ">
                  <span>{{ petition.user[0].email }}</span>
                </td>
            </tr>
          </tbody>
        </table>
        <div></div>
      </div>
      <!-- Begin, Pagination -->
      <div class="d-flex flex-row align-content-center gap-3">
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="pageSizeDropdown"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
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
            <li
              class="page-item"
              v-for="index in paginationData.totalPages"
              :key="index"
            >
              <a class="page-link" href="#" v-on:click="selectPage(index)">
                {{ index }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- End, Pagination -->
    </div>
  </div>
</template>

<style scoped>
#tableContainer {
  width: 94%;
}

table {
  color: white;
  background-color: rgba(35, 33, 40, 1);
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
        petitions: [],
        paginationData: {},

        selectedPetition: {},
        hamburgerVisible: true,
        
        confirmedDelete: false,
        isLoading: false,
        
        userData: null,
        
        SearchErrors: '',
        successMessage: '',
        errorMessage: '',

        searchInput: '',
        selectedOption: "publicNumber"
      }
    },
    mounted() {
    this.getRecentPetitions()
    },
    watch: {
      searchInput(newValue) {
        if (!newValue.trim()) {
          this.getRecentPetitions()
        }
      }
    },

    methods: {
      // CRUD
    getRecentPetitions() {
      const params = {
        page: this.page,
        pageSize: this.pageSize
      };

      this.isLoading = true;
      axios.get(getApiConnectionString() + '/admin/petitionmanagement/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.petitions = results.data.petitions;
        console.log(this.petitions);
        this.paginationData = results.data;
        this.isLoading = false;
      }).catch((error) => {
        this.AddErrorMessage = error.response.data.message;
        this.isLoading = false;
      });
    },
    setPageSize(size) {
      this.pageSize = size;
      this.getRecentPetitions();
    },
    selectPage(page) {
      this.page = page;
      this.getRecentPetitions();
    },
    searchFilthered() {
      if(!this.searchInput)
      {
        return;
      }
      switch (this.selectedOption) {
        case "publicNumber":
          this.searchByPublicNumber();
          break;
        case "phoneNumber":
          this.searchByPhoneNumber();
          break;
      }
    },
    searchByPublicNumber() {
      this.isLoading = true;

      const params = {
        publicNumber: this.searchInput,
        page: this.page,
        pageSize: this.pageSize
      };
      axios.get(getApiConnectionString() + '/admin/petitionmanagement/search', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.petitions = results.data.petitions;
        this.paginationData = results.data;
        this.showSearchResults = true;

        this.isLoading = false;

      }).catch((error) => {
        this.SearchErrors = error.response.data.message;

        this.isLoading = false;
      });
    },
    searchByPhoneNumber() {
      this.isLoading = true;

      const params = {
        phoneNumber: this.searchInput,
        page: this.page,
        pageSize: this.pageSize
      };
      axios.get(getApiConnectionString() + '/admin/petitionmanagement/search', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.petitions = results.data.petitions;
        this.paginationData = results.data;
        this.showSearchResults = true;

        this.isLoading = false;

      }).catch((error) => {
        this.SearchErrors = error.response.data.message;

        this.isLoading = false;
      });
    },
    setPageSize(size) {
      this.pageSize = size;
      if (this.searchInput) {
        this.searchPetition();
        return;
      }
      this.loadPetition();
    },
    selectPage(page) {
      this.page = page;
      if (this.searchInput) {
        this.searchPetition();
        return;
      }
      this.loadPetition();
    },

    formatDate(timestamp) {
      var d = new Date(timestamp);
      const formattedDate = d.toLocaleDateString().split(',')[0];
      return formattedDate;
    },
    toggleTruncation(_id) {
      const el = document.getElementById(_id);
      if (el.classList.contains('text-truncate')) {
        el.classList.remove('text-truncate');
      } else {
        el.classList.add('text-truncate');
      }
    },

  }
}
</script>
