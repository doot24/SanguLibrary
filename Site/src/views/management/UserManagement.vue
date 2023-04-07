<template>
  <hamburger />
  <loadingSpinner v-if="isLoading" />
  <headerBar />

  <div class="container-fluid d-flex min-vh-100 justify-content-center Bodybackground">
    <div id="tableContainer" class=" mt-5 d-flex flex-column">
      <div v-if="SearchErrors" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ SearchErrors }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="SearchErrors = ''"
          aria-label="Close"></button>
      </div>

      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-info-circle-fill"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="successMessage = ''"
          aria-label="Close"></button>
      </div>

      <div class="d-flex justify-content-center align-items-center mb-3 ">
        <search class="w-75" :options="options" @cleared="onInputCleared" @search="handleSearch" />
      </div>
      <div class="rounded table-responsive">
        <table class="table table-borderless table-default">
          <thead>
            <tr>
              <th scope="col" class="text-center" style="width: 10%;">მომხმარებელი</th>
              <th scope="col" class="text-center" style="width: 10%;">სახელი</th>
              <th scope="col" class="text-center" style="width: 10%;">გვარი</th>
              <th scope="col" class="text-center" style="width: 10%;">მეილი</th>
              <th scope="col" class="text-center" style="width: 10%;">პირადი ნომერი</th>
              <th scope="col" class="text-center" style="width: 10%;">მობილურის ნომერი</th>
              <th v-if="userData.roles.includes('admin')" scope="col" class="text-center" style="width: 10%;">როლები</th>
              <th v-if="userData.roles.includes('admin')" scope="col" class="text-center" style="width: 10%;">ქმედებები
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user) in users" :key="user._id"
              :class="{ 'table-border': users.length > 0 && user._id === users[0]._id }">
              <td :key="user._id">
                <img class="img-fluid rounded" :src="user.photo || require('@/assets/images/person.png')"
                  style="min-width: 160px; max-width: 100%; height: auto;"
                  :alt="user.photo ? 'User profile picture' : 'Default icon'">
              </td>
              <td class="text-center text-wrap" style="width: 6rem;">{{ user.firstName }}</td>
              <td class="text-center text-wrap" style="width: 6rem;">{{ user.lastName }}</td>
              <td class="text-center">{{ user.email }}</td>
              <td class="text-center">{{ user.publicNumber }}</td>
              <td class="text-center">{{ user.phoneNumber }}</td>
              <td v-if="userData.roles.includes('admin')">
                <!--<li v-for="role in user.roles" :key="role">{{ translateRole(role) }}</li> -->
                <div class="form-check form-switch">
                  <input class="form-check-input" :checked="user.roles.includes('admin')"
                    v-on:click="addRemoveRoleValue(user, 'admin')" type="checkbox" id="flexSwitchCheckDefault">
                  <label class="form-check-label" for="flexSwitchCheckDefault">ადმინისტრატორი</label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" :checked="user.roles.includes('editor')"
                    v-on:click="addRemoveRoleValue(user, 'editor')" type="checkbox" id="flexSwitchCheckDefault">
                  <label class="form-check-label" for="flexSwitchCheckDefault">რედაქტორი</label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" :checked="user.roles.includes('employee')"
                    v-on:click="addRemoveRoleValue(user, 'employee')" type="checkbox" id="flexSwitchCheckDefault">
                  <label class="form-check-label" for="flexSwitchCheckDefault">თანამშრომელი</label>
                </div>
              </td>
              <td v-if="userData.roles.includes('admin')">
                <div class="d-flex justify-content-center align-content-center gap-2">
                  <button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn btn-light bi bi-trash3-fill"
                    v-on:click="selectedUser = user"></button>
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

    <!-- Begin, Delete Modal -->
    <div class="modal fade " id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header">

            <h5 class="modal-title">გსურთ ამ მომხმარებლის წაშლა?</h5>
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
              v-on:click="deleteUser(); confirmedDelete = false">დიახ</button>
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

.bodyClass {
  background: #1A181E;
}

