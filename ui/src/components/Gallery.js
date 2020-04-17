import gsap, { TweenMax, TweenLite, Back, Draggable, Power4 } from "gsap/all";

gsap.registerPlugin(Draggable);
import { QBtn } from "quasar";
const _ = require("lodash");
const uniqid = require("uniqid");

export default {
  name: "QGallery3d",

  data() {
    return {
      test: "sdf",
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

    function items() {
      return $slots.default.map((node, index) => {
        console.log(node);
        node.data.on = {
          click: () => {},
          mouseenter: () => {
            $slots.default.forEach((sibling) => {
              if (sibling !== node) {
                TweenMax.to(sibling.elm, {
                  opacity: 0.7,
                });
              }
            });
            TweenLite.set(node.elm, { zIndex: 10 });
            TweenMax.to(node.elm, duration, {
              scale: scale,
            });
          },
          mouseleave: () => {
            $slots.default.forEach((sibling) => {
              if (sibling !== node) {
                TweenMax.to(sibling.elm, {
                  opacity: 1,
                  ease: Power4.easeOut,
                });
              }
            });
            TweenLite.set(node.elm, { zIndex: 0 });
            TweenMax.to(node.elm, duration, { scale: 1 });
          },
        };
        return h(
          "div",
          {
            class: "col-4",
          },
          [node]
        );
      });
    }

    return h(
      "div",

      {
        class: `q-gallery3d--container`,
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
            class: "q-gallery3d row",
            attrs: {
              id: `gallery3d-${id}`,
            },
          },
          items()
        ),
      ]
    );
  },

  mounted() {
    //var $wrapper = document.getElementById(this.id);
    var $qshape = document.getElementById(`gallery3d-${this.id}`);
    var $items = $qshape.childNodes;

    var $container = $qshape;
    var $containerWidth = $container.offsetWidth;
    //var $containerHeight = parseInt($slides[0].getBoundingClientRect().height);

    TweenLite.set($qshape, {
      css: {
        perspective: $containerWidth * 1.5,
        transformStyle: "preserve-3d",
      },
    });
  },
};
