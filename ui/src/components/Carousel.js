import gsap, { TweenMax, TweenLite, Back, Draggable } from "gsap/all";

gsap.registerPlugin(Draggable);
import { QBtn } from "quasar";
const _ = require("lodash");
const uniqid = require("uniqid");

export default {
  name: "QCarousel3d",

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
  },

  methods: {},

  render(h) {
    return (
      <div
        id={this.id}
        style={{ width: this.width }}
        class={`q-carousel3d--container ${this.hideArrows ? "no-arrows" : ""}`}
      >
        <div id={`carousel3d-${this.id}`} class={{ "q-carousel3d": true }}>
          {this.$slots.default}
        </div>
        {!this.hideArrows ? (
          <div class="controls flex flex-center">
            <div class="side">
              <QBtn icon="chevron_left" id={`prev-${this.id}`} flat round />
            </div>
            <div class="side">
              <QBtn icon="chevron_right" id={`next-${this.id}`} flat round />
            </div>
          </div>
        ) : null}
      </div>
    );
  },

  mounted() {
    //var $wrapper = document.getElementById(this.id);
    var $qshape = document.getElementById(`carousel3d-${this.id}`);
    var $slides = $qshape.childNodes;
    console.log($slides);

    // set the height of the container
    $qshape.style.height =
      parseInt($slides[0].getBoundingClientRect().height) + "px";

    var $container = $qshape;
    var $containerWidth = $container.offsetWidth;
    var $containerHeight = parseInt($slides[0].getBoundingClientRect().height);

    _.each($slides, (slide) => (slide.style.position = "absolute"));

    TweenLite.set($qshape, {
      css: {
        perspective: $containerWidth * 1.5,
        transformStyle: "preserve-3d",
      },
    });

    $slides.forEach(function (element, index) {
      console.log(index);
      TweenLite.set(element, {
        css: {
          transformOrigin: "50% 50% -" + $slides.length * ($containerWidth / 5),
          rotationY: (index * 360) / $slides.length,
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

    function snap(x) {
      return Math.round(x / rotationSnap) * rotationSnap;
    }

    document
      .getElementById(`prev-${this.id}`)
      .addEventListener("click", function () {
        xDrag += rotationSnap;
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: (index * 360) / $slides.length + snap(xDrag) / 4,
            },
          });
        });
      });

    document
      .getElementById(`next-${this.id}`)
      .addEventListener("click", function () {
        xDrag -= rotationSnap;
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: (index * 360) / $slides.length + snap(xDrag) / 4,
            },
          });
        });
      });

    Draggable.create(document.createElement("div"), {
      trigger: $container,
      onDragEnd: function () {
        let { x } = this;
        $slides.forEach(function (element, index) {
          TweenMax.to(element, 0.3, {
            css: {
              rotationY: (index * 360) / $slides.length + snap(x) / 4,
            },
          });
        });
      },

      type: "x",
      onDrag: function () {
        const x = this.x;
        xDrag = x;
        const { getDirection } = this;
        $slides.forEach(function (element, index) {
          TweenMax.set(element, {
            css: {
              rotationY: (index * 360) / $slides.length + x / 4,
            },
          });
        });
      },
    });
  },
};
