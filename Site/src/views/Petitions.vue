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
              </tr>
            </thead>
            <tbody>
              <tr v-for="petition in petitions" id="first" data-bs-toggle="modal" data-bs-target="#statementModal"
                @click="selectedPetition = petition">
                <td class="p-5">
                  <div v-bind:class="petition.status" class="bi-circle-fill" style="font-size: 1.3em;"></div>
                </td>
                <td class="statementText p-4 pt-5">
                  <span>{{ petition.usedtemplate[0].title }}</span>
                </td>
                <td class="p-4 pt-5 dateText">
                  <span>{{ formatDate(petition.timestamp) }}</span>
                </td>
                <td class="pt-4 w-25"><button @click="selectedPetition = petition" data-bs-toggle="modal"
                    data-bs-target="#largeModal" class="rounded-circle messageButton bi-chat-left-text"></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Begin, send statement modal -->
    <div class="d-flex justify-content-center align-content-center gap-2">
      <div>
        <div
          class="modal"
          id="myModal"
          tabindex="-1"
          role="dialog"
          style="display: block"
          v-show="showEditor"
          daba-bs-backdrop="static"
        >
          <div class="modal-dialog" role="document" style="max-width: 60%">
            <div class="modal-content" style="border: none">
              <div class="modal-header" style="border: none">
                <h5 class="modal-title" style="color: black">
                  ახალი განცხადება
                </h5>
              </div>
              <div class="modal-body" style="border: none">
                <div class="dropdown" v-cloak>
                  <input class="form-control text-light p-2" :placeholder="placeholderText"
                  @click="showDropdown = !showDropdown;" aria-haspopup="true" aria-expanded="false"
                  style="background: #D9D9D9; font-size:1em">
                  <div class="dropdown-menu w-100" :class="{ show: showDropdown }" aria-labelledby="dropdownMenuButton">
                    <a v-for="template in templates" :class="{ active: selectedOption === template.title }"
                    class="dropdown-item text-dark"
                    @click="selectOption(template.title.toString()); selectedTemplate = template; text = selectedTemplate.text.toString()"
                    href="#">{{ template.title }}</a>
                  </div>
                </div>
                
                <input type="email" disabled class="form-control mt-4 p-3 " style="background: #D9D9D9"
                :placeholder="userData.email.toString()">
              </div>
              <texteditor ref="editorComponent" />
              
              <div
                class="modal-footer d-flex justify-content-between"
                style="border: none"
              >
              <button class="btn btn-outline-danger" v-on:click="clearInputs();"
              data-bs-dismiss="modal">გაუქმება</button>
            <button :disabled="selectedOption === ''" style="color: #FFFFFF; font-weight: 600; "
              v-on:click="sendPetition();" class="btn btn-danger"
              data-bs-dismiss="modal">გაგზავნა</button>
            </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
      data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
                  class="dropdown-item text-dark"
                  @click="selectOption(template.title.toString()); selectedTemplate = template; text = selectedTemplate.text.toString()"
                  href="#">{{ template.title }}</a>
              </div>
            </div>
            <input type="email" disabled class="form-control mt-4 p-3 " style="background: #D9D9D9"
              :placeholder="userData.email.toString()">
            <textarea v-model="text" cols="20" rows="20" class="form-control mt-5 rounded"
              style="background: #D9D9D9"></textarea>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button class="btn btn-outline-danger" v-on:click="clearInputs();"
              data-bs-dismiss="modal">გაუქმება</button>
            <button :disabled="selectedOption === ''" style="color: #FFFFFF; font-weight: 600; "
              v-on:click="sendPetition();" class="btn btn-danger"
              data-bs-dismiss="modal">გაგზავნა</button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- End, send statement modal -->

    <!-- Begin, comment modal -->
    <div class="modal fade" id="largeModal" tabindex="-1" aria-labelledby="largeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg bg-light rounded">
        <div class="modal-content" style="background-color: #322E3D;">
          <div class="p-3 text-light" style="min-height: 200px;">
            {{ selectedPetition?.comment }}
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
            <span class="text-break">{{ selectedPetition?.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- End, statement modal -->
  <!-- </div> -->
</template>

<style src="@/assets/css/pages/petitionspage.css" scoped/>

<script lang="ts">
import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import texteditor from "@/components/texteditor.vue";

import { defineComponent } from 'vue'
import axios from 'axios'
import store from '@/store';

import { getApiConnectionString } from '@/assets/js/utils'
import { Petition, PetitionTemplate } from '../interfaces/Petition'
import { User } from '../interfaces/User'

export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    texteditor
  },
  data() {
    return {
      isLoading: false as boolean,
      userData: {} as User,

      templates: [] as PetitionTemplate[],
      petitions: [] as Petition[],

      selectedTemplate: null as PetitionTemplate | null,
      selectedPetition: null as Petition | null,

      showDropdown: false as boolean,
      selectedOption: '' as string,
      placeholderText: 'აირჩიეთ ტიპი' as string,

      text: '' as string,
      errorMessage: '' as string,
      successMessage: '' as string,
      showEditor: false,
    }
  },
  mounted() {
    this.loadTemplates()
    this.loadPetitions()
  },
  methods: {
    selectOption(option: string): void {
      this.selectedOption = option;
      this.placeholderText = option;
      this.showDropdown = false;
    },
    formatDate(timestamp: number): String {
      var d = new Date(timestamp);
      const formattedDate = d.toLocaleDateString().split(',')[0];
      return formattedDate;
    },
    clearInputs () : void {
      this.selectedTemplate = null;
      this.selectedPetition = null;

      this.text = '';
      this.selectedOption = '';
      this.placeholderText = 'აირჩიეთ ტიპი';

      this.showDropdown = false;
    },

    // CRUD
    loadTemplates(): void {
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
    loadPetitions(): void {
      this.isLoading = true;
      const params = {
        page: 1,
        pageSize: 80
      };
      axios.get(getApiConnectionString() + '/petitions/', {
        params,
        withCredentials: true,
      }).then((results) => {
        this.isLoading = false;
        this.petitions = results.data.petitions;
      }).catch(() => {
        this.isLoading = false;
      })

    },
    sendPetition(): void {
      this.isLoading = true;
      axios.post(getApiConnectionString() + '/petitions/send', {
        template: this.selectedTemplate?._id,
        text: this.text
      }, {
        withCredentials: true,
      }).then(() => {
        this.isLoading = false;
        this.loadPetitions();
      }).catch(() => {
        this.isLoading = false;
      })

    }
  },
  created() {
    this.userData = store.getters.GetUser
  }
});
</script>