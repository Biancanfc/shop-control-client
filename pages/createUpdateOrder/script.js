import inputDate from '../../components/inputDate'
import cButton from '../../components/button'
import modalAlert from '../../components/modalConfirm'

import formatValue from '../../mixins/formatValue'

import {
  createOrder,
  loadingOrderId,
  updateOrder
} from '../../services/order'

import {
  loadingStock,
} from '../../services/stock'

export default {
  components: {
    inputDate,
    modalAlert,
    cButton
  },
  mixins: [formatValue],
  data() {
    return {
      total: 0,
      searchProduct: null,
      searchGift: null,
      isLoading: false,
      dialogAlert: false,
      msgAlert: '',
      stock: [],
      products: [],
      productsItems: [],
      action: '',
      requiredRules: [
        v => !!v || 'Requerid filling'
      ],
      orderInput: {
        product: {},
        amount: 1
      },
      order: {
        client: '',
        phone: '',
        streetAddress: '',
        numberAddress: '',
        districtAddress: '',
        deliveryDate: new Date().toISOString().substr(0, 10),
        deliveryType: '',
        deliveryFee: 0,
        payment: '',
        rateCard: '',
        discount: '',
        items: [],
        gift:{}
      },
      deliveryForm: ['Pick-up', 'Delivery'],
      paymentForm: ['Transfer', 'Bill', 'Card', 'Money']
    }
  },
  methods: {
    async submit() {
      if (this.$refs.formOrder.validate() && this.order.items.length > 0) {
        if (this.action === 'create') {
          try {
            return await createOrder(this.order).then(() => {
              this.$router.push({
                name: "order"
              })
            })
          } catch (error) {
            throw error
          }
        }

        try {
          return await updateOrder(this.order, 'updateOrder').then(() => {
            this.$router.push({
              name: 'order'
            })
          })
        } catch (error) {
          throw error
        }
      }

    },
    async loadOrderUpdate(id) {
      try {
        await loadingOrderId(id).then(res => this.order = res.data.order)

      } catch (error) {
        return error
      }
    },
    addOrderItem(orderInput) {
      const exists = this.order.items.findIndex(({
        _id
      }) => _id === orderInput.product._id)

      if (orderInput.product.text) {
        if (orderInput.product.amount < orderInput.amount) {
          this.msgAlert = 'A quantidade selecionada não está disponível em stock'
          return this.dialogAlert = true
        }

        if (exists !== -1) {
          this.msgAlert = 'O product já foi selecionado, para alteral exclua e adicione novamente'
          return this.dialogAlert = true
        }

        //add in order
        return this.order.items.push({
          _id: orderInput.product._id,
          description: orderInput.product.description,
          color: orderInput.product.color,
          brand: orderInput.product.brand,
          value: orderInput.product.value,
          amount: orderInput.amount
        })
      }

    },
    removeOrderItem(idx) {
      this.order.items.splice(idx, 1)
    },
    async loadingStock() {
      try {
        await loadingStock().then(res => this.stock = res.data.stocks)

        this.formatOptions(this.stock)
      } catch (error) {
        throw error
      }
    },
    formatOptions() {
      this.stock.map((product, i) => {
        this.products.push({
          amount: product.amount,
          value: product.value,
          _id: product._id,
          text: product.description + (product.color ? ' - ' + product.color : '') + (product.brand ? ' - ' + product.brand : ''),
          description: product.description,
          color: product.color,
          brand: product.brand
        })
      })
      this.productsItems = this.products
    }
  },
  watch: {
    searchProduct(val) {
      const productsItems = []
      this.products.map((item) => {
        if (item.text.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
          productsItems.push(item)
        }
      })

      return productsItems
    },

    searchGift(val) {
      const productsItems = []
      if(val){
        this.products.map((item) => {
          if (item.text.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            productsItems.push(item)
          }
        })
      }

      return productsItems
    }
  },
  mounted() {
    this.action = this.$route.query.action

    if (!this.action) {
      this.loadOrderUpdate(this.$route.query.id)
    }

    this.loadingStock()
  }
}
