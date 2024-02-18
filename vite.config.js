import { defineConfig } from "vite";
import ViteSassPlugin from "vite-plugin-sass";
import handlebars from "vite-plugin-handlebars";
import { resolve } from 'path';


export default defineConfig({
    build: {
      outDir: '.dist',
      assetsDir: '.',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/pages/home/main/index.html'),
          profile: resolve(__dirname, 'src/pages/home/profile/profile.html'),
          error: resolve(__dirname, 'src/pages/errors/error.html'),
          editProfile: resolve(__dirname, 'src/pages/home/profile/edit_profile.html'),
          editPassword: resolve(__dirname, 'src/pages/home/profile/edit_password.html'),
          login: resolve(__dirname, 'src/pages/home/loginup/login.html'),
          registration: resolve(__dirname, 'src/pages/home/loginup/registration.html'),
        },
      },
    },

    plugins: [
      ViteSassPlugin(),
      handlebars(),
    ],
});