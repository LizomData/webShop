<template>
  <div class="order-list-container">
    <h1>我的订单</h1>

    <div class="controls">
      <!-- 搜索框 -->
      <el-input
        placeholder="输入订单号或商品名称搜索"
        v-model="searchQuery"
        @input="filterOrders"
        clearable
        prefix-icon="el-icon-search"
        class="search-input"
      ></el-input>

      <!-- 排序选项 -->
      <el-select v-model="sortBy" @change="sortOrders" placeholder="排序方式" class="sort-select">
        <el-option value="orderTimeDesc" label="最新订单"></el-option>
        <el-option value="orderTimeAsc" label="最早订单"></el-option>
        <el-option value="orderIdDesc" label="订单号降序"></el-option>
        <el-option value="orderIdAsc" label="订单号升序"></el-option>
      </el-select>
    </div>

    <!-- 显示订单 -->
    <transition-group name="fade" tag="div" class="orders">
      <el-card v-for="order in filteredOrders" :key="order.id" class="order-card" shadow="hover">
        <!-- 订单基本信息 -->
        <div slot="header" class="order-header">
          <span class="order-id">订单号: {{ order.id }}</span>
          <span class="order-time">下单时间: {{ formatOrderTime(order.orderTime) }}</span>
        </div>

        <!-- 商品详情 -->
        <el-table :data="order.orderDetail" stripe style="width: 100%">
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="nums" label="数量" width="100" align="center"></el-table-column>
          <el-table-column prop="dealPrice" label="价格" width="150" align="right">
            <template slot-scope="scope">¥ {{ formatPrice(scope.row.dealPrice) }}</template>
          </el-table-column>
        </el-table>

        <!-- 订单总价 -->
        <div class="order-total">
          总价:
          <span class="total-price">¥ {{ calculateTotal(order.orderDetail) }}</span>
        </div>
      </el-card>
    </transition-group>

    <!-- 空订单提示 -->
    <el-empty v-if="!filteredOrders.length" description="您还没有订单" :image-size="200"></el-empty>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      sortBy: "orderTimeDesc",
      searchQuery: ""
    };
  },
  computed: {
    sortedOrders() {
      let sorted = [...this.filteredOrders];
      switch (this.sortBy) {
        case "orderTimeDesc":
          sorted.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
          break;
        case "orderTimeAsc":
          sorted.sort((a, b) => new Date(a.orderTime) - new Date(b.orderTime));
          break;
        case "orderIdDesc":
          sorted.sort((a, b) => b.id.localeCompare(a.id));
          break;
        case "orderIdAsc":
          sorted.sort((a, b) => a.id.localeCompare(b.id));
          break;
      }
      return sorted;
    }
  },
  methods: {
    filterOrders() {
      this.filteredOrders = this.orders.filter(order => {
        return (
          order.id
            .toString()
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          order.orderDetail.some(detail =>
            detail.goodsName
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
          )
        );
      });
    },
    formatOrderTime(orderTime) {
      const date = new Date(orderTime);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    sortOrders() {
      this.filteredOrders = this.sortedOrders;
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    calculateTotal(orderDetail) {
      return orderDetail
        .reduce((total, item) => {
          return total + parseFloat(item.dealPrice) * parseInt(item.nums);
        }, 0)
        .toFixed(2);
    }
  },
  mounted() {
    this.axiosIns
      .get("/order/listByUser", {
        params: { userId: localStorage.getItem("userId") }
      })
      .then(res => {
        console.log(res.data);
        this.orders = res.data.map(order => ({
          id: order.id,
          orderTime: order.orderTime,
          orderDetail: order.orderDetail.map(detail => ({
            OrderDetailid: detail.OrderDetailid,
            goodsId: detail.goodsId,
            goodsName: detail.goodsName,
            nums: parseInt(detail.nums.split(",")[0]),
            dealPrice: parseFloat( detail.nums.split("=")[1]),
          }))
        }));
        this.filteredOrders = this.orders;
      })
      .catch(err => {
        console.error(err);
        this.$message.error("获取订单数据失败");
      });
  }
};
</script>
  
  <style scoped>
.order-list-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #303133;
  margin-bottom: 30px;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.search-input {
  flex-grow: 1;
}

.sort-select {
  width: 150px;
}

.orders {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}

.order-time {
  font-size: 14px;
  color: #909399;
}

.order-total {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
}

.total-price {
  color: #f56c6c;
  font-size: 18px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Element UI overrides */
.el-card__header {
  padding: 15px 20px;
  background-color: #f5f7fa;
}

.el-table {
  margin-top: 20px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafafa;
}
</style>