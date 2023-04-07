<template>
  <!-- Begin, PC version -->
  <div id="hamburger" class="menu d-none d-md-block">
    <button  class="navbar-toggler" @click="toggleMenu()">
      <div class="hamburger">
        <figure :class="{ 'rotate': showMenu, 'endrotate': !showMenu }" id="hamburger_toggle"
          class="colorToggle bi bi-list icon" style=" font-size:2em"></figure>
      </div>
    </button>

    <div ref="element" id="hamburgerDisplay" class="hamburgerBackground menu" :class="{ 'show': showMenu }">
      <!-- Navbar links go here -->
      <div class="d-flex flex-column">
        <button @click="loadRoute('/user')" :class="{ 'selectedButton': $route.path === '/user' }"
          class="mt-5 hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
          <div class="menuButtonIcons">
            <img class="me-3 ms-1 rounded-circle" width="35" height="35" :src="userData.photo" />
          </div>
          <span>{{ userData.firstName + ' ' + userData.lastName }}</span>
        </button>

        <button @click="loadRoute('/')" :class="{ 'selectedButton': $route.path === '/' }"
          class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
          <div class="menuButtonIcons">
            <span class="bi bi-house me-3 ms-1" style="font-size: 2em;"></span>
          </div>
          <span class="mr-auto">მთავარი გვერდი</span>
        </button>

        <button @click="loadRoute('/petitions')" :class="{ 'selectedButton': $route.path === '/petitions' }"
          class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
          <div class="menuButtonIcons">
            <span class="bi bi-file-text me-3 ms-1" style="font-size: 2em;"></span>
          </div>
          <span class="mr-auto">განცხადებები</span>
        </button>

        <!-- Begin, Editor panel -->
        <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('editor') || userData.roles.includes('admin')">
          <button @click="loadRoute('/bookmanagement')" :class="{ 'selectedButton': $route.path === '/bookmanagement' }"
            class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
            <span class="bi bi-box-seam me-3 ms-1" style="font-size: 2em;"></span>
            <span class="mr-auto text-nowrap">რესურსების მენეჯმენტი</span>
          </button>
        </div>
        <button @click="loadRoute('/notificationmanagement')" v-if="userData.roles.includes('editor') || userData.roles.includes('admin')"
          :class="{ 'selectedButton': $route.path === '/notificationmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-app-indicator me-3 ms-1" style="font-size: 2em;"></span>
          <span class="mr-auto text-nowrap">შეტყობინებების მენეჯმენტი</span>
        </button>
        <!-- End, Editor panel -->

        <!-- Begin, Admin panel -->
        <div class="d-flex align-items-center flex-column">
          <button @click="loadRoute('/usermanagement')" v-if="userData.roles.includes('admin')" :class="{ 'selectedButton': $route.path === '/usermanagement' }"
            class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
            <span class="bi bi-person-circle me-3 ms-1" style="font-size: 2em;"></span>
            <span class="mr-auto text-nowrap">მომხმარებლის მენეჯმენტი</span>
          </button>
        </div>
        <!-- End, Admin panel -->
        
        <!-- Begin, Shared -->
        <button @click="loadRoute('/petitionsmanagement')" v-if="userData.roles.includes('employee') || userData.roles.includes('editor') || userData.roles.includes('admin')"
          :class="{ 'selectedButton': $route.path === '/petitionsmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-file-text me-3 ms-1" style="font-size: 2em;"></span>
          <span class="mr-auto text-nowrap">განცხადებების მენეჯმენტი</span>
        </button>
        <!-- End, Shared-->

        <button @click="LogOut()"
          class="w-100 hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
          <div class="menuButtonIcons">
            <span class="bi bi-door-open-fill me-3 ms-1" style="font-size: 2em;"></span>
          </div>
          <span class="mr-auto">გასვლა</span>
        </button>
      </div>
    </div>
  </div>
  <!-- End, PC version -->

  <!-- Begin, Mobile version -->
  <div ref="element" class="hamburgerBackground menuRight w-100" :class="{ 'showRight': showMobileMenu }">
    <!-- Navbar links go here -->
    <div class="d-flex flex-column">
      <button @click="loadRoute('/user')" :class="{ 'selectedButton': $route.path === '/user' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center">
        <img id="profileImage" class="me-2 ms-3" width="35" height="35" :src="userData.photo" />
        <span>{{ userData.firstName + ' ' + userData.lastName }}</span>
      </button>
      <div class="table-border"></div>
      <button @click="loadRoute('/petitions')" :class="{ 'selectedButton': $route.path === '/petitions' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center">
        <span class="bi bi-file-text me-3 ms-3" style="font-size: 2em;"></span>
        <span class="mr-auto">განცხადებები</span>
      </button>

      
      <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('editor') || userData.roles.includes('admin')">
        <button @click="loadRoute('/bookmanagement')" :class="{ 'selectedButton': $route.path === '/bookmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-box-seam me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">რესურსების მენეჯმენტი</span>
        </button>
      </div>

      <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('admin') || userData.roles.includes('editor') || userData.roles.includes('employee')">
        <button @click="loadRoute('/usermanagement')" :class="{ 'selectedButton': $route.path === '/usermanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-person-circle me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">მომხმარებლის მენეჯმენტი</span>
        </button>

        <button @click="loadRoute('/notificationmanagement')" v-if="userData.roles.includes('admin') || userData.roles.includes('editor')"
          :class="{ 'selectedButton': $route.path === '/notificationmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-app-indicator me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">შეტყობინებების მენეჯმენტი</span>
        </button>

        <button @click="loadRoute('/petitionsmanagement')" v-if="userData.roles.includes('admin') || userData.roles.includes('editor') || userData.roles.includes('employee')"
        :class="{ 'selectedButton': $route.path === '/petitionsmanagement' }"
        class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
        <span class="bi bi-journal-bookmark me-3 ms-3" style="font-size: 2em;"></span>
        <span class="mr-auto">განცხადებების მენეჯმენტი</span>
      </button>
    </div>
    <button @click="LogOut()" class="w-100 hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center">
      <span class="bi bi-door-open-fill me-3 ms-3" style="font-size: 2em;"></span>
      <span class="mr-auto">გასვლა</span>
    </button>
      
    </div>
  </div>

  <!-- Begin, mobile bottom menu -->
  <div class="d-block d-md-none fixed-bottom">
    <!-- Navbar links go here -->
    <div class="d-flex flex-row bottomMenu">
      <button @click="loadRoute('/')" :class="{ 'selectedButton': $route.path === '/' }"
        class="hamburgetButton  menuButton d-flex justify-content-center align-items-center w-25">
        <span class="bi bi-house me-3 ms-3" style="font-size: 2em;"></span>
      </button>

      <button @click="loadRoute('/petitions')" :class="{ 'selectedButton': $route.path === '/petitions' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex justify-content-center align-items-center w-25">
        <span class="bi bi-file-text me-2 ms-2" style="font-size: 2em;"></span>
      </button>

      <button @click="loadRoute('/notifications')" :class="{ 'selectedButton': $route.path === '/notifications' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex justify-content-center align-items-center w-25">
        <span class="bi bi-bell me-2 ms-2" style="font-size: 2em;"></span>
      </button>

      <button @click="showMobileMenu = !showMobileMenu"
        class="hamburgetButton colorToggle menuButton d-md-none d-flex justify-content-center align-items-center w-25">
        <span :class="{ 'rotate': showMobileMenu, 'endrotate': !showMobileMenu }" class="bi bi-list me-2 ms-3"
          style="font-size: 2em;"></span>
      </button>
    </div>
  </div>
  <!-- End, mobile bottom menu -->
  
  <!-- End, Mobile version -->
