<template>
  <div class="phone-book__container">
    <h1 class="page-title">Телефонная книга</h1>
    <Row type="flex"
         justify="space-between"
         style="margin-bottom: 30px">

      <Col span="15" style="display: flex">
        <Input v-model="query"
               style="margin-right: 25px"
               placeholder="Поиск"/>

        <Button type="primary"
                style="margin-right: 20px"
                @click="$_onSearch">
          <font-awesome-icon fas icon="search"/>
        </Button>

        <Button type="primary" @click="$_onSearchClear">
          <span>Очистить</span>
        </Button>
      </Col>

      <Col span="6" style="display: flex; justify-content: flex-end">

        <Button type="primary" @click="$_onAdd">
          <font-awesome-icon fas icon="plus"/>
        </Button>
      </Col>
    </Row>

    <Table border
           :loading="isLoading"
           :columns="titles"
           :data="phones"
           size="default"
           stripe
           no-data-text="Нет данных">

      <template slot-scope="{row}" slot="name">
        <span>{{row.name}}</span>
      </template>

      <template slot-scope="{row}" slot="email">
        <span v-if="row.email">{{row.email}}</span>
        <span v-else>-</span>
      </template>

      <template slot-scope="{row}" slot="phone">
        <span v-if="row.phone">{{row.phone}}</span>
        <span v-else>-</span>
      </template>

      <template slot-scope="{index, row}" slot="actions">
        <div>
          <a @click="$_onEdit(index, row)" style="margin-right: 15px">
            <Tooltip content="Редактирование" placement="bottom-end">
              <font-awesome-icon fas icon="edit"/>
            </Tooltip>
          </a>

          <a @click="$_onDelete(index, row)">
            <Tooltip :content="'Удаление контакта'"
                     placement="bottom-end">
              <font-awesome-icon
                style="color: red"
                fas icon="trash-alt"/>
            </Tooltip>
          </a>
        </div>
      </template>
    </Table>

    <Drawer width="400" v-model="showForm" @on-close="showForm = false">
      <PhoneForm :phone="onSelectedPhone"
                 :readonly="readonly"
                 @on-save="$_onSave"/>
    </Drawer>
  </div>
</template>

<script>
  import PhoneForm from '../components/phone-form';
  import {mixinEventId} from '~/lib/mixins/event-ids';

  export default {
    layout: 'default',

    components: {PhoneForm},
    mixins: [mixinEventId],

    mounted() {
      this.fetchPhonesList();
    },
    data() {
      return {
        isLoading: false,
        readonly: true,
        onSelectedPhone: {},
        phones: [],
        query: '',
        showForm: false
      }
    },
    computed: {
      titles() {
        let titles = [];
        titles.push(
          {title: 'Имя', slot: 'name'},
          {title: 'Email', slot: 'email'},
          {title: 'Телефон', slot: 'phone'},
          {title: 'Действия', slot: 'actions', width: '120px', align: 'center'},
        );
        return titles;
      }
    },
    methods: {
      async fetchPhonesList() {
        this.isLoading = true;
        try {
          let phones = await this.$api.phones.fetchList();
          phones = Object.values(phones.list)
          this.phones = _.compact(phones);
        } catch (e) {
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'error',
            text: 'Ошибка загрузки данных'
          })
        } finally {
          this.isLoading = false;
        }
      },

      async $_onDelete(index, row) {
        try {
          await this.$api.phones.delete(row.id);
          await this.fetchPhonesList();
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'success',
            text: 'Контакт успешно удалён.',
          })
        } catch (e) {
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'error',
            text: 'Не удалось удалить контакт, повторите попытку позже.'
          })
        }
      },

      $_onEdit(index, row) {
        this.onSelectedPhone = row;
        this.showForm = true;
      },

      $_onAdd() {
        this.showForm = true;
      },

      async $_onSave(isEdit) {
        await this.fetchPhonesList();
        this.showForm = isEdit;
      },

      $_onSearch() {
        let obj = this.phones;
        let newArray = [];
        const query = this.query.toLowerCase();
        for (let key in obj) {
          let el = obj[key];

          _.forEach(el, val => {
            if (val.toLowerCase().indexOf(query) != -1) {
              newArray.push(el.id);
            }
          })
        }
        this.$_onSelectedPhone(newArray);
      },

      async $_onSearchClear() {
        this.query = '';
        await this.fetchPhonesList();
      },

      async $_onSelectedPhone(arr) {
        this.isLoading = true;
        try {
          this.phones = [];
          let phonesSearch = []
          for (let i = 0; i < arr.length; i++) {
            phonesSearch.push(await this.$api.phones.getPhone(arr[i]));
          }
          this.phones = phonesSearch;
        } catch (e) {
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'error',
            text: 'Ошибка загрузки данных'
          })
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
</script>

