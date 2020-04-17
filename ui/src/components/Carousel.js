import gsap, { TweenMax, TweenLite, Back, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable);
import { QBtn } from "quasar";
const _ = require("lodash");
const uniqid = require("uniqid");

export default {
  name: "QCarousel3d",

  data() {
    return {
      nextFn: undefined,
      id: uniqid(),
    };
  },

  props: {
    // animation duration
    duration: {
      type: Number,
      default: 0.7,
    },

    hideArrows: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "100%",
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      default: 5,
    },
  },

  methods: {},

  render(h) {
    let { hideArrows } = this;
    let { id } = this;
    let { $slots } = this;
    let { width } = this;

    function controls() {
      if (!hideArrows) {
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
    }

    return h(
      "div",

      {
        class: `q-carousel3d--container ${hideArrows ? "no-arrows" : ""}`,
        attrs: {
          id: id,
        },
      },

      [
        h(
          "div",
          {
            class: "q-carousel3d",
            attrs: {
              id: `carousel3d-${id}`,
            },
            style: {
              maxWidth: width,
            },
          },
          $slots.default
        ),
        controls(),
      ]
    );
  },

  beforeDestroy() {
    gsap.ticker.remove(this.nextFn);
  },

  mounted() {
    let m = 0; // autoplay counter
    const { vertical } = this;
    var $wrapper = document.getElementById(this.id);
    var $qshape = document.getElementById(`carousel3d-${this.id}`);
    var $slides = $qshape.childNodes;

    // set the height of the container

    var $container = $qshape;
    var $containerWidth = $container.offsetWidth;
    var $containerHeight = 0;

    _.each($slides, (slide) => {
      let height = parseInt(slide.getBoundingClientRect().height);
      console.log(height);
      if (height > $containerHeight) $containerHeight = height;
      slide.style.position = "absolute";
    });
    $qshape.style.height = $containerHeight + "px";

    TweenLite.set($qshape, {
      css: {
        perspective: !vertical ? $containerWidth : $containerHeight,
        transformStyle: "preserve-3d",
      },
    });

    let margin = ($slides.length / Math.PI) * ($containerHeight / 3);
    console.log(margin);

    TweenLite.set($wrapper, {
      css: {
        marginTop: vertical ? `${margin}px` : null,
        marginBottom: vertical ? `${margin}px` : null,
      },
    });

    $slides.forEach(function (element, index) {
      TweenLite.set(element, {
        css: {
          transformOrigin:
            "50% 50% -" +
            $slides.length *
              (vertical ? $containerHeight / 5 : $containerWidth / 5),
          rotationY: !vertical ? (index * 360) / $slides.length : 0,
          rotationX: vertical ? (index * 360) / $slides.length : 0,
        },
      });
      /*
      TweenMax.to(element, 2, {
        css: {
          z: 0.01,
          rotationY: "+=359",
        },
        //ease: Linear.easeNone,
      });
      */
    });

    const rotationSnap = (360 / $slides.length) * 4;
    let xDrag = 0;
    let yDrag = 0;

    function snap(x) {
      return Math.round(x / rotationSnap) * rotationSnap;
    }

    function rotateItem(index, val) {
      return (index * 360) / $slides.length + snap(val) / 4;
    }

    document
      .getElementById(`prev-${this.id}`)
      .addEventListener("click", function () {
        xDrag += rotationSnap;
        yDrag += rotationSnap;
        m = 0; // autoplay counter
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: !vertical ? rotateItem(index, xDrag) : 0,
              rotationX: vertical ? rotateItem(index, yDrag) : 0,
            },
          });
        });
      });

    document
      .getElementById(`next-${this.id}`)
      .addEventListener("click", function () {
        xDrag -= rotationSnap;
        yDrag -= rotationSnap;
        m = 0; // autoplay counter
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: !vertical ? rotateItem(index, xDrag) : 0,
              rotationX: vertical ? rotateItem(index, yDrag) : 0,
            },
          });
        });
      });

    if (this.autoplay) {
      gsap.ticker.add(next);
      gsap.ticker.fps(60);
    }

    const { speed } = this;
    function next() {
      m++;
      if (m === speed * 60) {
        xDrag -= rotationSnap;
        yDrag -= rotationSnap;
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: !vertical ? rotateItem(index, xDrag) : 0,
              rotationX: vertical ? rotateItem(index, yDrag) : 0,
            },
          });
        });
        m = 0;
      }
    }

    this.nextFn = next;

    $container.addEventListener("mouseenter", (event) => {
      m = 0;
      gsap.ticker.remove(next);
      this.nextFn = next;
    });
    $container.addEventListener("mouseleave", (event) => {
      m = 0;
      gsap.ticker.add(next);
      this.nextFn = next;
    });

    Draggable.create(document.createElement("div"), {
      trigger: $container,
      onDragEnd: function () {
        let { x } = this;
        let { y } = this;
        m = 0; // autoplay counter
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: !vertical ? rotateItem(index, xDrag) : 0,
              rotationX: vertical ? rotateItem(index, yDrag) : 0,
            },
          });
        });
      },

      type: vertical ? "y" : "x",
      onDrag: function () {
        const x = this.x;
        const y = this.y;
        xDrag = x;
        yDrag = y;
        m = 0; // autoplay counter
        const { getDirection } = this;
        $slides.forEach(function (element, index) {
          TweenMax.set(element, {
            css: {
              rotationY: !vertical ? (index * 360) / $slides.length + x / 4 : 0,
              rotationX: vertical ? (index * 360) / $slides.length + y / 4 : 0,
            },
          });
        });
      },
    });
  },
};