</template>
<style src="@/assets/css/components/hamburger.css" scoped/>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'hamburger',
  emits: ['click'],

  data() {
    return {
      hamburgerActive: false,
      showDropdown: false,
      showMenu: false,
      showMobileMenu: false,
      userData: {}
    }
  },
  created() {
    this.userData = this.$store.getters.GetUser
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  },
  setup() {
    const showMenu = ref(false);
    return { showMenu };
  },
  methods: {
    loadRoute(route) {
      this.$router.push({ path: route });
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
      this.$emit('click'); // Emit the 'click' event when the button is clicked
    },

    // closes the hamburger menu when mouse clicks outside of it.
    handleClickOutside(event) {
      if (this.$refs.element && !this.$refs.element.contains(event.target)) {
        if (event.target.id === 'hamburger_toggle') {
          return;
        }

        if (event.target.id === 'hamburgerDisplay') {
          return;
        }

        let elementName = event.target.tagName.toLowerCase();
        if (elementName === 'button' || elementName === 'span' || elementName === 'img') {
          return;
        }
        this.showMenu = false;
      }
    },
    LogOut() {
      this.$store.dispatch('Logout', { email: this.email, password: this.password })
        .then(() => {
          this.$router.push({ path: '/login' });
        })
        .catch(error => {
        })
    }
  }
});
</script>