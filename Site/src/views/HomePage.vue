<template>
  <hamburger v-if="hamburgerVisible" />
  <loadingSpinner v-if="isLoading" />

  <headerBar />

  <div class="container-fluid min-vh-100 Bodybackground">
    <div class="d-flex container-fluid flex-column">
      <!--Title section-->
      <titleBar />
      <search class="w-75 align-self-center" @cleared="onInputCleared" @search="handleSearch" />
      <!--Begin, Search Results-->
      <div v-if="showSearchResults" class="mt-4 booksSection container-fluid  p-3 rounded d-flex flex-column">
        <div v-if="showSuccess" class="alert alert-success alert-dismissible fade show w-100" role="alert">
      <i class="bi bi-info-circle-fill"></i>
      გატანის მოთხოვნა მიღებულია, პასუხს მიიღებთ შეტყობინების სახით.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show w-100" role="alert">
      <i class="bi bi-info-circle-fill"></i>
      {{ errorMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
        <div>
          <div v-for="(book) in books" class="d-flex align-self-center flex-column gap-2">
            <div class="d-flex flex-row gap-2 mt-3">
              <div class="d-flex flex-column gap-2">
                <span class="badge badge-pill bg-danger badge-primary" v-if="book.hold">დაჯავშინლია</span>
                <span class="badge badge-pill bg-danger badge-primary" v-if="book.checkout">გატანილია</span>
                <img width="130" height="180" src="@/assets/images/resource.png" />
              </div>
              <div class="d-flex flex-column gap-2">
                <span class="text-light"> {{ book.title }} </span>
                <span class="text-light" v-if="book.author"> {{ "ავტორი:" + " " + book.author }} </span>
                <span class="text-light" v-if="book.authors"> {{ "ავტორი:" + " " + book.authors.join(", ") }} </span>
                <span class="text-light" v-if="book.editors"> {{ "რედაქტორი:" + " " + book.editors.join(", ") }} </span>
                <span class="text-light"> {{ "გამოცემის წელი:" + " " + book.publicationYear }} </span>
              </div>
            </div>
            <div class="d-flex flex-column gap-2" style="width:130px">
              <button :disabled="book.hold || book.checkout" class="btn btn-primary" v-on:click="checkoutResource(book)">გატანის მოთხოვნა</button>
            </div>
          </div>
          <div v-if="books.length <= 0" class="alert alert-danger" role="alert">
            მოცემული რესურსი არ არსებობს!
          </div>
          <!-- Begin, Pagination -->
          <div v-if="paginationData.totalPages > 1" class="d-flex mt-5 flex-row align-content-center gap-3">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" id="pageSizeDropdown"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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

      </div>
      <!--End, Search Results-->

      <!--Begin, Books-->
      <div v-if="!showSearchResults" class="booksSection shadow-sm p-3 mt-4 rounded d-flex flex-column"
        style="height:800px; overflow-y: scroll;">
        <carousel  v-for="(section, index) in sections" :title="section.title" :section="section.data" :class="{'mt-4': index !== 0}"/>
      </div>
      <!--End, Section-->
    </div>
    <footerBar />
  </div>
</template>

<style src="@/assets/css/pages/homepage.css" scoped/>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import titleBar from '@/components/home/titleBar.vue'
import footerBar from '@/components/home/footerBar.vue'
import carousel from '@/components/home/carousel.vue'
import search from '@/components/search.vue'

import { getApiConnectionString } from '@/assets/js/utils'
import { PaginationData } from '@/interfaces/PaginationData'

import {Section} from "@/interfaces/Section"

export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    titleBar,
    footerBar,
    carousel,
    search
  },
  data() {
    return {
      page: 1 as number,
      pageSize: 10 as number,

      searchInput: '' as string,
      errorMessage: '' as string,

      isLoading: false as boolean,
      showSearchResults: false as boolean,
      hamburgerVisible: true as boolean,
      showDropdown: false as boolean,
      showSuccess : false as boolean,
      sections : [] as Array<Section>,

      books: [] as any[],
      paginationData: {} as PaginationData
    }
  },
  mounted() {
      this.getSections();
  },
  methods: {
    
    setPageSize(size: number) {
      this.pageSize = size;
      if (this.searchInput) {
        this.searchResources();
        return;
      }
      this.searchResources();
    },
    selectPage(page: number) {
      this.page = page;
      if (this.searchInput) {
        this.searchResources();
        return;
      }
      this.searchResources();
    },
    handleSearch(event: any): void {
      this.searchInput = event.searchInput;
      this.searchResources();
    },
    onInputCleared(event: any): void {
      this.books = [];
      this.showSearchResults = false;
      this.errorMessage = '';
      this.showSuccess = false;
      this.getSections();
    },
    searchResources(): void {
      this.errorMessage = '';

      if (this.searchInput) {
        this.isLoading = true;
        const params = {
          text: this.searchInput,
          page: this.page,
          pageSize: this.pageSize
        };
        axios.get(getApiConnectionString() + '/search/resource', {
          params,
          withCredentials: true,
        }).then((results) => {
          this.books = [];
          this.books = results.data.searchResults;
          this.paginationData = results.data.pagination;
          this.showSearchResults = true;
          this.isLoading = false;
                  
        }).catch((error) => {
          this.isLoading = false;
          this.errorMessage = error.response.data.message;
        });
      }
    },
    getSections(): void {
        this.isLoading = true;

        axios.get(getApiConnectionString() + '/home/sections', {
          withCredentials: true,
        }).then((results) => {
          this.sections = results.data.sections;
          this.isLoading = false;
                  
        }).catch((error) => {
          this.isLoading = false;
          this.errorMessage = error.response.data.message;

        });
    },
    showhideSuccess(time: number = 10000) {
      this.showSuccess = true;
      setTimeout(() => { this.showSuccess = false; }, time);
    },
    checkoutResource(resource: any): void {
      this.errorMessage = '';
      if (this.searchInput) {
        this.isLoading = true;

        const body = {
          resource_id: resource._id,
          type: resource.resourceType
        };
        axios.post(getApiConnectionString() + '/checkouts/create', body, {
          withCredentials: true,
        }).then((results) => {
          this.isLoading = false;
          this.showhideSuccess();
          this.searchResources();
        }).catch((error) => {
          this.isLoading = false;
          this.errorMessage = error.response.data.message;
        });
      }
    }
  }
});

</script>