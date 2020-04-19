export default {

  mode: 'spa',

  css: [
    '~/assets/css/main.less',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  head: {
    title: 'test-decentury',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
  },

  plugins: [
    {src: '~/plugins/api', ssr: false},
    {src: '~/plugins/iview', ssr: false},
    {src: '~/plugins/fontawesome', ssr: false}
  ],

  build: {
    extend(config, ctx) {
      ctx.loaders.less.javascriptEnabled = true
    },
    cache: true,
  },

  generate: {
    fallback: true,
  },

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    retry: false,
    baseURL: 'https://phone-book-decentury.herokuapp.com/api/',
  }
}

