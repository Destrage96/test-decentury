import phones from '../api/phones';

export default $axios => ({
  phones: phones($axios),
})
