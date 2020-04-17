import { version } from "../package.json";

import Cube from "./components/Cube";
import Carousel from "./components/Carousel";
import Gallery from "./components/Gallery";
import Switch from "./components/Switch";

export { version, Cube, Carousel, Gallery, Switch };

export default {
  version,

  Cube,
  Carousel,
  Gallery,
  Switch,

  install(Vue) {
    Vue.component(Cube.name, Cube);
    Vue.component(Carousel.name, Carousel);
    Vue.component(Gallery.name, Gallery);
    Vue.component(Switch.name, Switch);
  },
};
