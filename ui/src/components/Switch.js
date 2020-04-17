import gsap, {
  TweenMax,
  TweenLite,
  Back,
  Draggable,
  Power4,
  TimelineMax,
  SlowMo,
  Linear,
} from "gsap/all";

gsap.registerPlugin(Draggable);
import { QBtn } from "quasar";
const _ = require("lodash");
const uniqid = require("uniqid");

export default {
  name: "QSwitch3d",

  data() {
    return {
      tlProgress: 0,
      id: uniqid(),
    };
  },

  props: {
    // animation duration
    duration: {
      type: Number,
      default: 0.3,
    },
    width: {
      type: String,
      default: "100%",
    },
    scale: {
      type: Number,
      default: 1.1,
    },
  },

  methods: {},

  render(h) {
    let { id } = this;
    let { $slots } = this;
    let { width } = this;
    const { scale, duration } = this;

    function controls() {
      return h(
        "div",
        {
          class: "controls flex flex-center",
        },
        [
          h(
            "div",
            {
              class: "side",
            },
            [
              h(QBtn, {
                attrs: {
                  id: `prev-${id}`,
                  icon: "chevron_left",
                  flat: true,
                  round: true,
                },
              }),
            ]
          ),
          h(
            "div",
            {
              class: "side",
            },
            [
              h(QBtn, {
                attrs: {
                  id: `next-${id}`,
                  icon: "chevron_right",
                  flat: true,
                  round: true,
                },
              }),
            ]
          ),
        ]
      );
    }

    function items() {
      return $slots.default.map((node, index) => {
        console.log(node);
        return h(
          "div",
          {
            class: "album",
          },
          [
            node,
            h("div", { class: "right" }),
            h("div", { class: "left" }),
            h("div", { class: "top" }),
            ,
            h("div", { class: "bottom" }),
          ]
        );
      });
    }

    return h(
      "div",

      {
        class: `q-switch3d--container`,
        attrs: {
          id: id,
        },
        style: {
          width: width,
        },
      },

      [
        h(
          "div",
          {
            class: "q-switch3d row",
            attrs: {
              id: `switch3d-${id}`,
            },
          },
          $slots.default
        ),
        controls(),
      ]
    );
  },

  mounted() {
    this.$nextTick(() => {
      const self = this;
      const { id } = this;
      let progress = 2;
      var $wrapper = document.getElementById(this.id);
      var $qshape = document.getElementById(`switch3d-${this.id}`);
      var $slides = $qshape.childNodes;

      // set the height of the container
      $qshape.style.height =
        parseInt($slides[0].getBoundingClientRect().height) + "px";

      var $container = $qshape;
      var $containerWidth = $container.offsetWidth;
      var $containerHeight = parseInt(
        $slides[0].getBoundingClientRect().height
      );

      _.each($slides, (slide) => (slide.style.position = "absolute"));

      document
        .getElementById(`prev-${this.id}`)
        .addEventListener("click", function () {
          activeItem--;
          _.each(items, (slide, index) =>
            index === activeItem ? slide.setActive() : ""
          );
        });

      document
        .getElementById(`next-${this.id}`)
        .addEventListener("click", function () {
          activeItem++;
          _.each(items, (slide, index) =>
            index === activeItem ? slide.setActive() : ""
          );
        });

      let activeItem = -1;

      /**
       *
       *
       *
       *
       */

      TweenMax.set($container, {
        perspective: $containerWidth * 2.5,
        transformStyle: "preserve-3d",
        marginTop: $containerHeight * 0.35,
        marginBottom: $containerHeight * 0.35,
      });
      TweenMax.set($slides, {
        backfaceVisibility: "hidden",
        transformOrigin: "0% 50%",
      });

      //TweenLite.defaultEase = Back.easeOut;

      let y = [];
      let tl = new TimelineMax({
        repeat: -1,
        smoothChildTiming: true,
      });

      //tl.pause();

      let xDrag = 0;
      let transformMap = [];
      let items = [];

      class Item {
        active = false;
        index = 0;
        el = undefined;
        prevTransform = undefined;
        constructor(index, element) {
          this.index = index;
          this.el = element;
        }
      }

      _.each($slides, (slide, index) => {
        items.push(new Item(index, slide));
      });

      _.each(items, (slide, index) => {
        Draggable.create(document.createElement("div"), {
          trigger: slide.el,
          type: "x",
          force3D: true,
          onDrag: function () {
            tl.time(this.x / 10 + 100000);
          },
          onClick: function () {
            console.log(this);
            let activeItem = _.find(items, (item) => item.active);
            if (activeItem && this.vars.trigger !== activeItem.el) {
              console.log("active item found");
              TweenMax.to(activeItem.el, 0.2, {
                x: 0,
                z: 0,

                rotationY: activeItem.prevRotationY,
              });
              activeItem.active = false;
            }

            transformMap = _.each(items, (slide) => {
              if (!slide.active)
                slide.prevRotationY = gsap.getProperty(slide.el, "rotationY");
            });

            tl.pause();
            slide.active = true;
            console.log(items);

            TweenMax.to(slide.el, 0.7, {
              z: Math.sin(slide.prevRotationY) + 100,
              x: Math.sin(slide.prevRotationY) + 100,
            });
          },
        });

        tl.addLabel(`slide${index}`, index);
        tl.fromTo(
          slide.el,
          {
            css: {
              rotationY: (360 / $slides.length) * index,
            },
          },
          {
            css: {
              rotationY: (360 / $slides.length) * index + 359,
            },
            duration: 100,
            ease: "none",
          },
          0
        );
      });
    });
  },
};
