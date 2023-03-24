<template>
  <hamburger v-if="hamburgerVisible" />
  <loadingSpinner v-if="isLoading" />
  
  <headerBar />
  
  <div class="container-fluid min-vh-100 Bodybackground">
    <div class="d-flex container-fluid flex-column">
      <!--Title section-->
      <titleBar />

      <!--Begin, Search Bar-->
      <div class="d-flex justify-content-center">
        <div class="w-75 d-flex justify-content-center col-12 col-md-6">
          <div class="w-100 rounded-pill d-flex align-self-center justify-content-center rounded gap-3 mt-3 p-2"
            style="background: #322E3D;">

            <div class="form-group">
              <div class="dropdown">
                <button class="bi-sliders btn text-light" type="button" id="categoryDropdown" data-bs-toggle="dropdown"
                  aria-haspopup="true" :aria-expanded="false" style="font-size:1.5em">
                </button>
                <div class="dropdown-menu text-dark" aria-labelledby="categoryDropdown">
                  <a class="dropdown-item" :class="{ active: selectedOption === 'free' }" href="#"
                    @click="selectedOption = 'free'">თავისუფალი</a>
                  <a class="dropdown-item" :class="{ active: selectedOption === 'author' }" href="#"
                    @click="selectedOption = 'author'">ავტორი</a>
                  <a class="dropdown-item" :class="{ active: selectedOption === 'title' }" href="#"
                    @click="selectedOption = 'title'">დასახელება</a>
                </div>

                <input type="hidden" v-model="selectedOption" id="category">
              </div>
            </div>

            <div class="input-group d-flex align-items-center gap-2">
              <input v-on:keyup.enter="onEnter" style="height: 40px;" class="form-control rounded-pill mr-sm-2"
                v-model="searchInput" type="search" placeholder="Search" aria-label="Search" name="search">
              <div class="input-group-append">
                <button class="btn bi bi-search text-light" style="font-size:1.5em" v-on:click="searchBook()"
                  type="submit"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--End, Search Bar-->

      <!--Begin, Search Results-->
      <div v-if="showSearchResults" class="mt-5 container-fluid p-3 rounded d-flex flex-column  min-vh-100"
        style=" background-color: #322E3D;">
        <div v-for="(book) in books">

          <div class="d-flex align-self-center flex-column gap-2">
            <div class="d-flex flex-row gap-2">
              <img width="130" height="180" :src=book.cover />
              <div class="d-flex flex-column gap-2">
                <span class="text-light"> {{ book.title }} </span>
                <span class="text-light"> {{ "ავტორი:" + " " + book.authors }} </span>
                <span class="text-light"> {{ "გამოცემის წელი:" + " " + book.publicationYear }} </span>
              </div>
            </div>
            <div class="d-flex flex-column gap-2" style="width:130px">
              <button class="btn btn-primary" v-on:click="">წაკითხვა</button>
              <button class="btn btn-primary" v-on:click="">გატანა</button>
            </div>
          </div>

        </div>
      </div>
      <!--End, Search Results-->

      <!--Begin, Books-->
      <div v-if="!showSearchResults" class="booksSection p-3 mt-4 rounded d-flex flex-column"
        style="height:800px; overflow-y: scroll;">
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
        <carousel />
      </div>
      <!--End, Section-->
    </div>
    <footerBar />
  </div>
</template>

<style scoped>

</style>
<script>
import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import titleBar from '@/components/home/titleBar.vue'
import footerBar from '@/components/home/footerBar.vue'
import carousel from '@/components/home/carousel.vue'
import axios from 'axios'

import { getApiConnectionString } from '@/assets/js/utils'

export default {
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    titleBar,
    footerBar,
    carousel
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      searchInput: '',

      isLoading: false,
      showSearchResults: false,
      hamburgerVisible: true,

      showDropdown: false,
      selectedOption: 'free',

      books: [],
      paginationData: {}
    }
  },
  watch: {
    searchInput(newValue) {
      if (!newValue.trim()) {
        this.books = [];
        this.showSearchResults = false;
      }
    }
  },

  methods: {
    onEnter() {
      this.searchBook();
    },
    searchFilthered() {
      switch (this.selectedOption) {
        case "title":
          this.searchByTitle();
          break;
        case "author":
          this.searchByAuthor();
          break;
      }
    },
    searchByTitle() {
      this.isLoading = true;

      const params = {
        title: this.searchInput,
        page: this.page,
        pageSize: this.pageSize
      };
      axios.get(getApiConnectionString() + '/search/title', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.books = results.data.books;
        this.paginationData = results.data;
        this.showSearchResults = true;

        this.isLoading = false;

      }).catch((error) => {
        this.isLoading = false;
      });
    },
    searchByAuthor() {
      this.isLoading = true;

      const params = {
        author: this.searchInput,
        page: this.page,
        pageSize: this.pageSize
      };
      axios.get(getApiConnectionString() + '/search/author', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.books = results.data.books;
        this.paginationData = results.data;
        this.showSearchResults = true;

        this.isLoading = false;

      }).catch((error) => {
        this.isLoading = false;
      });
    },
    searchBook() {
      if (this.selectedOption !== "free") {
        this.searchFilthered();
        return;
      }

      if (this.searchInput) {
        this.isLoading = true;

        const params = {
          text: this.searchInput,
          page: this.page,
          pageSize: this.pageSize
        };
        axios.get(getApiConnectionString() + '/search/', {
          params,
          withCredentials: true,
        }).then((results) => {
          this.books = results.data.books;
          this.paginationData = results.data;
          this.showSearchResults = true;

          this.isLoading = false;

        }).catch((error) => {
          this.isLoading = false;
        });
      }
    }
  }
}

</script>