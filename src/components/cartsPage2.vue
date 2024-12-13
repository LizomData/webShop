<template>
  <div class="cart-page">
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="请输入搜索内容"
        prefix-icon="el-icon-search"
        clearable
        @input="searchItems"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchItems">搜索</el-button>
      </el-input>
    </div>

    <div class="content-container">
      <div class="list-container">
        <el-card class="cart-operation">
          <div class="cart-operation-item">
            <el-checkbox v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
            <el-button type="danger" size="small" @click="deleteCart_selected" :disabled="!hasSelectedItems">删除选中</el-button>
            <el-button type="danger" size="small" @click="deleteCart_all" :disabled="!cartItems.length">删除全部</el-button>
          </div>
        </el-card>

        <el-card v-for="(cart, index) in cartItems" :key="index" class="cart-container">
          <el-row type="flex" align="middle">
            <el-col :span="2">
              <el-checkbox v-model="cart.selected" @change="toggleSelect(cart)"></el-checkbox>
            </el-col>
            <el-col :span="4">
              <el-image :src="'/api/' + cart.thumbnail" fit="cover" class="cart-image"></el-image>
            </el-col>
            <el-col :span="6">
              <span class="cart-container-name">{{ cart.name }}</span>
            </el-col>
            <el-col :span="4">
              <span class="cart-container-price">
                <span class="cart-container-price1">¥</span>
                <span class="cart-container-price2">{{ cart.price }}</span>
              </span>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="cart.num" :min="1" :max="99" size="small" @change="updateTotalPrice"></el-input-number>
            </el-col>
            <el-col :span="2">
              <el-button type="text" icon="el-icon-delete" @click="removeItem(cart)">删除</el-button>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <el-card class="settlement-container">
        <div slot="header" class="settlement-container-titlebar">
          <span class="settlement-container-title">结算明细</span>
        </div>
        <div class="settlement-container-content" v-if="selectedCarts.length === 0">
          <el-empty description="选择商品查看支付价格">
            <template slot="image">
              <i class="el-icon-shopping-cart-2" style="font-size: 60px; color: #909399;"></i>
            </template>
          </el-empty>
        </div>
        <div v-else class="settlement-container-content items">
          <el-image 
            v-for="(cart, index) in selectedCarts.slice(0, 4)" 
            :key="index"
            :src="'/api/' + cart.thumbnail"
            fit="cover"
            class="settlement-image"
          ></el-image>
          <div v-if="selectedCarts.length > 4" class="more-items">+{{ selectedCarts.length - 4 }}</div>
        </div>
        <div class="settlement-container-total">
          <div class="total-price">
            <span>合计:</span>
            <div>
              <span class="cart-container-price1">￥</span>
              <span class="cart-container-price2">{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <el-button type="primary" @click="checkout" :disabled="!selectedCarts.length">结算</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartsPage",
  data() {
    return {
      cartItems: [],
      selectAll: false,
      selectedCarts: [],
      totalPrice: 0,
      searchQuery: ''
    };
  },
  computed: {
    hasSelectedItems() {
      return this.selectedCarts.length > 0;
    }
  },
  mounted() {
    this.fetchCartItems();
  },
  methods: {
    fetchCartItems() {
      this.axiosIns
        .get("/cart/listByUser", {
          params: { userId: localStorage.getItem("userId") }
        })
        .then(res => {
          this.cartItems = res.data.map(item => ({
            ...item,
            num: parseInt(item.num),
            selected: false
          }));
          this.handleSelectedCarts();
        })
        .catch(err => {
          console.error(err);
          this.$message.error('获取购物车数据失败');
        });
    },
    searchItems() {
      // Implement search logic here
    },
    increase(item) {
      item.num++;
      this.updateTotalPrice();
    },
    decrease(item) {
      if (item.num > 1) {
        item.num--;
      }
      this.updateTotalPrice();
    },
    deleteCart_selected() {
      this.$confirm('确定要删除选中商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deletePromises = this.selectedCarts.map(item => 
          this.axiosIns.get("/cart/deleteById", {
            params: {
              userId: localStorage.getItem("userId"),
              cartId: item.cardid
            }
          })
        );
        Promise.all(deletePromises).then(() => {
          this.cartItems = this.cartItems.filter(item => !item.selected);
          this.handleSelectedCarts();
          this.$message.success('删除选中商品成功');
        }).catch(err => {
          console.error(err);
          this.$message.error('删除选中商品失败');
        });
      }).catch(() => {});
    },
    deleteCart_all() {
      this.$confirm('确定要删除全部商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deletePromises = this.cartItems.map(item => 
          this.axiosIns.get("/cart/deleteById", {
            params: {
              userId: localStorage.getItem("userId"),
              cartId: item.cardid
            }
          })
        );
        Promise.all(deletePromises).then(() => {
          this.cartItems = [];
          this.handleSelectedCarts();
          this.$message.success('购物车已清空');
        }).catch(err => {
          console.error(err);
          this.$message.error('清空购物车失败');
        });
      }).catch(() => {});
    },
    removeItem(item) {
      this.$confirm(`确定要删除商品 "${item.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axiosIns
          .get("/cart/deleteById", {
            params: {
              userId: localStorage.getItem("userId"),
              cartId: item.cardid
            }
          })
          .then(() => {
            this.cartItems = this.cartItems.filter(cartItem => cartItem.cardid !== item.cardid);
            this.handleSelectedCarts();
            this.$message.success('删除成功');
          })
          .catch(err => {
            console.error(err);
            this.$message.error('删除失败');
          });
      }).catch(() => {});
    },
    toggleSelectAll() {
      this.cartItems.forEach(item => item.selected = this.selectAll);
      this.handleSelectedCarts();
    },
    toggleSelect(item) {
      item.selected = !item.selected;
      this.handleSelectedCarts();
    },
    updateTotalPrice() {
      this.totalPrice = this.selectedCarts.reduce((total, item) => total + item.num * item.price, 0);
    },
    handleSelectedCarts() {
      this.selectedCarts = this.cartItems.filter(item => item.selected);
      this.selectAll = this.cartItems.length > 0 && this.selectedCarts.length === this.cartItems.length;
      this.updateTotalPrice();
    },
    checkout() {
      if (this.selectedCarts.length > 0) {
        const cartList = this.selectedCarts
          .map(item => item.cardid)
          .filter(id => id.trim() !== "")
          .join(",");

        this.axiosIns
          .get("/order/addCastOrder", {
            params: {
              userId: localStorage.getItem("userId"),
              cartList: cartList
            }
          })
          .then(() => {
            this.cartItems = this.cartItems.filter(cartItem => !cartItem.selected);
            this.handleSelectedCarts();
            this.$message.success("订单生成成功！");
          })
          .catch(error => {
            console.error("生成订单失败：", error);
            this.$message.error("生成订单失败");
          });
      } else {
        this.$message.warning("请选择商品后再结算！");
      }
    }
  }
};
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.content-container {
  display: flex;
  gap: 20px;
}

.list-container {
  flex: 1;
}

.cart-operation {
  margin-bottom: 20px;
}

.cart-operation-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-container {
  margin-bottom: 15px;
}

.cart-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.cart-container-name {
  font-size: 14px;
  font-weight: 500;
}

.cart-container-price {
  color: #ff5000;
  font-weight: 700;
}

.cart-container-price1 {
  font-size: 12px;
}

.cart-container-price2 {
  font-size: 16px;
}

.settlement-container {
  width: 300px;
  align-self: flex-start;
  position: sticky;
  top: 20px;
}

.settlement-container-titlebar {
  font-size: 16px;
  font-weight: 600;
}

.settlement-container-content {
  min-height: 140px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.settlement-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.more-items {
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #909399;
}

.settlement-container-total {
  margin-top: 20px;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.el-button--primary {
  width: 100%;
}
</style>