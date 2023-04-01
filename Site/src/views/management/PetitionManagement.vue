<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex min-vh-100 justify-content-center Bodybackground">
    <div id="tableContainer" class="mt-5 d-flex flex-column">
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="errorMessage = ''"
          aria-label="Close"></button>
      </div>

      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''"
          aria-label="Close"></button>
      </div>

      <div class="d-flex justify-content-center align-items-center mb-3">
        <search class="w-75" :options="options" @cleared="onInputCleared" @search="handleSearch" />
      </div>
      <div class="d-flex justify-content-end mb-2 mt-2">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal"> ახალი განცხადების სახე </button>
      </div>
      <div class="rounded table-responsive">
        <table class="table table-borderless table-default">
          <thead>
            <tr>
              <th scope="col" class="text-center" style="width: 10%">
                სტატუსი
              </th>
              <th scope="col" class="text-center text-nowrap" style="width: 15%">
                განცხადების ტიპი
              </th>
              <th scope="col" class="text-center" style="width: 20%">თარიღი</th>

              <th scope="col" class="text-center text-nowrap" style="width: 25%">
                განცხადების ტექსტი
              </th>
              <th scope="col" class="text-center text-nowrap" style="width: 30%">
                განცხადების ავტორი
              </th>
              <th scope="col" class="text-center text-nowrap" style="width: 35%">
                პირადი ნომერი
              </th>
              <th scope="col" class="text-center text-nowrap" style="width: 40%">
                მობილურის ნომერი
              </th>
              <th scope="col" class="text-center" style="width: 45%">მეილი</th>
              <th scope="col" class="text-center" style="width: 50%">
                ქმედებები
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="petition in petitions" :key="petition.petitionid" :class="{
              'table-border':
                petition.length > 0 &&
                petition[0].petitionid === petition.petitionid,
            }">
              <td class="p-5 pt-3">
                <div v-bind:class="petition.status" class="bi-circle-fill" style="font-size: 1.3em;"></div>
              </td>
              <td class="statementText text-center">
                <span>{{ petition.usedtemplate[0].title }}</span>
              </td>
              <td class="dateText text-center">
                <span>{{ formatDate(petition.timestamp) }}</span>
              </td>
              <td :id="petition._id" class="text-truncate text-center" @click="toggleTruncation(petition._id)"
                style="max-width: 300px; cursor: pointer;">{{ petition.text }}</td>
              <td class="text-center">
                <span>{{ petition.user[0].firstName + " " + petition.user[0].lastName }}</span>
              </td>
              <td class="text-center">
                <span>{{ petition.user[0].publicNumber }}</span>
              </td>
              <td class="text-center">
                <span>{{ petition.user[0].phoneNumber }}</span>
              </td>
              <td class="text-center">
                <span>{{ petition.user[0].email }}</span>
              </td>
              <td>
                <div class="d-flex justify-content-center align-content-center gap-2">
                  <button data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-light bi bi-pencil-square"
                    v-on:click="selectPetition(petition)"></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Begin, Pagination -->
      <div class="d-flex mt-3 flex-row align-content-center gap-3">
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

    <!-- Begin, Edit modal -->
    <div style="height:300px" class="modal fade h-100" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">განცხადების რედაქტირება</h5>
            <button type="button" @click="deselectPetition()" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 d-flex flex-column">
              <textarea v-model="comment" class="align-self-center" cols="45" rows="12" style="resize:none" />
              <h5 class="modal-title mt-2 mb-2" id="exampleModalLabel">სტატუსის რედაქტირება</h5>

              <div class="form-check">
                <input :checked="status === 'confirmed'" @click="status = 'confirmed'"
                  class="form-check-input" type="radio">
                <label class="form-check-label">
                  დადასტურება
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" @click="status = 'rejected'"
                  :checked="status === 'rejected'">
                <label class="form-check-label">
                  უარყოფა
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click=deselectPetition() class="btn btn-secondary"
              data-bs-dismiss="modal">დახურვა</button>
            <button type="button" @click="updatePetition();" data-bs-dismiss="modal" class="btn btn-primary">შენახვა</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End, Edit modal -->


    <!-- Begin, add template modal -->
    <div style="height:300px" class="modal fade h-100" id="addModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">განცხადების სახის დამატება</h5>
            <button type="button" @click="deselectPetition()" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 d-flex flex-column">
              <h5>სათაური</h5>
              <input v-model="templateTitle" type="text" class="form-control"/>
</div>
            <div class="mt-2 d-flex flex-column">
              <h5>ტექსტი</h5>
              <textarea v-model="templateText" class="align-self-center form-control" cols="45" rows="12" style="resize:none" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click=clearTemplateInputs() class="btn btn-secondary"
              data-bs-dismiss="modal">დახურვა</button>
            <button type="button" @click="addPetitionTempate();" class="btn btn-primary">შენახვა</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End, add template modal -->


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
import search from '@/components/search.vue'

import { getApiConnectionString } from '@/assets/js/utils'

import axios from 'axios'

export default {
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    search
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

      status: '',
      comment: '',

      templateTitle: '',
      templateText: '',

      options: [{ label: 'პირადი ნომერი', value: 'publicNumber' }, { label: 'მობილური ნომერი', value: 'phoneNumber' }],
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
    handleSearch(event) {
      this.searchInput = event.searchInput;
      this.selectedOption = event.selectedOption;
      this.searchFilthered();
    },
    onInputCleared(event) {
      this.searchInput = '';
      this.getRecentPetitions();
    },

    selectPetition(petition) {
      this.selectedPetition = petition;
      this.comment = petition.comment;
      this.status = petition.status;
    },

    deselectPetition() {
      this.selectedPetition = {};
      this.comment = '';
      this.status = '';
    },

    clearTemplateInputs() {
      this.templateTitle = '';
      this.templateText = '';
    },

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
        this.paginationData = results.data;
        this.isLoading = false;
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      });
    },
    addPetitionTempate() {
      this.isLoading = true;

      this.successMessage = '';
      this.errorMessage = '';

      axios.post(getApiConnectionString() + '/admin/petitionmanagement/addtemplate', {
        title: this.templateTitle,
        text: this.templateText
      }, {
        withCredentials: true,
      }).then((results) => {
        this.successMessage = 'განცხადების ნიმუში წარმატებით დაემატა!';
        this.isLoading = false;
        this.clearTemplateInputs();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
    },
    updatePetition() {
      this.isLoading = true;

      this.successMessage = '';
      this.errorMessage = '';

      axios.post(getApiConnectionString() + '/admin/petitionmanagement/update', {
        petitionid: this.selectedPetition._id,
        status: this.status,
        comment: this.comment
      }, {
        withCredentials: true,
      }).then((results) => {
        this.successMessage = 'განცხადება წარმატებით განახლდა!';
        this.isLoading = false;
        this.getRecentPetitions();
        this.deselectPetition();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
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
      if (!this.searchInput) {
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
    }
  }
}
</script>