table {
  color: white;
  background-color: rgba(35, 33, 40, 1);
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'
import axios from 'axios'

import hamburger from '@/components/hamburger.vue'
import loadingSpinner from '@/components/loadingSpinner.vue'
import headerBar from '@/components/headerBar.vue'
import search from '@/components/search.vue'

import { getApiConnectionString } from '@/assets/js/utils'
import { User } from '@/interfaces/User'
import { SearchOptions } from '@/interfaces/SearchOptions'
import { PaginationData } from '@/interfaces/PaginationData'

export default defineComponent({
  components: {
    hamburger,
    loadingSpinner,
    headerBar,
    search
  },
  data() {
    return {
      page: 1 as number,
      pageSize: 10 as number,
      users: [] as User[],
      paginationData: {} as PaginationData,

      selectedUser: null as User | null,

      confirmedDelete: false as boolean,
      isLoading: false as boolean,

      userData: {} as User,

      SearchErrors: '' as string,
      successMessage: '' as string,
      errorMessage: '' as string,
      searchInput: '' as string,

      options: [{ Label: 'პირადი ნომერი', Value: 'publicNumber' }, { Label: 'მობილური ნომერი', Value: 'phoneNumber' }] as SearchOptions[],
      selectedOption: 'publicNumber' as string
    }
  },
  created() {
    this.userData = store.getters.GetUser
  },
  mounted() {
    this.loadUser()
  },
  methods: {
    handleSearch(event: any) {
      this.searchInput = event.searchInput;
      this.selectedOption = event.selectedOption;
      this.searchUser();
    },
    onInputCleared(event: any) {
      this.searchInput = '';
      this.loadUser();
    },

    searchUser(): void {
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

    addRemoveRoleValue(user: any, value: string): void {
      if (user.roles.includes(value)) {
        const index = user.roles.indexOf(value);
        user.roles.splice(index, 1);
      } else {
        user.roles.push(value);
      }
      this.updateUserRoles(user._id, user.roles)
    },

    // pagination
    setPageSize(size: number): void {
      this.pageSize = size;
      if (this.searchInput) {
        this.searchUser();
        return;
      }
      this.loadUser();
    },
    selectPage(page: number): void {
      this.page = page;
      if (this.searchInput) {
        this.searchUser();
        return;
      }
      this.loadUser();
    },

    // CRUD
    loadUser(): void {
      if (this.searchInput) {
        this.searchUser();
        return;
      }
      const params = {
        page: this.page,
        pageSize: this.pageSize,
      };

      this.isLoading = true;
      axios.get(getApiConnectionString() + '/admin/usermanagement/users', {
        params,
        withCredentials: true,

      }).then((results) => {
        this.isLoading = false;
        this.users = results.data.users;
        this.paginationData = results.data;
      }).catch(() => {
        this.isLoading = false;
      })
    },

    searchByPublicNumber(): void {
      this.isLoading = true;
      axios.get(getApiConnectionString() + '/admin/usermanagement/search/publicnum?publicNum=' + this.searchInput, { withCredentials: true },).then((results) => {
        this.users = []
        this.users.push(results.data.user);
        this.paginationData = results.data;
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      })
    },

    searchByPhoneNumber(): void {
      this.isLoading = true;
      axios.get(getApiConnectionString() + '/admin/usermanagement/search/phoneNum?phoneNum=' + this.searchInput, { withCredentials: true },).then((results) => {
        this.users = []
        this.users.push(results.data.user);
        this.paginationData = results.data;
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      })
    },

    updateUserRoles(_id: string, Roles: any): void {
      this.isLoading = true;

      axios.post(getApiConnectionString() + '/admin/usermanagement/setroles', { _id: _id, roles: JSON.stringify(Roles) }, { withCredentials: true },).then(() => {
        this.isLoading = false;
        this.selectedUser = null;
        this.successMessage = "მომხმარებელის როლი წარმატებით განახლდა!";
        this.loadUser();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
    },

    deleteUser(): void {
      this.isLoading = true;

      axios.post(getApiConnectionString() + '/admin/usermanagement/delete', { _id: this.selectedUser?._id }, { withCredentials: true },).then(() => {
        this.isLoading = false;
        this.selectedUser = null;
        this.successMessage = "მომხმარებელის წარმატებით წაიშალა!";
        this.loadUser();
      }).catch((error) => {
        this.errorMessage = error.response.data.message;
        this.isLoading = false;
      })
    }
  }
});
</script>