<template>
  <div>
    <div class="status">
      <div class="title_bar">
        <span class="title">首页</span>
        <span class="title">商品</span>
        <span class="title">购物车</span>
        <span class="title-user">未登录</span>
      </div>
    </div>
    <div class="goods-container">
      <div class="good-container">
        <img
          src="http://10.60.81.45:8080/goodsimage/bfd2008fcbfb4cfcafc95983cf57dfec.jpg"
          alt=""
        />
        <div class="good-info"> 
          <span class="name">宏碁(acer) V3-572G </span>
          <div class="good-price">
            <span class="price1">¥</span>
            <span class="price2">2222.00</span>
          </div>
          <el-button type="primary" style="position: absolute;transform: translate(150%,-115%);">加入购物车</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "goodsPage",
  methods: {},
};
</script>
<style scoped>
.status {
  display: flex;
  width: calc(100vw -20%);
  height: 50px;
  background-color: #e9e8e8;
  /* justify-content: space-between; */
  align-items: center;
  padding-left: 20%;
}
.title_bar {
  display: flex;
  width: calc(100vw - 20%);
  gap: 50px;
}
.title {
  font-size: 20px;
}

.title-user {
  font-size: 20px;
  position: absolute;
  right: 10%;
}
.goods-container {
  display: flex;
  width: calc(100vw - 18%);
  padding: 1% 0% 9% 9%;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  gap: 10px;
}
.good-container {
  display: flex;
  flex-direction: column;
  /* margin-right: 5px;
  margin-bottom: 5px; */
  border: 1px solid black;
}



.good-container img {
  width: 300px;
}

.good-info {
  margin-left: 10px;
  margin-right: 10px;
}

.good-info .name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 22px;
  display: flex;
  justify-content: center;
}
.good-price {
}
.good-price span {
  color: #ff6200;
  font-weight: 700;
}
.good-price .price1 {
  font-size: 16px;
}
.good-price .price2 {
  font-size: 24px;
}
</style>