import { defineConfig } from "vite";
import ViteSassPlugin from "vite-plugin-sass";
import handlebars from "vite-plugin-handlebars";


export default defineConfig({
    plugins: [
      ViteSassPlugin(),
      handlebars(), 
    ],
});