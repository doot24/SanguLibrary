<template>
  <div class="p-3 rounded d-flex flex-column">
    <div class="d-flex gap-2">
      <i class="category-icon bi bi-graph-up rounded p-2" style="font-size:1.3em;"></i>
      <span class="align-self-center category-text"> ყველაზე პოპულარული </span>
    </div>
    <div class="p-4 mt-3 rounded">
      <div :id="uniqueID" class="carousel slide d-flex flex-row" data-bs-ride="carousel">
        <div class="col-2 d-flex align-items-center justify-content-center">
          <button :data-bs-target="`#${uniqueID}`" class="rounded-circle carouselButton" data-bs-slide="prev">
            <span class="bi-caret-left-fill" aria-hidden="true"></span>
          </button>
        </div>
        <div class="carousel-inner d-flex">
          <div class="carousel-item active">
            <div class="d-flex gap-3">
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

            </div>
          </div>

          <div class="carousel-item ">
            <div class="d-flex flex-row gap-5">
              <div class="d-flex flex-row gap-3">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

              <div class="d-flex flex-row gap-5">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

              <div class="d-flex flex-row gap-3">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

              <div class="d-flex flex-row gap-3">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

              <div class="d-flex flex-row gap-3">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

              <div class="d-flex flex-row gap-3">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>

              <div class="d-flex flex-row gap-3">
                <img width="130" height="180"
                  src="https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fcovers_65158a31-bdc3-47b3-9c24-48513b30ee5a.png?alt=media&token=f6dc8835-c780-4f90-93e3-cea135caa5b4" />

              </div>
            </div>
          </div>
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
          <button :data-bs-target="`#${uniqueID}`" class="rounded-circle carouselButton" data-bs-slide="next">
            <span class="bi-caret-right-fill" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/components/carousel.css" scoped/>
<script>
import { defineComponent } from 'vue';
import uuid4 from "uuid4";

export default defineComponent({
  name: 'carousel',
  data() {
    return {
      uniqueID: 'c' + uuid4().replace(/-/g, '')
    }
  }
});
</script>