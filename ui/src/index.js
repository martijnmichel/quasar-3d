import { version } from "../package.json";

import Cube from "./components/Cube";

export { version, Cube };

export default {
  version,

  Cube,

  install(Vue) {
    Vue.component(Cube.name, Cube);
  },
};
