<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex min-vh-100 justify-content-center Bodybackground">
    <div id="tableContainer" class="mt-5 d-flex flex-column">
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible w-50 align-self-center fade show" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="errorMessage = ''"
          aria-label="Close"></button>
      </div>
      <div v-if="successMessage" class="alert alert-success alert-dismissible w-50 align-self-center fade show" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''"
          aria-label="Close"></button>
      </div>
      <div class="d-flex justify-content-center align-items-center mb-3">
        <search class="w-75" :Height="500" :options="options" @cleared="onInputCleared" @search="handleSearch" />
      </div>
      <div class="d-flex justify-content-end mb-2 mt-2">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal"> ახალი განცხადების სახე
        </button>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#displayTemplates"> განცხადებების ნიმუშები
        </button>
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
            <tr v-for="petition in petitions" :class="{
              'table-border':
                petitions.length > 0 &&
                petitions[0]._id === petition._id,
            }">
              <td class="p-5 pt-3">
                <div v-bind:class="petition.status" class="bi-circle-fill" style="font-size: 1.3em;"></div>
              </td>
              <td class="statementText text-center">
                <span>{{ petition.usedtemplate[0]?.title }}</span>
              </td>
              <td class="dateText text-center">
                <span>{{ formatDate(petition.timestamp) }}</span>
              </td>
              <td :id="petition._id" class="text-truncate text-center" @click="toggleTruncation(petition._id)"
                style="max-width: 300px; cursor: pointer;" v-html="petition.text"></td>
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
                <!-- Begin editor -->
                <div class="d-flex justify-content-center align-content-center gap-2">
                  <button data-bs-toggle="modal" data-bs-target="#editModal" @click="selectPetition(petition)"
                    class="btn btn-light bi bi-pencil-square"></button>
                  <div>
                      <div class="modal fade" id="editModal" role="dialog" aria-labelledby="addBookModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div class="modal-content" style="border:none;">
                          <div class="modal-header" style="border:none;">
                            <h5 class="modal-title" style="color:black;">დაწერეთ კომენტარი</h5>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">
                              X
                            </button>
                          </div>
                          <div class="modal-body" style="border:none;">
                            <texteditor v-model:content="comment" />
                          </div>
                          <div class="modal-footer d-flex justify-content-between" style="border:none;">
                            <div class="changeStatus d-flex flex-column ml-2">
                              <span class="status_title d-flex">სტატუსის რედაქტირება</span>
                              <div class="form-check mt-5">
                                <span class="form-check-label" >
                                  დადასტურება
                                </span>
                                <input :checked="status === 'confirmed'" @click="status = 'confirmed'"
                                  class="form-check-input d-flex " type="radio">
                              </div>
                              <div class="form-check mt-2">
                                <span class="form-check-label">
                                  მოლოდინში
                                </span>
                                <input class="form-check-input" type="radio" @click="status = 'pending'"
                                  :checked="status === 'pending'">
                              </div>
                              <div class="form-check mt-2">
                                <span class="form-check-label">
                                  უარყოფა
                                </span>
                                <input class="form-check-input" type="radio" @click="status = 'rejected'"
                                  :checked="status === 'rejected'">
                              </div>
                            </div>
                            <button type="button" @click="updatePetition();" 
                              class="btn btn-primary addBtn1" style="background: rgba(240, 238, 238, 0.31); border: 0.767857px solid #D70E00;
                      border-radius: 20.7321px; color: #322E3D;margin-top: 6rem;">შენახვა</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- End editor -->
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

    <!-- Begin, add template modal -->
    <div style="height:300px" class="modal fade h-100" id="addModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true" data-bs-backdrop="static" data-keyboard="false">
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
              <input v-model="templateTitle" type="text" class="form-control" />
            </div>
            <div class="mt-3 d-flex flex-column">
              <h5>ტექსტი</h5>
              <texteditor v-model:content="templateText" />
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

    <div class="modal fade" id="displayTemplates" tabindex="-1" role="dialog" data-bs-backdrop="static" data-keyboard="false">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">განცხადების ნიმუშები</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
          </div>
          <div class="modal-body">
            <div v-for="template in templates" :key="template.id" class="card mt-2">
              <h5 class="card-title p-3 border" v-html="template.title"></h5>
              <div class="card-body">
                <p class="card-text" v-html="template.text"></p>
              </div>
              <button type="button" class="btn btn-danger" @click="deletePetitionTempate(template._id)">
                <i class="bi bi-trash-fill"></i> 
              </button>
            </div>
          </div>
          </div>
        </div>
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
.addBtn1 {
  width: 138px;
  height: 49px;
}
.changeStatus {
  width: 360px;
  height: 150px;
  background-color: #322e3d;
  border: 1px solid #322e3d;
  border-radius: 15px;
}
.status_title {
  position: absolute;
  padding-bottom: 10px;
  left: 8%;
}
.status_title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #e0d9f1;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import search from '@/components/search.vue'
import texteditor from '@/components/texteditor.vue'

