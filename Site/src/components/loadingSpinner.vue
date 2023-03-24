<template>
  <div id="spinner-container">
  <div id="spinner-body" class="d-flex justify-content-center align-items-center text-light" >
    <div id="spinner" class="spinner-border d-flex justify-content-center align-items-center" role="status">
    </div>
  </div>
</div>
</template>
<style scoped>
#spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(41, 41, 41, 0.8);
  z-index: 9999;
}

#spinner-body {
  height: 100%;
}

#spinner {
  width: 6rem; 
  height: 6rem;

  color: #C63B31;
}

</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'loadingSpinner',
  data() {
    return {}
  }
});
</script>