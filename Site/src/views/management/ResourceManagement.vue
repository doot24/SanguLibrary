
<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />
  <div class="container-fluid d-flex flex-column min-vh-100 justify-content-center align-items-center Bodybackground">
    <search :options="options" @cleared="onInputCleared" @search="handleSearch"  class="w-50"/>
    <div class="w-75 mt-5 p-3 rounded d-flex flex-column gap-5" style="width:90%;height:600px; overflow-y: scroll; background-color: #646074;">
      <div v-if="resources.length === 0" class="alert alert-danger" role="alert">
        <i class="p-1 bi bi-info-circle-fill"></i>
        რესურსები ვერ მოიძებნა!
      </div>
      <div v-for="resource in resources">
        <book v-if="resource.resourceType === 0" v-bind:resource="resource" />
        <journal v-if="resource.resourceType === 1" v-bind:resource="resource" />
        <dissertation v-if="resource.resourceType === 2" v-bind:resource="resource" />
        <rider v-if="resource.resourceType === 3" v-bind:resource="resource" />
      </div>
    </div>
     <!-- Begin, Pagination -->
     <div v-if="paginationData.totalPages > 1" class="d-flex flex-row align-content-center gap-3">
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
import {Resource} from '@/interfaces/Resource';
export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    search,
    book,
    journal,
    dissertation,
    rider
  },
  data() {
    return {
      page: 1 as Number,
      pageSize: 10 as Number,
      isLoading: false as boolean,
      paginationData: {} as PaginationData,
      resources : [] as Array<Resource>,
      
      options: [{ Label: 'თავისუფალი', Value: 'free' }, { Label: 'შენახვის შიფრი', Value: 'saveCipher' }] as SearchOptions[],
      selectedOption: 'free' as string
    }
  },
  methods: {
    Copy (resource : any) {
      
    },
    handleSearch(event: any) {
      this.selectedOption = event.selectedOption;
      
      if(this.selectedOption === "free")
      {
        this.SearchResource(event);
        return;
      }
      //todo: search cipher
    },
    onInputCleared(event: any): void {
      this.resources = [];
    },
    setPageSize(size: number): void {
      this.pageSize = size;
    },
    selectPage(page: number): void {
      this.page = page;
    },

    //crud
    SearchResource(event: any) {
      let query : String = event.searchInput;
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

        }).catch((error) => {
          this.isLoading = false;
        });
      }
    },
  }
});
</script>
