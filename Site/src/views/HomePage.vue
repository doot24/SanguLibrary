<template>
  <hamburger v-if="hamburgerVisible" />
  <loadingSpinner v-if="isLoading" />
  
  <headerBar />
  
  <div class="container-fluid min-vh-100 Bodybackground">
    <div class="d-flex container-fluid flex-column">
      <!--Title section-->
      <titleBar />
      <search class="w-75 align-self-center" :options="options" @cleared="onInputCleared" @search="handleSearch"/> 
      <!--Begin, Search Results-->
      <div v-if="showSearchResults" class="mt-4 booksSection container-fluid  p-3 rounded d-flex flex-column  min-vh-100"
        >
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
      <div v-if="!showSearchResults" class="booksSection shadow-sm p-3 mt-4 rounded d-flex flex-column"
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
    <footerBar/>
  </div>
</template>

<style src="@/assets/css/pages/homepage.css" scoped/>

<script>
import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import titleBar from '@/components/home/titleBar.vue'
import footerBar from '@/components/home/footerBar.vue'
import carousel from '@/components/home/carousel.vue'
import axios from 'axios'

import search from '@/components/search.vue'

import { getApiConnectionString } from '@/assets/js/utils'

export default {
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
      page: 1,
      pageSize: 10,
      searchInput: '',

      isLoading: false,
      showSearchResults: false,
      hamburgerVisible: true,
      showDropdown: false,
      selectedOption: 'free',
      options: [
        { label: 'თავისუფალი', value: 'free' },
        { label: 'ავტორი', value: 'author' },
        { label: 'დასახელება', value: 'title' }
      ],
      books: [],
      paginationData: {}
    }
  },
  methods: {
    handleSearch(event) {
      this.selectedOption = event.selectedOption;
      this.searchInput = event.searchInput;
      this.searchBook();
    },
    onInputCleared(event) {
      this.books = [];
      this.showSearchResults = false;
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