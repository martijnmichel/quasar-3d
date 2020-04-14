import { version } from "../package.json";

import Cube from "./components/Cube";
import Carousel from "./components/Carousel";
import Gallery from "./components/Gallery";

export { version, Cube, Carousel, Gallery };

export default {
  version,

  Cube,
  Carousel,
  Gallery,

  install(Vue) {
    Vue.component(Cube.name, Cube);
    Vue.component(Carousel.name, Carousel);
    Vue.component(Gallery.name, Gallery);
  },
};
