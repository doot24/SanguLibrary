
<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />
  <div class="container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center Bodybackground">
    <div v-if="errorMessage" class="alert w-75 alert-danger" role="alert">
      <i class="p-1 bi bi-info-circle-fill"></i>
      {{ errorMessage }}
    </div>
    <div v-if="showSuccess" class="alert w-75 alert-success" role="alert">
      <i class="p-1 bi bi-info-circle-fill"></i>
      მოთხოვნა წარმატებით შესრულდა!
    </div>
    <search :options="options" @cleared="onInputCleared" @search="handleSearch" class="w-50" />
    <div class="d-flex  mt-3 mb-3 gap-3 justify-content-end" style="width: 90%;">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBookModal">
        წიგნის დამატება
      </button>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addJournalModal">
        ჟურნალის დამატება
      </button>
    </div>
    <div class="w-100 rounded d-flex align-items-center flex-column gap-5">
      <div class="p-3" style="width:90%;height:600px; overflow-y: scroll; background-color: #646074;">
        <div v-if="resources.length === 0" class="alert alert-danger" role="alert">
          <i class="p-1 bi bi-info-circle-fill"></i>
          რესურსები ვერ მოიძებნა!
        </div>
        <div v-for="resource in resources">
          <div class="d-flex py-2"  v-if="resource.resourceType === resourceType.Book">
            <book v-bind:resource="resource"/>
            <div style="height: fit-content">
              <div class="d-flex gap-2 flex-column text-light">
                <button @click="selectedResource = resource" data-bs-toggle="modal" data-bs-target="#updateBookModal" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-pencil-square"></button>
                <button @click="DeleteResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-trash3"></button>
                <button v-if="resource.digital" @click="DownloadResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-download"></button>
                <button @click="DuplicateResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-clipboard2"></button>
              </div>
            </div>
          </div>

          <div class="d-flex py-2" v-if="resource.resourceType === resourceType.Journal">
            <journal v-bind:resource="resource"/>
            <div style="height: fit-content">
              <div class="d-flex gap-2 flex-column text-light">
                <button @click="selectedResource = resource" data-bs-toggle="modal" data-bs-target="#updateJournalModal" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-pencil-square"></button>
                <button @click="DeleteResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-trash3"></button>
                <button v-if="resource.digital" @click="DownloadResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-download"></button>
                <button @click="DuplicateResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-clipboard2"></button>
              </div>
            </div>
          </div>

          <div v-if="resource.resourceType === resourceType.Dissertation" class="d-flex py-2">
            <dissertation  v-bind:resource="resource"/>
            <div style="height: fit-content">
              <div class="d-flex gap-2 flex-column text-light">
                <button @click="selectedResource = resource" data-bs-toggle="modal" data-bs-target="#updateBookModal" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-pencil-square"></button>
                <button @click="DeleteResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-trash3"></button>
                <button v-if="resource.digital" @click="DownloadResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-download"></button>
                <button @click="DuplicateResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-clipboard2"></button>
              </div>
            </div>
          </div>

          <div v-if="resource.resourceType === resourceType.Rider" class="d-flex py-2">
            <rider v-bind:resource="resource"/>
            <div style="height: fit-content">
              <div class="d-flex gap-2 flex-column text-light">
                <button @click="selectedResource = resource" data-bs-toggle="modal" data-bs-target="#updateBookModal" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-pencil-square"></button>
                <button @click="DeleteResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-trash3"></button>
                <button v-if="resource.digital" @click="DownloadResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-download"></button>
                <button @click="DuplicateResource(resource)" style="font-size:1.4em; background-color: transparent; border: none;"
                  class="text-light bi-clipboard2"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Begin, Pagination -->
    <div class="d-flex mt-3 flex-row align-content-start gap-3" style="width: 90%;">
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
    <bookadd @add_pressed="AddResource"></bookadd>
    <bookupdate @add_pressed="UpdateResource" :resource="selectedResource"></bookupdate>

    <journaladd @add_pressed="AddResource"/>
    <journalupdate @add_pressed="UpdateResource" :resource="selectedResource"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getApiConnectionString } from '@/assets/js/utils'
import axios from 'axios'

import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import search from '@/components/search.vue'
import book from '@/components/resources/book.vue'
import journal from '@/components/resources/journal.vue'
import dissertation from '@/components/resources/dissertation.vue'
import rider from '@/components/resources/rider.vue'

import { PaginationData } from "@/interfaces/PaginationData";
import { SearchOptions } from '@/interfaces/SearchOptions';
import { Resource, ResourceType } from '@/interfaces/Resource';

import bookadd from '@/components/resourcemanagement/bookadd.vue'
import bookupdate from '@/components/resourcemanagement/bookupdate.vue'

import journaladd from '@/components/resourcemanagement/journaladd.vue'
import journalupdate from '@/components/resourcemanagement/journalupdate.vue'

