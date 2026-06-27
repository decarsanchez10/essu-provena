<template>
  <div class="fullscreen bg-white text-black flex flex-center" style="font-family: serif;">
    <div class="container text-center" style="max-width: 800px; width: 100%; padding: 20px;">
      <div
        class="bg-image"
        aria-hidden="true"
      >
        <h1 class="text-black" style="font-size: 8rem; margin: 0; padding-top: 2rem;">
          404
        </h1>
      </div>

      <div class="content-box">
        <h3 class="text-black text-bold q-mb-md">
          Look like you're lost
        </h3>
        <p class="text-black q-mb-lg" style="font-size: 1.2rem;">
          The page you are looking for is not available!
        </p>

        <q-btn
          color="positive"
          to="/verify"
          label="Go to Verify Page"
          class="q-mt-md q-mb-xl"
          style="background-color: #16a34a !important;"
          unelevated
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.bg-image {
  background-image: url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif');
  height: 400px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.content-box {
  margin-top: -50px;
}

@media (max-width: 600px) {
  .bg-image {
    height: 250px;
  }
  h1 {
    font-size: 5rem !important;
  }
  h3 {
    font-size: 1.8rem;
  }
}
</style>
