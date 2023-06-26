<template>
  <div v-show="showLogoutMessage" class="overlay overlay-sm overlay-dark">
    <div style="background-color: #413c4e;" class="d-flex w-75 shadow-sm d-flex flex-column gap-3 p-3 rounded align-items-center justify-content-center">
      <h2 class="text-light">სესიას ვადა გაუვიდა!</h2>
      <span>ავტორიზაცია თავიდან გაიარეთ!</span>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  color: white;
}

.overlay-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

}

.overlay-dark {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Adjust the opacity as desired */
  pointer-events: auto;
  color: white;
  z-index: 999999999;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters } from 'vuex';

export default defineComponent({
  name: 'SessionTimer',
  computed: {
    ...mapState(['user']),
    ...mapGetters(['GetActiveInfo']),
  },
  data() {
    return {
      showLogoutMessage: false,
      timer: null as any,
    };
  },
  created() {
    setInterval(() => {
      this.checkSessionStatus();
    }, 1000); 
  },
  destroyed() {
    this.stopTimer();
  },
  methods: {
    getTimeLeftInMinutes(timeoutDate: any) {
      var tbilisiTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Tbilisi" });
      var tbilisiTimeObject = new Date(tbilisiTime);

      var timeoutTime = new Date(timeoutDate);

      var timeDiff = timeoutTime.getTime() - tbilisiTimeObject.getTime();

      var timeLeftInMinutes = Math.floor(timeDiff / (1000 * 60));
      return timeLeftInMinutes;
    },
    checkSessionStatus() {
      if (this.GetActiveInfo !== null && !this.showLogoutMessage) {
        let time : any = this.getTimeLeftInMinutes(this.GetActiveInfo.timeout)

        if(time <= 1)
        {
          this.showLogoutMessage = true;
          this.stopTimer()
        }
      }
      else {
        this.showLogoutMessage = true;
        this.stopTimer()
      }
    },
    stopTimer() {
      clearInterval(this.timer);
    }
  },
});
</script>
