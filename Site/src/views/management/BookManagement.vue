<template>
  <hamburger v-if="hamburgerVisible" />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex min-vh-100 justify-content-center Bodybackground">
    <div id="tableContainer" v-if="!addDivVisible && !editDivVisible" class=" mt-5 d-flex flex-column">
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

      <div class="d-flex justify-content-between align-items-center mb-3 ">

        <div class="input-group d-flex align-items-center w-50 p-3 pt-2 pb-2 rounded-pill" style="background: #322E3D;">

          <div class="form-group">

            <div class="dropdown" >
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
                <a class="dropdown-item" :class="{ active: selectedOption === 'isbn' }" href="#"
                  @click="selectedOption = 'isbn'">isbn</a>
              </div>
              <input type="hidden" v-model="selectedOption" id="category">
            </div>
          </div>
          <input type="text" v-model="searchInput" class="form-control rounded-pill" v-on:keyup.enter="onEnter"
            placeholder="ძებნა...">
          <div class="input-group-append" style="margin-left: 10px;">
            <button class="btn text-light bi bi-search" style="font-size:1.2em" v-on:click="searchBook()"
              type="button"></button>
          </div>
        </div>
        <div class="ml-auto">
          <button class="btn btn-dark"
            v-on:click="addDivVisible = !addDivVisible; hamburgerVisible = !hamburgerVisible">დამატება</button>
        </div>
      </div>
      <div class="rounded table-responsive">
        <table class="table table-borderless table-default">
          <thead>
            <tr>
              <th scope="col" class="text-center" style="width: 10%;">ყდა</th>
              <th scope="col" class="text-center" style="width: 10%;">დასახელება</th>
              <th scope="col" class="text-center" style="width: 10%;">ქვესათაური</th>
              <th scope="col" class="text-center" style="width: 10%;">ავტორები</th>
              <th scope="col" class="text-center" style="width: 10%;">რედაქტორები</th>
              <th scope="col" class="text-center" style="width: 10%;">მიმოხილვა</th>
              <th scope="col" class="text-center" style="width: 10%;">თემატიკა</th>
              <th scope="col" class="text-center" style="width: 10%;">რეზიუმე</th>
              <th scope="col" class="text-center" style="width: 10%;">შენიშვნა</th>
              <th scope="col" class="text-center text-nowrap" style="width: 10%;">გამომცემლობა</th>
              <th scope="col" class="text-center text-nowrap" style="width: 10%;">გამოცემის ადგილი</th>
              <th scope="col" class="text-center text-nowrap" style="width: 20%;">გამოცემის წელი</th>
              <th scope="col" class="text-center" style="width: 10%;">ISBN</th>
              <th scope="col" class="text-center text-nowrap" style="width: 10%;">შენახვის შიფრი</th>
              <th scope="col" class="text-center" style="width: 30%;">ქმედებები</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(book) in books" :key="book.id"
              :class="{ 'table-border': books.length > 0 && books[0].bookid === book.bookid }">
              <td :key="book.id"> <img class="img-fluid rounded" :src="book.cover"
                  style="min-width: 160px; max-width: 100%; height: auto;"></td>
              <td class="text-center text-wrap" style="width: 6rem;">{{ book.title }}</td>
              <td class="text-center text-wrap" style="width: 6rem;">{{ book.subTitle }}</td>
              <td>
                <ul>
                  <li v-for="author in book.authors" :key="author" class="list-group-item mt-2">{{ author }}</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="editor in book.editors" :key="editor" class="list-group-item mt-2">{{ editor }}</li>
                </ul>
              </td>
              <td :id="book.bookid" class="text-truncate" @click="toggleTruncation(book.bookid)"
                style="max-width: 300px; cursor: pointer;">{{ book.description }}</td>
              <td>{{ book.category }}</td>
              <td>{{ book.resume }}</td>
              <td>{{ book.remark }}</td>
              <td class="text-center">{{ book.publication }}</td>
              <td class="text-center">{{ book.publicationLocation }}</td>
              <td class="text-center">{{ book.publicationYear }}</td>
              <td>{{ book.isbn }}</td>
              <td>{{ book.saveCipher }}</td>
              <td>
                <div class="d-flex justify-content-center align-content-center gap-2">
                  <button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn btn-light bi bi-trash3-fill"
                    v-on:click="selectedBook = book"></button>
                  <button class="btn btn-light bi bi-download" v-on:click="selectedBook = book; downloadBook()"></button>
                  <button
                    v-on:click="editDivVisible = !editDivVisible; hamburgerVisible = !hamburgerVisible; selectedBook = book; selectEdit()"
                    class="btn btn-light bi bi-pencil-square"></button>
                </div>
              </td>
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

    <!-- Begin, Add book -->
    <div v-show="addDivVisible" class="container mt-5">
     
      <div v-if="errorMessage" class="alert alert-danger mt-5 w-50 mx-auto"> <i class="bi bi-info-circle-fill"></i>
            <strong>{{ errorMessage }}</strong>
          </div>
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show w-50 mx-auto" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''"
          aria-label="Close"></button>
      </div>

      <h1 class="text-light text-center py-3">წიგნის დამატება</h1>

      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="was-validated">
            <div class="form-group">
              <label class="text-light" for="title">სათაური</label>
              <input type="text" v-model="bookTitle" class="form-control w-100" id="title" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="title">ქვესათაური</label>
              <input type="text" v-model="subTitle" class="form-control w-100" id="title" required>
            </div>

            <div class="form-group mt-2 mb-2 ">
              <label class="text-light" for="title">ავტორები</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="newAuthor" :required="authors.length === 0">
                <span class="input-group-btn">
                  <button class="btn btn-primary" style="margin-left: 5px;" type="button"
                    @click="addItem(authors, newAuthor); newAuthor = ''">+</button>
                </span>
              </div>
              <ul :style="authors.length > 0 ? { 'overflow-y': 'scroll', 'height': '200px' } : { 'overflow-y': 'hidden' }"
                class="list-group mt-2">
                <li class='list-group-item d-flex align-items-center justify-content-between'
                  v-for="(item, index) in authors" :key="index">
                  {{ item }}
                  <button class='btn btn-primary' aria-label='Close' @click="removeItem(authors, index)">
                    X
                  </button>
                </li>
              </ul>
            </div>

            <div class="form-group mt-2 mb-2">
              <label class="text-light" for="title">რედაქტორები</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="newEditor" >
                <span class="input-group-btn">
                  <button class="btn btn-primary" style="margin-left: 5px;" type="button"
                    @click="addItem(editors, newEditor); newEditor = ''">+</button>
                </span>
              </div>
              <ul :style="editors.length > 0 ? { 'overflow-y': 'scroll', 'height': '200px' } : { 'overflow-y': 'hidden' }"
                class="list-group mt-2">
                <li class='list-group-item d-flex align-items-center justify-content-between'
                  v-for="(item, index) in editors" :key="index">
                  {{ item }}
                  <button class='btn btn-primary' aria-label='Close' @click="removeItem(editors, index)">
                    X
                  </button>
                </li>
              </ul>
            </div>

            <div class="form-group">
              <label class="text-light" for="description">აღწერა</label>
              <textarea v-model="description" class="form-control w-100" id="description" rows="3" required></textarea>
            </div>

            <div class="form-group">
              <label class="text-light" for="category">თემატიკა</label>
              <div class="dropdown">
                <button
                  class="w-100 d-flex justify-content-between btn btn-primary bg-light dropdown-toggle-split text-dark"
                  type="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  {{ this.category }} <i class="bi bi-caret-down-fill"></i>
                </button>

                <div class="dropdown-menu dropdown-menu-end w-100 text-dark" style="overflow-y: scroll; height: 200px;"
                  aria-labelledby="categoryDropdown">
                  <a class="dropdown-item" href="#" v-for="category in categories"
                    @click="selectCategory(category.text)">{{ category.text }}</a>
                </div>

                <input type="hidden" v-model="category" id="category">
              </div>
            </div>

            <div class="form-group">
              <label class="text-light" for="date">გამომცემლობა</label>
              <input type="text" v-model="publication" class="form-control w-100" id="date" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="date">გამოცემის ადგილი</label>
              <input type="text" v-model="publicationLocation" class="form-control w-100" id="date" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="date">გამოცემის წელი</label>
              <input type="text" v-model="publicationYear" class="form-control w-100" id="date" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">რეზიუმე</label>
              <input type="text" v-model="resume" class="form-control w-100" id="isbn" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">შენიშვნა</label>
              <input type="text" v-model="remark" class="form-control w-100" id="isbn" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">შენახვის შიფრი</label>
              <input type="text" v-model="saveCipher" class="form-control w-100" id="isbn" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">ISBN</label>
              <input type="text" v-model="isbn" class="form-control w-100" id="isbn" required>
            </div>
            <div class="mt-3 mb-3">
              <label for="formFile" class=" text-light form-label">წიგნის ფაილი</label>
              <input class="form-control bookFile" v-on:change="onFileSelected" type="file" id="formFile"
                accept="application/pdf" required>
            </div>

            <div class="mt-3 mb-3">
              <label for="formFile" class=" text-light form-label">ყდის სურათი</label>
              <input class="form-control coverFile" v-on:change="onCoverFileSelected" type="file" id="formFile"
                accept="image/png, image/jpeg, image/jpg" required>
            </div>

            <div class="mt-3 d-flex flex-column gap-2 justify-content-center align-items-center">
              <button :disabled="!canSubmit() || isLoading" class="w-50 btn btn-dark mr-1"
                v-on:click="addBook">დამატება</button>
              <button :disabled="isLoading"
                v-on:click="addDivVisible = !addDivVisible; clearInputs(); clearMessages(); loadBooks();"
                class="w-50 btn btn-dark ml-1">უკან</button>
            </div>

          </div>
        </div>
      </div>

    </div>
    <!-- End, Add book -->

    <!-- Begin, Edit book -->
    <div v-show="editDivVisible" class="container mt-5">
      <div v-if="errorMessage" class="alert alert-danger mt-5 w-50 mx-auto"> <i class="bi bi-info-circle-fill"></i>
            <strong>{{ errorMessage }}</strong>
          </div>
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show w-50 mx-auto" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''"
          aria-label="Close"></button>
      </div>

      <h1 class="text-light text-center py-3">წიგნის რედაქტირება</h1>
      <div class="row">
        
        <div class="col-md-6 mx-auto">
          <div class="was-validated">
            <div class="form-group">
              <label class="text-light" for="title">სათაური</label>
              <input type="text" v-model="bookTitle" class="form-control w-100" id="title" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="title">ქვესათაური</label>
              <input type="text" v-model="subTitle" class="form-control w-100" id="title" required>
            </div>

            <div class="form-group mt-2 mb-2 ">
              <label class="text-light" for="title">ავტორები</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="newAuthor" :required="authors.length === 0">
                <span class="input-group-btn">
                  <button class="btn btn-primary" style="margin-left: 5px;" type="button"
                    @click="addItem(authors, newAuthor); newAuthor = ''">+</button>
                </span>
              </div>
              <ul :style="authors.length > 0 ? { 'overflow-y': 'scroll', 'height': '200px' } : { 'overflow-y': 'hidden' }"
                class="list-group mt-2">
                <li class='list-group-item d-flex align-items-center justify-content-between'
                  v-for="(item, index) in authors" :key="index">
                  {{ item }}
                  <button class='btn btn-primary' aria-label='Close' @click="removeItem(authors, index)">
                    X
                  </button>
                </li>
              </ul>
            </div>

            <div class="form-group mt-2 mb-2">
              <label class="text-light" for="title">რედაქტორები</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="newEditor">
                <span class="input-group-btn">
                  <button class="btn btn-primary" style="margin-left: 5px;" type="button"
                    @click="addItem(editors, newEditor); newEditor = ''">+</button>
                </span>
              </div>
              <ul :style="editors.length > 0 ? { 'overflow-y': 'scroll', 'height': '200px' } : { 'overflow-y': 'hidden' }"
                class="list-group mt-2">
                <li class='list-group-item d-flex align-items-center justify-content-between'
                  v-for="(item, index) in editors" :key="index">
                  {{ item }}
                  <button class='btn btn-primary' aria-label='Close' @click="removeItem(editors, index)">
                    X
                  </button>
                </li>
              </ul>
            </div>

            <div class="form-group">
              <label class="text-light" for="description">აღწერა</label>
              <textarea v-model="description" class="form-control w-100" id="description" rows="3" required></textarea>
            </div>

            <div class="form-group">
              <label class="text-light" for="category">თემატიკა</label>
              <div class="dropdown">
                <button
                  class="w-100 d-flex justify-content-between btn btn-primary bg-light dropdown-toggle-split text-dark"
                  type="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  {{ this.category }} <i class="bi bi-caret-down-fill"></i>
                </button>

                <div class="dropdown-menu dropdown-menu-end w-100 text-dark" style="overflow-y: scroll; height: 200px;"
                  aria-labelledby="categoryDropdown">
                  <a class="dropdown-item" href="#" v-for="category in categories"
                    @click="selectCategory(category.text)">{{ category.text }}</a>
                </div>

                <input type="hidden" v-model="category" id="category">
              </div>
            </div>


            <div class="form-group">
              <label class="text-light" for="date">გამომცემლობა</label>
              <input type="text" v-model="publication" class="form-control w-100" id="date" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="date">გამოცემის ადგილი</label>
              <input type="text" v-model="publicationLocation" class="form-control w-100" id="date" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="date">გამოცემის წელი</label>
              <input type="text" v-model="publicationYear" class="form-control w-100" id="date" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">რეზიუმე</label>
              <input type="text" v-model="resume" class="form-control w-100" id="isbn" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">შენიშვნა</label>
              <input type="text" v-model="remark" class="form-control w-100" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">შენახვის შიფრი</label>
              <input type="text" v-model="saveCipher" class="form-control w-100" required>
            </div>
            <div class="form-group">
              <label class="text-light" for="isbn">ISBN</label>
              <input type="text" v-model="isbn" class="form-control w-100" required>
            </div>
            <div class="mt-3 mb-3">
              <label for="formFile" class=" text-light form-label">წიგნის ფაილი</label>
              <input class="form-control bookFile" v-on:change="onFileSelected" type="file" id="formFile"
                accept="application/pdf">
            </div>

            <div class="mt-3 mb-3">
              <label for="formFile" class=" text-light form-label">ყდის სურათი</label>
              <input class="form-control coverFile" v-on:change="onCoverFileSelected" type="file" id="formFile"
                accept="image/png, image/jpeg, image/jpg">
            </div>


            <div class=" mt-3 d-flex flex-column gap-2 justify-content-center align-items-center">
              <button :disabled="!canSubmitEdit() || isLoading" class="w-50 btn btn-dark mr-1"
                v-on:click="updateBook()">განახლება</button>
              <button :disabled="isLoading"
                v-on:click="editDivVisible = !editDivVisible;  clearInputs(); clearMessages(); loadBooks()"
                class="w-50 btn btn-dark ml-1">უკან</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End, Edit book -->

    <!-- Begin, Delete Modal -->
    <div class="modal fade " id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header">

            <h5 class="modal-title">გსურთ ამ წიგნის წაშლა?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-check">
              <input v-model="confirmedDelete" class="form-check-input" type="checkbox">
              <label class="form-check-label" for="confirmDelete">
                დადასტურება
              </label>
            </div>
          </div>
          <div class="modal-footer">

            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
              v-on:click="confirmedDelete = false">არა</button>
            <button :disabled="!confirmedDelete" type="button" class="btn btn-dark" data-bs-dismiss="modal"
              v-on:click="deleteBook(); confirmedDelete = false">დიახ</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End, Delete Modal -->

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
      pageSize: 5,
      books: [],
      paginationData: {},

      selectedBook: {},

      hamburgerVisible: true,
      confirmedDelete: false,
      addDivVisible: false,
      editDivVisible: false,
      isLoading: false,
      showError: false,

      userData: null,

      categories: [],

      newAuthor: "",
      newEditor: "",

      SearchErrors: '',
      EditErrorMessage: '',
      errorMessage: '',
      AddErrorMessage: '',
      searchInput: '',
      selectedOption: 'free',

      // needed to add/update books
      bookTitle: "",
      subTitle: "",
      authors: [],
      editors: [],
      description: "",
      isbn: "",
      category: "ზოგადი განყოფილება",
      publicationLocation: "",
      publication: "",
      publicationYear: "",
      saveCipher: "",

      resume: "",
      remark: "",

      bookFile: "",
      coverFile: ""
    }
  },
  watch: {
    searchInput(newValue) {
      if (!newValue.trim()) {
        this.onInputEmpty()
      }
    }
  },

  mounted() {
    this.loadBooks()
    this.getCategories()
  },
  methods: {
    addItem(authors, newItem) {
      if (newItem !== "") {
        authors.push(newItem);
      }

    },
    removeItem(authors, index) {
      authors.splice(index, 1);
    },
    onEnter: function () {
      this.loadBooks();
    },
    onInputEmpty() {
      this.loadBooks()
    },

    selectCategory(newCategory) {
      this.category = newCategory
    },

    searchFilthered() {
      switch (this.selectedOption) {
        case "title":
          this.searchByTitle();
          break;
        case "author":
          this.searchByAuthor();
          break;
        case "isbn":
          this.searchByISBN();
          break;
      }
    },

    searchByISBN() {
      this.isLoading = true;

      const params = {
        isbn: this.searchInput,
      };

      axios.get(getApiConnectionString() + '/search/isbn', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.books = results.data.books;
        this.paginationData = {}
        this.isLoading = false;
      }).catch((error) => {
        this.SearchErrors = error.response.data.message;
        this.isLoading = false;
      });
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
        this.SearchErrors = error.response.data.message;

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
        this.SearchErrors = error.response.data.message;

        this.isLoading = false;
      });
    },

    toggleTruncation(id) {
      const el = document.getElementById(id);
      if (el.classList.contains('text-truncate')) {
        el.classList.remove('text-truncate');
      } else {
        el.classList.add('text-truncate');
      }
    },

    setPageSize(size) {
      this.pageSize = size;
      if (this.searchInput) {
        this.searchBook();
        return;
      }
      this.loadBooks();
    },
    selectPage(page) {
      this.page = page;
      if (this.searchInput) {
        this.searchBook();
        return;
      }
      this.loadBooks();
    },

    clearInputs() {
      this.bookTitle = "";
      this.subTitle = "";
      this.authors = [];
      this.editors = [];
      this.description = "";
      this.isbn = "";
      this.category = this.categories[0].text;
      this.publication = "";
      this.publicationYear = "";
      this.publicationLocation = "";
      this.bookFile = "";
      this.coverFile = "";

      this.resume = "";
      this.remark = "";
      this.saveCipher = "";

      this.selectedBook = {};

      this.hamburgerVisible = true;

      const inputs = document.querySelectorAll('input');

      inputs.forEach((input) => {
        input.value = '';
      });

    },

    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    },

    selectEdit() {
      this.bookTitle = this.selectedBook.title;
      this.subTitle = this.selectedBook.subTitle;
      this.editors = this.selectedBook.editors;
      this.authors = this.selectedBook.authors;
      this.description = this.selectedBook.description;
      this.isbn = this.selectedBook.isbn;
      this.category = this.selectedBook.category;
      this.publication = this.selectedBook.publication;
      this.publicationLocation = this.selectedBook.publicationLocation;
      this.publicationYear = this.selectedBook.publicationYear;

      this.remark = this.selectedBook.remark;
      this.resume = this.selectedBook.resume;
      this.saveCipher = this.selectedBook.saveCipher;
    },
    canSubmit() {
      return (!this.bookFile || !this.coverFile || !this.resume || !this.remark || !this.saveCipher || !this.bookTitle || !this.subTitle || !this.authors || !this.description || !this.isbn || !this.category || !this.publication || !this.publicationLocation || !this.publicationYear) === false;
    },
    canSubmitEdit() {
      return (!this.resume || !this.remark || !this.saveCipher || !this.bookTitle || !this.subTitle || !this.authors || !this.description || !this.isbn || !this.category || !this.publication || !this.publicationLocation || !this.publicationYear) === false;
    },

    onFileSelected(event) {
      this.bookFile = event.target.files[0];
      this.bookFileTarget = event.target.value;
    },
    onCoverFileSelected(event) {
      this.coverFile = event.target.files[0];
      this.coverFileTarget = event.target.value;
    },

    // CRUD
    loadBooks() {
      if (this.searchInput) {
        this.searchBook();
        return;
      }
      const params = {
        page: this.page,
        pageSize: this.pageSize,
      };

      this.isLoading = true;
      axios.get(getApiConnectionString() + '/library/books', {
        params,
        withCredentials: true,

      }).then((results) => {
        this.isLoading = false;
        this.books = results.data.books;
        this.paginationData = results.data;
      }).catch(() => {
        this.isLoading = false;
      })
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

          this.isLoading = false;

        }).catch((error) => {
          this.isLoading = false;
        });
      }
    },

    getCategories() {
      this.isLoading = true;

      axios.get(getApiConnectionString() + '/library/categories', { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } },).then((response) => {
        this.isLoading = false;
        this.categories = response.data.categories;
      }).catch(() => {
        this.isLoading = false;
      })
    },

    addBook() {
      this.clearMessages();

      this.isLoading = true;

      const body = {
        book: this.bookFile,
        cover: this.coverFile,
        title: this.bookTitle,
        subTitle: this.subTitle,
        authors: JSON.stringify(this.authors),
        editors: JSON.stringify(this.editors),
        description: this.description,
        isbn: this.isbn,
        category: this.category,
        publication: this.publication,
        publicationYear: this.publicationYear,
        publicationLocation: this.publicationLocation,

        remark: this.remark,
        resume: this.resume,
        saveCipher: this.saveCipher
      }

      axios.post(getApiConnectionString() + '/admin/bookmanagement/addbook', body, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } },).then((results) => {
        this.isLoading = false;
        this.successMessage = "წიგნი წარმატებით დაემატა!";
        this.AddErrorMessage = '';
        this.clearInputs();
      }).catch((error) => {
        this.isLoading = false;
        this.AddErrorMessage = error.response.data.message
      })
    },
    updateBook() {
      this.clearMessages();

      this.isLoading = true;

      const body = {
        bookid: this.selectedBook.bookid,
        book: this.bookFile,
        cover: this.coverFile,
        title: this.bookTitle,
        subTitle: this.subTitle,
        authors: JSON.stringify(this.authors),
        editors: JSON.stringify(this.editors),
        description: this.description,
        isbn: this.isbn,
        category: this.category,
        publication: this.publication,
        publicationYear: this.publicationYear,
        publicationLocation: this.publicationLocation,

        remark: this.remark,
        resume: this.resume,
        saveCipher: this.saveCipher
      }

      axios.post(getApiConnectionString() + '/admin/bookmanagement/updatebook', body, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } },).then((results) => {
        this.isLoading = false;
        this.successMessage = "წიგნი წარმატებით განახლდა!";
        this.EditErrorMessage = '';
      }).catch((error) => {
        this.isLoading = false;
        this.showError = true;
        this.EditErrorMessage = error.response.data.message
      })
    },
    downloadBook() {
      this.isLoading = true;
      const params = {
        bookid: this.selectedBook.bookid
      };
      axios.get(getApiConnectionString() + '/admin/bookmanagement/downloadbook', { params, withCredentials: true },).then((response) => {
        this.isLoading = false;
        window.open(response.data.url, '_blank').focus();

        this.clearInputs();
      }).catch(() => {
        this.isLoading = false;
      })
    },
    deleteBook() {
      this.clearMessages();

      this.isLoading = true;

      axios.post(getApiConnectionString() + '/admin/bookmanagement/deletebook', { bookid: this.selectedBook.bookid }, { withCredentials: true },).then(() => {
        this.isLoading = false;
        this.selectedBook = {};
        this.successMessage = "წიგნი წარმატებით წაიშალა!";
        this.loadBooks();
      }).catch(() => {
        this.isLoading = false;
      })
    }
  }
}
</script>