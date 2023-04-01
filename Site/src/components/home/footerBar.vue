<template>
  <div>
    <!--Begin, Mobile Version-->
    <div class="d-block d-sm-block d-md-none">
      <div class="container-fluid mt-3 mb-5">
          <div class="background footer-section rounded p-2 mb-3">
            <div class="">
              <div class="light p-2">
                <h5 class="fw-bold mb-1">საკონტაქტო ინფორმაცია:</h5>
                <div class="text-muted py-1">598-30-53-63</div>
                <div class="text-muted py-1">library@sangu.edu.ge</div>
              </div>
            </div>
            <div class="mt-2">
              <div class="light p-2">
                <h5 class="fw-bold mx-auto  mb-1">ბიბლიოთეკის სამუშაო საათები:</h5>
                <div class="text-muted  py-1">ორშაბათიდან პარასკევის ჩათვლით, 09:00 საათიდან 20:00 საათამდე.
                </div>
                <div class="text-muted py-1">შაბათი 10:00 საათიდან 15:00 საათამდე.</div>
                <div class="text-muted  py-1">აკადემიური კალენდრისა (არდადეგები) და პანდემიით გამოწვული რისკების
                  გამო რიგ შემთხვევებში იცვლება სამუშაო საათები.</div>
              </div>
            </div>
            <div class="mt-2">
              <div class="light p-2 py-3 ">
                <h5 class="fw-bold">პროექტის ავტორები:</h5>
                <label class="text-muted d-block my-2">მარიამ დოხნაძე</label>
                <label class="text-muted d-block my-2">აკაკი ხურციძე</label>
                <label class="text-muted d-block my-2">მათე ასკილაშვილი</label>
              </div>
            </div>

          </div>
      </div>
    </div>
    <!--End, Mobile Version-->

    <!--Begin, PC Version-->
    <div class="d-none d-sm-none d-md-block">
      <div class="container-fluid mt-3">
          <div class="footer rounded p-2 ">
            <div class="">
              <div class="footer-section p-2">
                <h5 class="fw-bold mb-1">საკონტაქტო ინფორმაცია:</h5>
                <div class="text-muted py-1">598-30-53-63</div>
                <div class="text-muted py-1">library@sangu.edu.ge</div>
              </div>
            </div>
            <div class="mt-2">
              <div class="footer-section p-2">
                <h5 class="fw-bold mx-auto  mb-1">ბიბლიოთეკის სამუშაო საათები:</h5>
                <div class="text-muted  py-1">ორშაბათიდან პარასკევის ჩათვლით, 09:00 საათიდან 20:00 საათამდე.
                </div>
                <div class="text-muted py-1">შაბათი 10:00 საათიდან 15:00 საათამდე.</div>
                <div class="text-muted  py-1">აკადემიური კალენდრისა (არდადეგები) და პანდემიით გამოწვული რისკების
                  გამო რიგ შემთხვევებში იცვლება სამუშაო საათები.</div>
              </div>
            </div>
            <div class="mt-2">
              <div class="footer-section p-2 py-2">
                <h5 class="fw-bold">პროექტის ავტორები:</h5>
                <label class="text-muted d-block my-1">მარიამ დოხნაძე</label>
                <label class="text-muted d-block my-1">აკაკი ხურციძე</label>
                <label class="text-muted d-block my-1">მათე ასკილაშვილი</label>
              </div>
            </div>
          </div>
      </div>
    </div>
    <!--End, PC Version-->
  </div>
</template>

<style src="@/assets/css/components/footer.css" scoped>

</style>
  
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'footerBar',
  data() {
    return {}
  }
});
</script>