<template >
  <div class="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-image ">
    <div class="container-xl">
      <img class="mx-auto d-block" src="@/assets/images/sangu.png" width="144" height="144" alt="logo">
      <div class="row justify-content-center">
        <div class="card mt-3 login-container col-lg-7 col-md-6 col-sm-8">
          <div class="card-body d-flex flex-column align-items-center">
            <form id="mainform" class="form-group w-75 d-flex flex-column">
              <div class="mb-3 w-100 align-self-center" >
                <input v-bind:disabled="loggingIn" id="loginEmailInput" class="w-100 input_animated" type="email"
                  name="email" placeholder="ელ-ფოსტა" autocomplete="email" v-model="email" required>
              </div>
              <div class="mb-3 w-100 align-self-center">
                <input v-bind:disabled="loggingIn" id="loginPasswordInput" class="w-100 input_animated" type="password"
                  name="password" placeholder="პაროლი" v-model="password" pattern="[a-z0-5]{8,}" required
                  autocomplete="current-password">
              </div>
              <div>
                <a v-bind:disabled="loggingIn" href="https://ums.sangu.edu.ge/#!/reset" class="url">დაგავიწყდათ
                  პაროლი?</a>
              </div>
              <button id="loginButton" name="login" v-bind:disabled="loggingIn" class="mt-5 button_transparent align-self-center"
                @click="Login()">{{ loginText }}</button>
            </form>
          </div>
        </div>
        <div v-if="showAlert" class="mt-3 col-lg-8 col-md-10 col-sm-12 d-flex flex-column">
          <div v-on:click="showAlert = !showAlert"
            class="p-3 alert alert-danger alert-dismissible fade show align-self-center col-lg-7 col-md-6 col-sm-8"
            role="alert">
            <i class="p-1 bi bi-info-circle-fill"></i>
            <strong class="text-break text-sm-center text-md-left text-sm" style="font-size: 0.9rem">{{ alertMessage
            }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style src="@/assets/css/pages/loginpage.css" scoped/>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store';

export default defineComponent({
  data() {
    return {
      loginText: 'შესვლა' as String,
      email: '' as String,
      password: '' as String,
      showAlert: false as boolean,
      waitingForResponse : false as boolean,
      alertMessage: 'ელ.ფოსტა ან პაროლი ცარიელია' as String,
      loggingIn: false as boolean
    }
  },
  mounted () {
    const form : any = document.getElementById('mainform') || null;

    form.addEventListener('submit', async (event : any) => {
      event.preventDefault(); 
      this.Login();
    });
  },
  methods: {
    Login() : void {

      if (this.email && this.password) {
        if(this.loggingIn)
        {
          return;
        }
        this.waitingForResponse = true;
        this.loginText = "იტვირთება...";
        this.loggingIn = true;

        store.dispatch('Login', { email: this.email, password: this.password })
          .then(() => {
            this.$router.push({ path: '/' });
          })
          .catch((error : any) => {
            this.alertMessage = error.response.data.message;
            this.loginText = "შესვლა";
            this.waitingForResponse = false;
            this.showAlert = true;

            this.loggingIn = false;
          });
      }
      else {
        this.showAlert = true;
        this.alertMessage = 'ელ.ფოსტა ან პაროლი ცარიელია';
      }
    }
  },
});
</script>