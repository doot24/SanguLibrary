<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex flex-column min-vh-100 Bodybackground">
    <div class="container mt-5">
      <div>
        <button id="button-statement" data-bs-toggle="modal" data-bs-target="#myModal"
          class="d-flex justify-content-center align-items-center">
          <span class="bi-plus" style="font-size: 3em;"></span>
          <span class="btn"> ახალი განცხადება </span>
        </button>
      </div>
      <div style="margin-left: 20px;" class="mt-5 mb-3">
        <span class="sentPetitionsText">გაგზავნილი განცხადებები </span>
      </div>
      <div class="d-flex justify-content-start">
        <div class="table-responsive w-100">
          <table class="table table-borderless table-default">
            <thead>
              <tr>
                <th style="width: 20%;" class="p-4">სტატუსი</th>
                <th class="p-4">განცხადების ტიპი</th>
                <th class="p-4">თარიღი</th>
                <th class="p-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="petition in petitions" id="first" data-bs-toggle="modal" data-bs-target="#statementModal" @click="selectedPetition = petition">
                <td class="p-5">
                  <div v-bind:class="petition.status" class="bi-circle-fill" style="font-size: 1.3em;"></div>
                </td>
                <td class="statementText p-4 pt-5">
                  <span>{{ petition.usedtemplate[0].title }}</span>
                </td>
                <td class="p-4 pt-5 dateText">
                  <span>{{ formatDate(petition.timestamp) }}</span>
                </td>
                <td class="pt-4 w-25"><button @click="selectedPetition = petition" data-bs-toggle="modal" data-bs-target="#largeModal"
                    class="rounded-circle messageButton bi-chat-left-text"></button></td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Begin, send statement modal -->
    <div class="modal fade" id="myModal" tabindex="-1" @pointerleave="selectedTemplate = {}; text = ''; selectedOption = ''; " aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="background: #232128; border-radius: 20.8076px;">
          <div class="modal-header">
            <h5 class="modal-title text-white" id="exampleModalLabel">ახალი განცხადება</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="dropdown" v-cloak>
              <input class="form-control text-light p-2" :placeholder="placeholderText"
                @click="showDropdown = !showDropdown;" aria-haspopup="true" aria-expanded="false"
                style="background: #D9D9D9; font-size:1em">
              <div class="dropdown-menu w-100" :class="{ show: showDropdown }" aria-labelledby="dropdownMenuButton">
                <a v-for="template in templates" :class="{ active: selectedOption === template.title }"
                  class="dropdown-item text-dark" @click="selectOption(template.title); selectedTemplate = template; text = selectedTemplate.text"
                  href="#">{{ template.title }}</a>
              </div>
            </div>
            <input type="email" disabled class="form-control mt-4 p-3 " style="background: #D9D9D9"
              :placeholder="userData.email">
            <textarea v-model="text" cols="20" rows="20" class="form-control mt-5 rounded"
              style="background: #D9D9D9"></textarea>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button  class="btn btn-outline-danger" v-on:click="selectedTemplate = {}; text = ''; selectedOption = ''"
              data-bs-dismiss="modal">გაუქმება</button>
            <button :disabled="selectedOption === ''" style="color: #FFFFFF; font-weight: 600; " v-on:click="sendPetition(); selectedTemplate = {}; text = ''; "
              class="btn btn-danger">გაგზავნა</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End, send statement modal -->

    <!-- Begin, comment modal -->
    <div class="modal fade" id="largeModal" tabindex="-1" aria-labelledby="largeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg bg-light rounded">
        <div class="modal-content" style="background-color: #322E3D;">
          <div class="p-3 text-light" style="min-height: 200px;">
            {{ selectedPetition.comment }}
          </div>
        </div>
      </div>
    </div>
    <!-- End, comment modal -->

     <!-- Begin, statement modal -->
     <div class="modal fade" id="statementModal" tabindex="-1" aria-labelledby="statementModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg bg-light rounded">
        <div class="modal-content" style="background-color: #322E3D;">
          <div class="p-3 text-light text-break" style="min-height: 200px;">
            <span class="text-break">{{ selectedPetition.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- End, statement modal -->
  </div>
</template>

<style src="@/assets/css/pages/petitionspage.css" scoped/>

<script>
import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'

import axios from 'axios'
import { getApiConnectionString } from '@/assets/js/utils'

export default {
  components: {
    hamburger,
    loadingSpinner,
    headerBar
  },
  data() {
    return {
      isLoading: false,
      userData: {},

      templates: [],
      petitions : [],
      selectedTemplate: {},
      selectedPetition : {},

      showDropdown: false,
      selectedOption: '',
      placeholderText: 'აირჩიეთ ტიპი',

      text : '',
      errorMessage: '',
      successMessage: ''
    }
  },
  mounted() {
    this.loadTemplates()
    this.loadPetitions()
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
      this.placeholderText = option;
      this.showDropdown = false;
    },
    formatDate(timestamp) {
      var d = new Date(timestamp);
      const formattedDate = d.toLocaleDateString().split(',')[0];
      return formattedDate;
    },
    // CRUD
    loadTemplates() {
      this.isLoading = true;
      axios.get(getApiConnectionString() + '/petitions/templates', {
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        this.templates = results.data.templates;
      }).catch(() => {
        this.isLoading = false;
      })

    },
    loadPetitions() {
      this.isLoading = true;
      const params = {
        page: 1,
        pageSize: 5
      };
      axios.get(getApiConnectionString() + '/petitions/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        console.log(results.data)
        this.petitions = results.data.petitions;
      }).catch(() => {
        this.isLoading = false;
      })

    },
    sendPetition() {
      this.isLoading = true;
      axios.post(getApiConnectionString() + '/petitions/send', {
        template : this.selectedTemplate._id,
        text : this.text
      }, {
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        this.loadPetitions();
      }).catch(() => {
        this.isLoading = false;
      })

    }
  },
  created() {
    this.userData = this.$store.getters.GetUser
  }
}
</script>