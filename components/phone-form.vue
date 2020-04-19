<template>
  <div class="phone-form__container">
    <Form ref="phoneForm"
          :model="formModel"
          :rules="formRules">
      <Row>
        <Col span="24">
          <FormItem label="Имя" prop="name">
            <Input v-model.trim="formModel.name" :disabled="stateToReadonly"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <FormItem label="Email" prop="email">
            <Input v-model.trim="formModel.email" :disabled="stateToReadonly"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <FormItem label="Телефон" prop="phone">
            <Input type="text"
                   v-model.trim="formModel.phone"
                   :disabled="stateToReadonly"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row type="flex">
      <Col>
        <div class="no-margin"
             v-if="!stateToReadonly">
          <Button type="primary"
                  @click="onSubmitForm()"
                  @keyup.native.enter="onSubmitForm()">
            <span>Сохранить</span>
          </Button>

          <Button type="default"
                  @click="onCancel"
                  v-if="formModel.id">
            Отмена
          </Button>
        </div>
        <div v-else>
          <Button type="primary" @click="onEdit">
            <font-awesome-icon fas icon="pen"/>
            Редактировать
          </Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import _ from 'lodash';
  import {mixinEventId} from '~/lib/mixins/event-ids';

  function copyModel(m) {
    let model = _.cloneDeep(m);
    return model;
  }

  export default {
    name: "phone-form",

    mixins: [mixinEventId],

    props: {
      readonly: {
        type: Boolean,
        default: true,
      },

      phone: {
        type: Object,
        default: {},
      },
    },
    mounted() {
      this.$refs['phoneForm'].resetFields();

      if ('id' in this.phone) {
        this.stateToReadonly = this.readonly;
        this.formModel = copyModel(this.phone);
      }
    },
    data: function () {
      return {
        stateToReadonly: false,
        formModel: {
          name: '',
          email: '',
          phone: ''
        },
        formRules: {
          email: [
            {
              required: true,

              validator: (rule, value, callback) => {
                let errors = [];
                if (!value || !/.+@.+\..+/.test(value)) {
                  errors.push('Неверный формат электронной почты');
                }
                callback(errors);
              },
              trigger: 'change'
            },
          ],
          phone: [
            {
              required: true,

              validator: (rule, value, callback) => {
                let errors = [];
                if (!value || !value.match('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{10}$')) {
                  errors.push('Неверный формат номера телефона');
                }
                callback(errors);
              },

              trigger: 'change'
            }
          ]
        }
      }
    },

    methods: {
      async save() {
        // Если в модели данных есть, Id - значит редактируем объект, иначе создаем
        // новый объект.

        if (!(this.formModel.id)) {
          try {
            this.stateToReadonly = false;

            await this.$api.phones.save({
              data: {
                name: this.formModel.name,
                email: this.formModel.email,
                phone: this.formModel.phone,
              }
            });

            this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
              type: 'success',
              title: 'Добавление контакта.',
              text: 'Контакт успешно добавлен.'
            })

            this.$emit('on-save', false);
          } catch (e) {

            this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
              type: 'error',
              title: 'Добавление контакта.',
              text: 'Не удалось добавит новый контакт, повторите попытку позже.'
            })
          } finally {
            this.$refs['phoneForm'].resetFields();
          }
          return;
        }

        this.stateToReadonly = false;

        await this.$api.phones.edit({
          form: {
            data: {
              id: this.formModel.id,
              name: this.formModel.name,
              email: this.formModel.email,
              phone: this.formModel.phone,
            }
          },
        });

        this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
          type: 'success',
          title: 'Редактирование контакта.',
          text: 'Контакт успешно изменён.'
        })

        this.$emit('on-save', false);
        this.stateToReadonly = false;
        this.$refs['phoneForm'].resetFields();
      },

      onSubmitForm() {
        this.$refs['phoneForm'].validate(async (valid) => {
          if (valid) {
            this.save();
          }
        });
      },

      onEdit() {
        this.stateToReadonly = false;
        this.formModel = copyModel(this.phone);
      },

      onCancel() {
        this.stateToReadonly = true;
        this.formModel = copyModel(this.phone);
      }
    },

    watch: {
      phone: function (newValue) {
        if (newValue) {
          this.formModel = copyModel(newValue);

          if ('id' in newValue) {
            this.stateToReadonly = true;
          }

          this.$refs['phoneForm'].resetFields();
        }
      }
    }
  }
</script>
