import { defineConfig } from "vite";
import ViteSassPlugin from "vite-plugin-sass";
import handlebars from "vite-plugin-handlebars";
import { resolve } from 'path';


export default defineConfig({
    root: resolve(__dirname, 'src'),
    build: {
      outDir: '../dist',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.html')
        },
      },
    },
    plugins: [
      handlebars(),
      ViteSassPlugin(),
    ],
    assetsInclude: ['**/static/**'],
});
