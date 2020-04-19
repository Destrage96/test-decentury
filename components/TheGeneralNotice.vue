<template>
  <div class="general-notice__container">

  </div>
</template>

<script>
  import {mixinEventId} from '~/lib/mixins/event-ids';

  export default {
    name: 'general-notice',
    mixins: [mixinEventId],

    mounted() {
      this.$root.$on(this.EVENT_ID_ALERT_SHOW, this.$_onShowNotice);
      this.$root.$on(this.EVENT_ID_ALERT_CLOSE, this.$_onCloseNotice);
    },

    beforeDestroy() {
      this.$root.$off(this.EVENT_ID_ALERT_SHOW);
      this.$root.$off(this.EVENT_ID_ALERT_CLOSE);
    },

    methods: {
      $_onCloseNotice(name) {
        if (name && name.length > 0) {
          this.$Notice.close(name);
        } else {
          this.$Notice.destroy();
        }
      },

      $_onShowNotice({name, type, title, text, duration = 5}) {
        let notice = this.$Notice.open;
        switch (type) {
          case 'error':
            notice = this.$Notice.error;
            break;
          case 'success':
            notice = this.$Notice.success;
            break;
        }

        let options = {
          title: title,
          desc: text,
          duration: duration,
        };

        if (name && name.length > 0) {
          options.name = name;
        }

        notice(options)
      }
    }
  };
</script>
