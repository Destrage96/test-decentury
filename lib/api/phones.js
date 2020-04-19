export default $axios => ({
  async fetchList() {
    try {
      const list = await $axios.$get('pb');
      if (typeof (list) === 'object') {
        return {
          list: Object.values(list),
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async getPhone(phone_id) {
    try {
      let phone = await $axios.$get('pb/' + phone_id);
      return phone;
    } catch (error) {
      throw error;
    }
  },

  async save(data) {
    try {
      await $axios.$post('pb', data);
    } catch (error) {
      throw error;
    }
  },

  async edit({form}) {
    try {
      await $axios.$put('pb', form);
    } catch (error) {
      throw error;
    }
  },

  async delete(phone) {
    try {
      await $axios.$delete('pb/' + phone);
    } catch (error) {
      throw(error);
    }
  }
});