export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    search,
    book,
    journal,
    dissertation,
    rider,
    bookadd,
    bookupdate,

    journaladd,
    journalupdate
  },
  data() {
    return {
      page: 1 as Number,
      pageSize: 10 as Number,
      isLoading: false as boolean,
      paginationData: {} as PaginationData,
      resources: [] as Array<Resource>,

      options: [{ Label: 'თავისუფალი', Value: 'free' }, { Label: 'შენახვის შიფრი', Value: 'saveCipher' }] as SearchOptions[],
      selectedOption: 'free' as string,

      errorMessage: "" as String,
      showSuccess: false as Boolean,

      resourceType : ResourceType,
      selectedResource: {},
    }
  },
  mounted() {
    this.GetAllResources();
  },
  methods: {
    handleSearch(event: any) {
      this.selectedOption = event.selectedOption;

      if (this.selectedOption === "free") {
        this.SearchResource(event);
        return;
      }
      //todo: search cipher
    },
    onInputCleared(event: any): void {
      this.resources = [];
      this.GetAllResources();
    },
    setPageSize(size: number): void {
      this.pageSize = size;
      this.GetAllResources();
    },
    selectPage(page: number): void {
      this.page = page;
      this.GetAllResources();
    },

    //crud
    SearchResource(event: any) {
      this.isLoading = true;
      this.errorMessage = "";

      let query: String = event.searchInput;
      if (query) {
        this.isLoading = true;

        const params = {
          text: query,
          page: this.page,
          pageSize: this.pageSize
        };
        axios.get(getApiConnectionString() + 'search/resource', {
          params,
          withCredentials: true,
        }).then((results) => {
          this.resources = results.data.searchResults;
          this.paginationData = results.data.pagination;
          this.isLoading = false;
          this.showSuccess = true;
        }).catch((error) => {
          this.errorMessage = error.data.message;
          this.isLoading = false;
        });
      }
    },

    AddResource(resource: any) {
      console.log(resource)
      this.isLoading = true;
      const formData = new FormData();
      console.log(resource.resourceType)
      this.errorMessage = "";

      if(resource.cover)
      {
        formData.append('cover', resource.cover);
      }
      if(resource.file)
      {
        formData.append('file', resource.file);
      }
      formData.append('type', resource.resourceType);
      formData.append('resource', JSON.stringify(resource));

      axios.post(getApiConnectionString() + '/admin/resourcemanagement/add', formData, {
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
          this.showSuccess = true;
        this.GetAllResources();
      }).catch((error) => {
        this.errorMessage = error.data.message;
        this.isLoading = false;
      });
    },

    DuplicateResource(resource: any) {
      this.isLoading = true;
      this.errorMessage = "";

      let body = {
        resource: resource,
        type: 0,
        _id: resource._id
      };

      body.resource = JSON.stringify(resource);
      axios.post(getApiConnectionString() + '/admin/resourcemanagement/duplicate', body, {
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        this.showSuccess = true;
        this.GetAllResources();
      }).catch((error) => {
        this.errorMessage = error.data.message;
        this.isLoading = false;
      });
    },

    DownloadResource(resource: any) {
      this.isLoading = true;
      console.log(resource)
      this.errorMessage = "";

      let body = {
        type: resource.resourceType,
        _id: resource._id
      };

      axios.post(getApiConnectionString() + '/admin/resourcemanagement/download', body, {
        withCredentials: true,
      }).then((results) => {
          this.showSuccess = true;
        this.isLoading = false;
        window.open(results.data.url, '_blank');
      }).catch((error) => {
        this.errorMessage = error.data.message;
        this.isLoading = false;
      });
    },

    DeleteResource(resource: any) {
      this.isLoading = true;
      console.log(resource)
      this.errorMessage = "";

      let body = {
        _id: resource._id,
        type: resource.resourceType
      };
      console.log(resource._id)
      axios.post(getApiConnectionString() + '/admin/resourcemanagement/delete', body, { headers :  { 'content-type': 'application/x-www-form-urlencoded' },
        withCredentials: true,
      }).then((results) => {
          this.showSuccess = true;
        this.isLoading = false;
        this.GetAllResources();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      });
    },

    UpdateResource(resource: any) {
      this.isLoading = true;
      this.errorMessage = "";

      let body = {
        _id: resource._id,
        type: resource.resourceType,
        resource : ""
      };
      body.resource = JSON.stringify(resource);
      axios.post(getApiConnectionString() + '/admin/resourcemanagement/update', body, {
        withCredentials: true,
      }).then((results) => {
          this.showSuccess = true;
        this.isLoading = false;
        this.GetAllResources();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      });
    },

    GetAllResources() {
      this.isLoading = true;
      this.errorMessage = "";

      const params = {
        page: this.page,
        pageSize: this.pageSize
      };
      axios.get(getApiConnectionString() + '/admin/resourcemanagement/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.resources = results.data.documents;
        this.paginationData = results.data.pagination;
        this.isLoading = false;

      }).catch((error) => {
        console.log(error)
        this.errorMessage = error.data.message;
        this.isLoading = false;
      });
    },
  }
});
</script>
