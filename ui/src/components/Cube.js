import gsap, { TweenMax, TweenLite, Back, Draggable } from "gsap/all";
gsap.registerPlugin(Draggable);
import { QBtn } from "quasar";
const _ = require("lodash");
const uniqid = require("uniqid");

export default {
  name: "QCube",

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
        class={`flex q-shape--container ${this.hideArrows ? "no-arrows" : ""}`}
      >
        {!this.hideArrows ? (
          <div class="side">
            <QBtn icon="chevron_left" id={`prev-${this.id}`} flat round />
          </div>
        ) : null}

        <div
          id={`shape-${this.id}`}
          class={{ "q-shape": true, cube: this.cube }}
        >
          {this.$slots.default}
        </div>
        {!this.hideArrows ? (
          <div class="side">
            <QBtn icon="chevron_right" id={`next-${this.id}`} flat round />
          </div>
        ) : null}
      </div>
    );
  },

  mounted() {
    const self = this;
    var $wrapper = document.getElementById(this.id);
    var $qshape = document.getElementById(`shape-${this.id}`);
    var $slides = $qshape.childNodes;

    // set the height of the container
    $qshape.style.height =
      parseInt($slides[0].getBoundingClientRect().height) + "px";

    var $container = $qshape;
    var $containerWidth = $container.offsetWidth;
    var $containerHeight = parseInt($slides[0].getBoundingClientRect().height);

    _.each($slides, (slide) => (slide.style.position = "absolute"));

    /***
     *
     *
     *
     */

    var lastX = 0;
    var direction;
    var animDirection;
    Draggable.create(document.createElement("div"), {
      trigger: $container,
      type: this.vertical ? "y" : "x",
      minimumMovement: 100,
      onDragStart: function () {
        if (inAnimation && inAnimation.isActive()) {
          // inAnimation.timeScale(10);
          // outAnimation.timeScale(10);
          TweenMax.to([inAnimation, outAnimation], 0.3, {
            timeScale: 10,
          });

          if (
            this.getDirection() === "left" ||
            this.getDirection() === "down"
          ) {
            nextSlide =
              slides[currentSlide.index - 1] || slides[slides.length - 1];
          } else {
            nextSlide = slides[currentSlide.index + 1] || slides[0];
          }
        } else if (
          this.getDirection() === "left" ||
          this.getDirection() === "down"
        ) {
          setSlide(slides[currentSlide.index - 1] || slides[slides.length - 1]);
        } else {
          setSlide(slides[currentSlide.index + 1] || slides[0]);
        }
      },
    });

    var inAnimation = null;
    var outAnimation = null;
    var nextSlide = null;

    /**
     *
     *
     *
     *
     */

    if (this.vertical) {
      TweenMax.set($container, { perspective: $containerHeight * 1.5 });
      TweenMax.set($slides, {
        backfaceVisibility: "hidden",
        transformOrigin: "50% 50% -" + $containerHeight / 2,
      });

      window.addEventListener("resize", function () {
        var $containerHeight = $container.offsetHeight;

        TweenMax.set($container, {
          perspective: $containerHeight * 1.5,
        });
        TweenMax.set($slides, {
          transformOrigin: "50% 50% -" + $containerHeight / 2,
        });
      });
    } else {
      TweenMax.set($container, { perspective: $containerWidth * 1.5 });
      TweenMax.set($slides, {
        backfaceVisibility: "hidden",
        transformOrigin: "50% 50% -" + $containerWidth / 2,
      });
      window.addEventListener("resize", function () {
        var $containerWidth = $container.offsetWidth;

        TweenMax.set($container, {
          perspective: $containerWidth * 1.5,
        });
        TweenMax.set($slides, {
          transformOrigin: "50% 50% -" + $containerWidth / 2,
        });
      });
    }

    TweenLite.defaultEase = Back.easeOut;

    var slideDelay = 1.5;
    var slideDuration = this.duration;

    var slideElements = $slides;
    var slides = Array.prototype.map.call(slideElements, createSlide);

    slides.forEach(function (slide, i) {
      slide.next = slides[i + 1] || slides[0];
      slide.duration = slideDuration;
    });

    if (!this.hideArrows) {
      document
        .getElementById(`prev-${this.id}`)
        .addEventListener("click", function () {
          setSlide(slides[currentSlide.index - 1] || slides[slides.length - 1]);
        });

      document
        .getElementById(`next-${this.id}`)
        .addEventListener("click", function () {
          setSlide(slides[currentSlide.index + 1] || slides[0]);
        });
    }

    var currentSlide = slides[0];

    //var autoPlay = TweenLite.delayedCall(slideDelay, setSlide);

    function setSlide(slide) {
      //autoPlay.restart(true);

      if (slide === currentSlide) {
        return;
      }

      if (currentSlide.index === 0 && slide.index === slides.length - 1) {
        currentSlide.setPrevInactive();
        currentSlide = slide;
        currentSlide.setPrevActive();
      } else if (
        currentSlide.index === slides.length - 1 &&
        slide.index === 0
      ) {
        currentSlide.setInactive();
        currentSlide = slide;
        currentSlide.setActive();
      } else if (slide.index < currentSlide.index) {
        currentSlide.setPrevInactive();
        currentSlide = slide;
        currentSlide.setPrevActive();
      } else {
        currentSlide.setInactive();
        currentSlide = slide;
        currentSlide.setActive();
      }
    }

    function createSlide(element, index) {
      var slide = {
        next: null,
        duration: 0,
        index: index,
        element: element,
        isActive: false,
        setActive: setActive,
        setInactive: setInactive,
        setPrevActive: setPrevActive,
        setPrevInactive: setPrevInactive,
      };

      if (index === 0) {
        setActive();
      } else {
        setInactive();
      }

      function setActive() {
        slide.isActive = true;
        if (self.vertical) {
          TweenLite.fromTo(
            element,
            slide.duration,
            { rotationX: -90, autoAlpha: 1 },
            { xPercent: 0, rotationX: 0 }
          );
        } else {
          TweenLite.fromTo(
            element,
            slide.duration,
            { rotationY: -90, autoAlpha: 1 },
            { xPercent: 0, rotationY: 0 }
          );
        }
      }

      function setPrevActive() {
        slide.isActive = true;
        if (self.vertical) {
          TweenLite.fromTo(
            element,
            slide.duration,
            { rotationX: 90, autoAlpha: 1 },
            { rotationX: 0 }
          );
        } else {
          TweenLite.fromTo(
            element,
            slide.duration,
            { rotationY: 90, autoAlpha: 1 },
            { rotationY: 0 }
          );
        }
      }

      function setInactive() {
        slide.isActive = false;
        if (self.vertical) {
          TweenLite.to(element, slide.duration, {
            rotationX: 90,
            onComplete: setAlpha,
          });
        } else {
          TweenLite.to(element, slide.duration, {
            rotationY: 90,
            onComplete: setAlpha,
          });
        }
      }

      function setPrevInactive() {
        slide.isActive = false;
        if (self.vertical) {
          TweenLite.to(element, slide.duration, {
            rotationX: -90,
            onComplete: setAlpha,
          });
        } else {
          TweenLite.to(element, slide.duration, {
            rotationY: -90,
            onComplete: setAlpha,
          });
        }
      }

      function setAlpha() {
        var $this = this.target;
        TweenMax.set($this, { autoAlpha: 0 });
      }

      return slide;
    }
  },
};
