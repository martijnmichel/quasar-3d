<template>
  <q-page padding>
    <div class="row q-col-gutter-xl">
      <div class="col-6">
        <q-cube hide-arrows>
          <q-card v-for="index in 5" :key="index" class="slide">
            <img src="https://cdn.quasar.dev/img/mountains.jpg" />

            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </q-card-section>
          </q-card>
        </q-cube>
      </div>
      <div class="col-6">
        <q-cube vertical>
          <q-card class="slide" v-for="index in 10" :key="`s-${index}`">
            <img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

            <q-card-section>
              <q-btn
                fab
                color="primary"
                icon="place"
                class="absolute"
                style="top: 0; right: 12px; transform: translateY(-50%);"
              />

              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  Cafe Basilico
                </div>
                <div
                  class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                >
                  <q-icon name="place" />
                  250 ft
                </div>
              </div>

              <q-rating v-model="stars" :max="5" size="32px" />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-subtitle1">
                $・Italian, Cafe
              </div>
              <div class="text-caption text-grey">
                Small plates, salads & sandwiches in an intimate setting.
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn flat round icon="event" />
              <q-btn flat color="primary">
                Reserve
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-cube>
      </div>
      <div class="col-6"></div>
      <div class="col-12">
        <q-cube>
          <q-editor v-model="editor" style="width: 100%" min-height="10rem" />

          <q-card flat bordered>
            <q-card-section>
              <pre style="white-space: pre-line">{{ editor }}</pre>
            </q-card-section>
          </q-card>

          <q-card flat bordered>
            <q-card-section v-html="editor" />
          </q-card>
        </q-cube>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      stars: 4,
      editor: "3d animate an <b>editor</b>!"
    };
  }
};
</script>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>
