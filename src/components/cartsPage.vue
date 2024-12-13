<template>
  <div>
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="搜索..."
        suffix-icon="el-icon-search"
        clearable
        @input="handleSearch"
        class="search-box"
      ></el-input>
    </div>
    <div class="content-container">
      <div class="list-container">
        <div class="cart-operation">
          <div class="cart-operation-item">
            <label for="selectAll" class="cart-operation-item-selectAll">
              <input
                type="checkbox"
                id="selectAll"
                class="cart-status-checkbox"
                v-model="selectAll"
                @click="toggleSelectAll()"
              />
              <span>全选</span>
            </label>
            <button class="cart-operation-item-delete" @click="deleteCart_selected()">删除选中</button>
            <button
              class="cart-operation-item-delete"
              style="margin-left: 16px;"
              @click="deleteCart_all()"
            >删除全部</button>
          </div>
        </div>
        <div class="carts-container">
          <div class="cart-container" v-for="(cart,index) in cartItems" :key="index">
            <div class="cart-status">
              <label :for="cart.cardid" class="cart-status-label">
                <input
                  type="checkbox"
                  :id="cart.cardid"
                  class="cart-status-checkbox"
                  v-model="cart.selected"
                  @click="toggleSelect(cart)"
                />
              </label>
            </div>
            <img :src="'/api/'+cart.thumbnail" alt />
            <span class="cart-container-name">{{ cart.name }}</span>
            <div
              style="display: flex; justify-content: space-between; width: 368px;margin-left: 32px;"
            >
              <div style="width: 148px;">
                <span class="cart-container-price1">¥</span>
                <span class="cart-container-price2">{{ cart.price }}</span>
              </div>
              <div
                style="width: 104px; display: flex; justify-content: center; align-items: center;"
              >
                <button
                  :class="['cart-container-num-del',{'notallowed': cart.num <= 1}]"
                  @click="decrease(cart)"
                >-</button>
                <input
                  type="text"
                  class="cart-container-num"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  :value="cart.num"
                />
                <button class="cart-container-num-add" @click="increase(cart)">+</button>
              </div>
            </div>
            <span class="cart-container-delete" @click="removeItem(cart)">删除</span>
          </div>
        </div>
      </div>
      <div class="settlement-container">
        <div class="settlement-container-titlebar">
          <span class="settlement-container-title">结算明细</span>
        </div>
        <div class="settlement-container-content">
          <div class="settlement-container-content noitem" v-if="selectedCarts.length === 0">
            <img
              src="https://img.alicdn.com/imgextra/i4/O1CN01CIC9vl1ISaHmqoYNZ_!!6000000000892-55-tps-140-140.svg"
              alt
            />
            <span
              style="color:#ff5000;font-size: 16px;
    font-weight: 600;transform: translate(0, -32px);"
            >选择商品查看支付价格</span>
          </div>
          <div class="settlement-container-content items" v-if="selectedCarts.length !== 0">
            <div v-for="(cart,index) in cartItems_dummy" :key="index">
              <img :class="{'hide':cart.cardid === ''}" :src="'/api/'+cart.thumbnail" alt />
            </div>
          </div>
        </div>
        <div class="settlement-container-total">
          <div
            style="width:100%;margin-bottom:16px; display: flex; justify-content: space-between;"
          >
            <span>合计:</span>
            <div>
              <span class="cart-container-price1">￥</span>
              <span class="cart-container-price2">{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <button @click="showCheckoutDialog = true;">结算</button>
        </div>
      </div>
    </div>

    <el-dialog title="结算" :visible.sync="showCheckoutDialog" width="60%">
      <div v-if="selectedCarts.length > 0">
        <el-table :data="selectedCarts" style="width: 100%" height="250">
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column label="小计">
            <template slot-scope="scope">{{ scope.row.price * scope.row.num }}</template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; text-align: right;">总价: {{ totalPrice }}</div>
      </div>
      <div v-else>购物车为空，请添加商品后再结算。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCheckoutDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkout()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "cartsPage",
  data() {
    return {
      cartItems: [],
      cartItems_origin: [],
      selectAll: false,
      selectedCarts: [],
      cartItems_dummy: [],
      totalPrice: 0,
      searchQuery: "",
      showCheckoutDialog: false
    };
  },

  mounted() {
    this.axiosIns
      .get("/cart/listByUser", {
        params: { userId: localStorage.getItem("userId") }
      })
      .then(res => {
        this.cartItems = res.data.map(item => ({
          cardid: item.cardid,
          userId: item.userId,
          goodsId: item.goodsId,
          num: parseInt(item.num),
          price: parseFloat(item.price),
          selected: false,
          thumbnail: item.thumbnail,
          name: item.name
        }));
        this.cartItems_origin = JSON.parse(JSON.stringify(this.cartItems));
      });
  },

  methods: {
    handleSearch() {
      const query = this.searchQuery.toLowerCase();
      this.cartItems = this.cartItems_origin.filter(cart =>
        cart.name.toLowerCase().includes(query)
      );
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
      this.$confirm(`确定要删除选中商品吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (let i = 0; i < this.cartItems.length; i++) {
            if (this.cartItems[i].selected) {
              this.axiosIns
                .get("/cart/deleteById", {
                  params: {
                    userId: localStorage.getItem("userId"),
                    cartId: this.cartItems[i].cardid
                  }
                })
                .then(res => {});
            }
          }
          this.cartItems = this.cartItems.filter(
            cartItem => !cartItem.selected
          );
          this.cartItems_origin = JSON.parse(JSON.stringify(this.cartItems));
          this.handleSelectedCarts();
          this.$message.success("删除商品成功");
        })
        .catch(() => {});
    },
    deleteCart_all() {
      this.$confirm(`确定要删除全部商品吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (let i = 0; i < this.cartItems.length; i++) {
            this.axiosIns
              .get("/cart/deleteById", {
                params: {
                  userId: localStorage.getItem("userId"),
                  cartId: this.cartItems[i].cardid
                }
              })
              .then(res => {});
          }
          this.cartItems = [];
          this.cartItems_origin = JSON.parse(JSON.stringify(this.cartItems));

          this.handleSelectedCarts();

          this.$message.success("删除商品成功");
        })
        .catch(() => {});
    },
    removeItem(item) {
      this.$confirm(`确定要删除商品 "${item.name}" 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axiosIns
            .get("/cart/deleteById", {
              params: {
                userId: localStorage.getItem("userId"),
                cartId: item.cardid
              }
            })
            .then(res => {
              this.cartItems = this.cartItems.filter(
                cartItem => cartItem.cardid !== item.cardid
              );
              this.cartItems_origin = JSON.parse(
                JSON.stringify(this.cartItems)
              );

              this.handleSelectedCarts();
              this.$message.success("删除商品成功");
            });
        })
        .catch(() => {});
    },
    clearCart() {
      this.cartItems = [];
    },
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
      for (let i = 0; i < this.cartItems.length; i++) {
        this.cartItems[i].selected = this.selectAll;
      }

      this.handleSelectedCarts();
    },

    updateTotalPrice() {
      this.totalPrice = 0;
      for (let i = 0; i < this.selectedCarts.length; i++) {
        this.totalPrice +=
          this.selectedCarts[i].num * this.selectedCarts[i].price;
      }
    },
    handleSelectedCarts() {
      this.cartItems_dummy = [];
      this.selectedCarts = this.cartItems.filter(item => item.selected);
      this.selectAll =
        this.selectedCarts.length === this.cartItems.length &&
        this.selectedCarts.length !== 0;

      this.updateTotalPrice();

      this.cartItems_dummy = JSON.parse(JSON.stringify(this.selectedCarts));
      const remainder = this.selectedCarts.length % 4;
      if (remainder !== 0) {
        const emptyItemsCount = 4 - remainder;
        for (let i = 0; i < emptyItemsCount; i++) {
          var item_null = {
            cardid: "",
            userId: "",
            goodsId: "",
            num: 0,
            price: "",
            selected: false,
            thumbnail: "",
            name: ""
          };
          this.cartItems_dummy.push(item_null);
        }
      }
    },
    toggleSelect(item) {
      item.selected = !item.selected;
      this.handleSelectedCarts();
    },
    checkout() {
      this.showCheckoutDialog = this.selectedCarts.length > 0;
      if (this.selectedCarts.length > 0) {
        var cartList = this.selectedCarts
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
          .then(response => {
            this.$alert("订单生成成功！", "订单生成结果", {
              confirmButtonText: "确定",

              callback: action => {
                this.showCheckoutDialog = false;

                this.cartItems = this.cartItems.filter(
                  cartItem => !cartItem.selected
                );
                this.cartItems_origin = JSON.parse(
                  JSON.stringify(this.cartItems)
                );

                this.handleSelectedCarts();
              }
            });
          })
          .catch(error => {
            this.$alert("订单生成成功！", "订单生成结果", {
              confirmButtonText: "确定",
              type: "warning",
              callback: action => {
                this.showCheckoutDialog = false;
              }
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.search-container {
  display: flex;
  justify-content: center; /* 居中搜索框 */
  padding: 20px; /* 添加内边距 */
  width: 50%;
  margin: 0 auto;
  transform: scale(1.2);
}
.search-box {
  width: 100%;
  max-width: 400px; /* 设置最大宽度 */
  border-radius: 30px; /* 圆角边框 */
}
.content-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  /* margin-top: 100px; */
  padding: 0 0 50px 0;
}
.list-container {
  width: calc(70vw);
  margin-left: 2%;
  border-radius: 10px;
  background-color: white;
  min-width: 512px;
}
.settlement-container {
  position: sticky;
  top: 30px;
  border: 1px solid #d6d6d6;
  width: 358px;
  height: 322px;
  border-radius: 16px;
  z-index: 1000;
  /* background-color: white; */
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  outline: none;
}
.settlement-container-content {
  width: 100%;
  height: 140px;
  display: flex;
}
.settlement-container-content.noitem {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.settlement-container-content.items {
  width: calc(100% -32px);
  height: 140px;
  display: flex;
  padding: 0 16px;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  overflow: auto;
}
.settlement-container-content.items img {
  width: 76px;
  height: 76px;
  border: 1px solid #d6d6d6;
  border-radius: 5px;
}
.settlement-container-content.items img.hide {
  width: 76px;
  height: 76px;
  border: 1px solid #d6d6d6;
  border-radius: 5px;
  visibility: hidden;
}

/* 滚动条的宽度 */
.settlement-container-content.items::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

/* 滚动条的轨道（背景） */
.settlement-container-content.items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

/* 滚动条的滑块 */
.settlement-container-content.items::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* 滑块悬停时的样式 */
.settlement-container-content.items::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.settlement-container-titlebar {
  padding: 12px 16px 20px 16px;
}
.settlement-container-title {
  font-size: 16px;
  font-weight: 600;
}
.settlement-container-total {
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
}

.settlement-container-total button {
  width: 326px;
  height: 48px;
  outline: none;
  border: none;
  background-color: #ff5000;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  border-radius: 12px;
}
.settlement-container-total button:hover {
  background-color: #f84d00;
}

.cart-operation {
  width: calc(70vw);
  background-color: white;
  display: flex;
  justify-content: center;
  height: 32px;
  padding: 16px 0;
  overflow: visible;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-radius: 10px;
}
.cart-operation-item {
  display: flex;
  width: 90%;
  align-items: center;
}
.cart-operation-item-selectAll {
  display: flex;
  align-items: center;
}
.cart-operation-item-selectAll span {
  margin: 0 16px;
  font-size: 14px;
  cursor: pointer;
}
.cart-operation-item-delete {
  background-color: #ff5000;
  font-size: 14px;
  background-color: rgb(255, 255, 255);
  text-align: center;
  cursor: pointer;
  font-weight: 500;
  outline: none;
  border: 1px solid rgb(235, 235, 235);
  border-radius: 8px;
  line-height: 30px;
  padding: 0 12px;
}
.cart-operation-item-delete:hover {
  background-color: #f5f5f5;
}
.carts-container {
  display: flex;
  width: calc(70vw);
  /* margin-left: 5%; */
  flex-direction: column;
  align-items: center;
}

.cart-container {
  display: flex;
  width: 90%;
  border-top: 1px solid #ebebeb;
  align-items: center;
  position: relative;
}
.cart-container img {
  border-radius: 5px;
  height: 116px;
  width: 116px;
  margin-left: 16px;
  transform: scale(0.8);
}
.cart-container-name {
  width: 198px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 16px;
}
.cart-container-price1 {
  color: #ff5000;
  font-weight: 700;
  font-size: clamp(1px, 1vw, 32px);
}
.cart-container-price2 {
  color: #ff5000;
  font-weight: 700;
  font-size: clamp(1px, 1.5vw, 32px);
}

.cart-container-num-add {
  background-color: transparent;
  text-align: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-bottom-color: rgb(214, 214, 214);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 8px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-top-color: rgb(214, 214, 214);
  border-top-left-radius: 0px;
  border-top-right-radius: 8px;
  border-top-width: 1px;
  border-top-style: solid;
  border-right-color: rgb(214, 214, 214);
  border-right-style: solid;
  border-right-width: 1px;
  border-left-color: rgb(0, 0, 0);
  border-left-style: none;
  border-left-width: 0px;
  cursor: pointer;
}
.cart-container-num-del {
  background-color: transparent;

  text-align: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-bottom-color: rgb(214, 214, 214);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-top-color: rgb(214, 214, 214);
  border-top-left-radius: 8px;
  border-top-right-radius: 0px;
  border-top-width: 1px;
  border-top-style: solid;
  border-left-color: rgb(214, 214, 214);
  border-left-style: solid;
  border-left-width: 1px;
  border-right-color: rgb(0, 0, 0);
  border-right-style: none;
  border-right-width: 0px;
  cursor: pointer;
}

.cart-container-num-del.notallowed {
  cursor: not-allowed;
}
.cart-container-num {
  text-align: center;
  width: 38px;
  height: 30px;
  border: 1px solid #d6d6d6;
  border-radius: 0;
  padding: 0;
  outline: none;
}
.cart-container-delete {
  position: absolute;
  right: 3%;
  color: #7a7a7a;
  font-size: 14px;
  cursor: pointer;
}
.cart-container-delete:hover {
  color: #ff5000;
}

.cart-status {
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 36px;
  height: 116px;
}
.cart-status-label {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-status-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  outline: none;
  border: 1px solid rgb(235, 235, 235);
  border-radius: 4px;
}
</style>