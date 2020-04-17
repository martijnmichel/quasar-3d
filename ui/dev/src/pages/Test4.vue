<template>
  <q-page padding>
    <q-switch3d width="300px">
      <q-card square v-for="index in 20" :key="`s${index}`" class="slide">
        <q-img
          :ratio="4 / 3"
          src="https://upload.wikimedia.org/wikipedia/en/a/ac/TheBeatles-YellowSubmarinealbumcover.jpg"
        >
        </q-img>
      </q-card>
    </q-switch3d>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      stars: 4,
      editor: "3D animate an <b>editor</b>!"
    };
  },
  methods: {}
};
</script>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>
