<template>
  <div class="mt-2 d-flex flex-column align-self-center justify-content-center">
    <img class="align-self-center text-nowrap" src="@/assets/images/sangu.png" width="120" height="120" alt="logo">
    <span class="title text-center">SANGU</span>
    <span class="subTitle text-center">ციფრული ბიბლიოთეკა</span>
  </div>
</template>
<style scoped>
.title{
  color:#5A5A67;
  font-family: Tiro Devanagari Sanskrit;
  font-style: normal;
  font-weight: 400;
  font-size: 60.8px;
  letter-spacing: 0.055em;
}

.subTitle {
  color:#5A5A67;
  font-family: Tiro Devanagari Sanskrit;
  font-style: normal;
  font-size: 35px;
  letter-spacing: 0.3em;
  margin-top: -12px;
}

@media only screen and (max-width: 400px) {
  .title {
    font-size: 31.8px;

  }
  .subTitle {
    font-size: 21px;
  }
}
</style>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'titleBar',
  data() {
    return {}
  }
});
</script>