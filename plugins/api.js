import api from '../lib/api'

export default (ctx, inject) => {
  inject('api', api(ctx.$axios))
}
