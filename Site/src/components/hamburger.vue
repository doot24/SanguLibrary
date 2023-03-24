<template>
  <!-- Begin, PC version -->

  <div class="menu d-none d-md-block">
    <button class="navbar-toggler" @click="toggleMenu()">
      <div class="hamburger">
        <figure :class="{ 'rotate': showMenu, 'endrotate': !showMenu }" id="hamburger_toggle" class="colorToggle bi bi-list icon"
          style=" font-size:2em"></figure>
      </div>
    </button>

    <div ref="element" class="hamburgerBackground menu" :class="{ 'show': showMenu }">
      <!-- Navbar links go here -->
      <div class="d-flex flex-column">
<button @click="loadRoute('/user')" :class="{ 'selectedButton': $route.path === '/user' }"
  class="mt-5 hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
  <div class="menuButtonIcons">
    <img class="me-3 ms-3 rounded-circle" width="35" height="35" :src="userData.photo" />
  </div>
  <span>{{ userData.firstName + ' ' + userData.lastName }}</span>
</button>

<button @click="loadRoute('/')" :class="{ 'selectedButton': $route.path === '/' }"
  class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
  <div class="menuButtonIcons">
    <span class="bi bi-house-fill me-3 ms-3" style="font-size: 2em;"></span>
  </div>
  <span class="mr-auto">მთავარი გვერდი</span>
</button>

<button @click="loadRoute('/petitions')" :class="{ 'selectedButton': $route.path === '/petitions' }"
  class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
  <div class="menuButtonIcons">
    <span class="bi bi-plus me-2 ms-2" style="font-size: 3em;"></span>
  </div>
  <span class="mr-auto">განცხადებები</span>
</button>

<button @click="LogOut()" class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center position-relative">
  <div class="menuButtonIcons">
    <span class="bi bi-door-open-fill me-3 ms-3" style="font-size: 2em;"></span>
  </div>
  <span class="mr-auto">გასვლა</span>
