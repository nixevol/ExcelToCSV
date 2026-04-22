import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

createApp(App).use(i18n).mount("#app");
