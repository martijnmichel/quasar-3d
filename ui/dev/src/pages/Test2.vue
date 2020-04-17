<template>
  <q-page padding>
    <q-carousel3d vertical width="300px">
      <q-card v-for="index in 5" :key="index" class="slide">
        <img src="https://cdn.quasar.dev/img/mountains.jpg" />

        <q-card-section>
          <div class="text-h6">Our Changing Planet {{ index }}</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </q-card-section>
      </q-card>
    </q-carousel3d>

    <q-carousel3d vertical>
      <q-card class="my-card shadow-24" v-for="index in 20" :key="`s-${index}`">
        <q-img src="https://cdn.quasar.dev/img/parallax1.jpg" height="250px" />
      </q-card>
    </q-carousel3d>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      stars: 4,
      editor: "3D animate an <b>editor</b>!"
    };
  }
};
</script>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>
