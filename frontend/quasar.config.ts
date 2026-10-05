import { defineConfig } from '#q-app/wrappers'

export default defineConfig(() => {
  return {
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      vueRouterMode: 'hash',
    },
    devServer: {
      open: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
    framework: {
      config: {
        notify: {
          position: 'top-right',
        },
      },
      plugins: ['Notify', 'Dialog'],
    },
    animations: [],
  }
})
