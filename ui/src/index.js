import { version } from "../package.json";

import Cube from "./components/Cube";
import Carousel from "./components/Carousel";

export { version, Cube, Carousel };

export default {
  version,

  Cube,
  Carousel,

  install(Vue) {
    Vue.component(Cube.name, Cube);
    Vue.component(Carousel.name, Carousel);
  },
};