import { getApiConnectionString } from '@/assets/js/utils'
import { Petition } from '@/interfaces/Petition'
import { PaginationData } from '@/interfaces/PaginationData'
import { User } from '@/interfaces/User'
import { SearchOptions } from '@/interfaces/SearchOptions'

export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    search,
    texteditor
  },
  data() {
    return {
      page: 1 as number,
      pageSize: 10 as number,
      petitions: [] as Petition[],
      paginationData: {} as PaginationData,

      selectedPetition: null as Petition | null,
      hamburgerVisible: true as boolean,

      confirmedDelete: false as boolean,
      isLoading: false as boolean,

      userData: null as User | null,

      SearchErrors: '' as string,
      successMessage: '' as string,
      errorMessage: '' as string,

      status: '' as string,
      comment: '' as string,

      templateTitle: '' as string,
      templateText: '' as string,

      templates : [] as any,

      options: [{ Label: 'პირადი ნომერი', Value: 'publicNumber' }, { Label: 'მობილური ნომერი', Value: 'phoneNumber' }] as SearchOptions[],
      searchInput: '' as string,
      selectedOption: "publicNumber" as string,
      showEditor: false,
    }
  },
  mounted() {
    this.getRecentPetitions();
    this.loadTemplates();
  },
  watch: {
    searchInput(newValue): void {
      if (!newValue.trim()) {
        this.getRecentPetitions()
      }
    }
  },

  methods: {
    showhideSuccess(message : string, time: number = 5000) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ""; }, time);
    },
    handleSearch(event: any): void {
      this.searchInput = event.searchInput;
      this.selectedOption = event.selectedOption;
      this.searchFilthered();
    },
    onInputCleared(event: any): void {
      this.searchInput = '';
      this.getRecentPetitions();
    },

    selectPetition(petition: Petition): void {
      this.selectedPetition = petition;
      this.comment = petition.comment;
      this.status = petition.status;
    },

    deselectPetition(): void {
      this.selectedPetition = null;
      this.comment = '';
      this.status = '';
    },

    clearTemplateInputs(): void {
      this.templateTitle = '';
      this.templateText = '<p> </p>';
    },

    // CRUD
    loadTemplates(): void {
      this.isLoading = true;
      axios.get(getApiConnectionString() + '/petitions/templates', {
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        this.templates = results.data.templates.filter((template: { system: boolean }) => !template.system);
      }).catch(() => {
        this.isLoading = false;
      })

    },
    getRecentPetitions(): void {
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
    addPetitionTempate(): void {
      this.isLoading = true;

      this.successMessage = '';
      this.errorMessage = '';

      axios.post(getApiConnectionString() + '/admin/petitionmanagement/addtemplate', {
        title: this.templateTitle,
        text: this.templateText
      }, {
        withCredentials: true,
      }).then((results) => {
        this.showhideSuccess('განცხადების ნიმუში წარმატებით დაემატა!');

        this.isLoading = false;
        this.clearTemplateInputs();
        this.loadTemplates();

      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
    },
    deletePetitionTempate(id : string): void {
      this.isLoading = true;

      this.successMessage = '';
      this.errorMessage = '';

      axios.post(getApiConnectionString() + '/admin/petitionmanagement/deletetemplate', {
        id: id,
      }, {
        withCredentials: true,
      }).then((results) => {
        this.showhideSuccess('განცხადების ნიმუში წარმატებით წაიშალა!');
        this.getRecentPetitions();
        this.loadTemplates();
        this.isLoading = false;
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
    },
    updatePetition(): void {
      this.isLoading = true;

      this.successMessage = '';
      this.errorMessage = '';

      axios.post(getApiConnectionString() + '/admin/petitionmanagement/update', {
        petitionid: this.selectedPetition?._id,
        status: this.status,
        comment: this.comment
      }, {
        withCredentials: true,
      }).then((results) => {
        this.showhideSuccess('განცხადება წარმატებით განახლდა!');
        this.isLoading = false;
        this.getRecentPetitions();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
    },
    setPageSize(size: number): void {
      this.pageSize = size;
      this.getRecentPetitions();
    },
    selectPage(page: number): void {
      this.page = page;
      this.getRecentPetitions();
    },
    searchFilthered(): void {
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
    searchByPublicNumber(): void {
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

        this.isLoading = false;

      }).catch((error) => {
        this.SearchErrors = error.response.data.message;

        this.isLoading = false;
      });
    },
    searchByPhoneNumber(): void {
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

        this.isLoading = false;

      }).catch((error) => {
        this.SearchErrors = error.response.data.message;

        this.isLoading = false;
      });
    },
    formatDate(timestamp: number) {
      var d = new Date(timestamp);
      const formattedDate = d.toLocaleDateString().split(',')[0];
      return formattedDate;
    },
    toggleTruncation(_id: string) {
      const el: any = document.getElementById(_id);
      if (el.classList.contains('text-truncate')) {
        el.classList.remove('text-truncate');
      } else {
        el.classList.add('text-truncate');
      }
    }
  }
});
</script>