</button>


        <!-- Begin, Editor panel -->
        <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('editor')">
          <button @click="loadRoute('/bookmanagement')" :class="{ 'selectedButton': $route.path === '/bookmanagement' }"
            class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
            <span class="bi bi-book-fill me-3 ms-3" style="font-size: 2em;"></span>
            <span class="mr-auto">წიგნების მენეჯმენტი</span>
          </button>
        </div>
        <!-- End, Editor panel -->

        <!-- Begin, Admin panel -->
        <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('admin')">
          <button @click="loadRoute('/usermanagement')" :class="{ 'selectedButton': $route.path === '/usermanagement' }"
            class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
            <span class="bi bi-person-circle me-3 ms-3" style="font-size: 2em;"></span>
            <span class="mr-auto">მომხმარებლის მენეჯმენტი</span>
          </button>
          <button @click="loadRoute('/notificationmanagement')"
            :class="{ 'selectedButton': $route.path === '/notificationmanagement' }"
            class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
            <span class="bi bi-app-indicator me-3 ms-3" style="font-size: 2em;"></span>
            <span class="mr-auto text-nowrap">შეტყობინებების მენეჯმენტი</span>
          </button>
          <button @click="loadRoute('/petitionsmanagement')"
            :class="{ 'selectedButton': $route.path === '/petitionsmanagement' }"
            class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
            <span class="bi bi-journal-bookmark me-3 ms-3" style="font-size: 2em;"></span>
            <span class="mr-auto text-nowrap">განცხადებების მენეჯმენტი</span>
          </button>
        </div>
        <!-- End, Admin panel -->
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
        <img id="profileImage" class="me-3 ms-3" width="35" height="35" :src="userData.photo" />
        <span>{{ userData.firstName + ' ' + userData.lastName }}</span>
      </button>
      <div class="table-border"></div>
      <button @click="loadRoute('/petitions')" :class="{ 'selectedButton': $route.path === '/petitions' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center">
        <span class="bi bi-plus me-2 ms-2" style="font-size: 3em;"></span>
        <span class="mr-auto">განცხადებები</span>
      </button>

      <button @click="LogOut()" class="hamburgetButton hamburgetButtonHover menuButton d-flex align-items-center">
        <span class="bi bi-door-open-fill me-3 ms-3" style="font-size: 2em;"></span>
        <span class="mr-auto">გასვლა</span>
      </button>

      <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('editor')">
        <button @click="loadRoute('/bookmanagement')" :class="{ 'selectedButton': $route.path === '/bookmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-book-fill me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">წიგნების მენეჯმენტი</span>
        </button>
      </div>

      <div class="d-flex align-items-center flex-column" v-if="userData.roles.includes('admin')">
        <button @click="loadRoute('/usermanagement')" :class="{ 'selectedButton': $route.path === '/usermanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-person-circle me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">მომხმარებლის მენეჯმენტი</span>
        </button>

        <button @click="loadRoute('/notificationmanagement')"
          :class="{ 'selectedButton': $route.path === '/notificationmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-app-indicator me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">შეტყობინებების მენეჯმენტი</span>
        </button>

        <button @click="loadRoute('/petitionsmanagement')"
          :class="{ 'selectedButton': $route.path === '/petitionsmanagement' }"
          class="w-100 hamburgetButtonHover hamburgetButton menuButton d-flex align-items-center">
          <span class="bi bi-journal-bookmark me-3 ms-3" style="font-size: 2em;"></span>
          <span class="mr-auto">განცხადებების მენეჯმენტი</span>
        </button>
      </div>

    </div>
  </div>

  <div class="d-block d-md-none fixed-bottom">
    <!-- Navbar links go here -->
    <div class="d-flex flex-row bottomMenu">
      <button @click="loadRoute('/')" :class="{ 'selectedButton': $route.path === '/' }"
        class="hamburgetButton  menuButton d-flex justify-content-center align-items-center w-25">
        <span class="bi bi-house-fill me-3 ms-3" style="font-size: 2em;"></span>
      </button>

      <button @click="loadRoute('/petitions')" :class="{ 'selectedButton': $route.path === '/petitions' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex justify-content-center align-items-center w-25">
        <span class="bi bi-plus me-2 ms-2" style="font-size: 3em;"></span>
      </button>

      <button @click="loadRoute('/notifications')" :class="{ 'selectedButton': $route.path === '/notifications' }"
        class="hamburgetButton hamburgetButtonHover menuButton d-flex justify-content-center align-items-center w-25">
        <span class="bi bi-bell me-2 ms-2" style="font-size: 2em;"></span>
      </button>

      <button @click="showMobileMenu = !showMobileMenu"
        class="hamburgetButton menuButton d-md-none d-flex justify-content-center align-items-center w-25">
        <span :class="{ 'rotate': showMobileMenu, 'endrotate': !showMobileMenu }" class="bi bi-list me-2 ms-3"
          style="font-size: 2em;"></span>
      </button>
    </div>
  </div>
  <!-- End, Mobile version -->
</template>
<style scoped>
.bottomMenu {
  background-color: rgba(35, 33, 40, 1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.selectedButton {
  background-color: #C63B31;
}
button.selectedButton,
button.selectedButton:active,
button.selectedButton:focus {
  background-color: #C63B31;
}

#profileImage {
  border-radius: 30px;
}

#profileButton {
  border: none;
}

.menuButton {
  height: 4em;
}

.navbar-toggler {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 101;
  position: fixed;
}

.menu {
  position: fixed;
  top: 0;
  left: -100%;
  width: 330px;
  height: 100%;
  z-index: 100;

  transition: all 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.menuRight {
  position: fixed;
  top: 0;
  right: -100%;
  width: 300px;
  height: 100%;
  z-index: 100;

  transition: all 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.showRight {
  right: 0;
}

.rotate {
  transform: rotate(90deg);
  transition: all 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.endrotate {
  transform: rotate(180deg);
  transition: all 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.show {
  left: 0;
}
</style>

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
      if (this.showMenu && this.$refs.element && !this.$refs.element.contains(event.target) && event.target.id !== 'hamburger_toggle') {
        this.showMenu = !this.showMenu;
      }
    },
    LogOut() {
      this.$store.dispatch('Logout', { email: this.email, password: this.password })
        .then(() => {
          this.$router.push({ path: '/login' });
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
});
</script>