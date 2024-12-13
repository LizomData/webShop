<template>
  <div>
    <div class="as-l-fullwidth" data-events="event52">
      <div>
        <div class="dd-fill-tertiary">
          <div class="dd-holiday-animation-container">
            <div class="dd-holiday-animation-colors">
              <div class="dd-holiday-animation-yellow dd-holiday-animation-color"></div>
              <div class="dd-holiday-animation-pink-one dd-holiday-animation-color"></div>
              <div class="dd-holiday-animation-pink-two dd-holiday-animation-color"></div>
              <div class="dd-holiday-animation-blue dd-holiday-animation-color"></div>
            </div>
            <div class="dd-image"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="search-container">
      <input type="text" class="search-input" placeholder="请输入搜索内容" />
      <button class="search-button" onclick="searchFunction()">搜索</button>
    </div>-->
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
    <div class="goodsTools">
      <div class="l_Right">
        <div class="w-Counter">
          <div class="w-Counter-inputa">
            <label>¥</label>
            <input class="w-Counter-input" type="text" placeholder="最低价" v-model="minPrice" />
            <label>-¥</label>
            <input class="w-Counter-input" type="text" placeholder="最高价" v-model="maxPrice" />
          </div>
          <div class="w-Counter-pannel">
            <button
              class="button_small"
              style="margin-left: 6px;"
              @click="minPrice='' ; maxPrice='';filterByPrice();"
            >清除</button>
            <button class="button_small_main" style="margin-left: 7px; " @click="filterByPrice">确定</button>
          </div>
        </div>
        <div class="w-Select-Multi">
          <h3>{{ cur_sort_by }}</h3>
          <i class="icon_drop"></i>
          <ul style="width: 98px;">
            <li v-for="(item , index) in sort_by" :key="index">
              <h6 :class="{'on': item == cur_sort_by}" @click="switchSort(item)">{{ item }}</h6>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="goods-container">
      <div class="good-container" v-for="(item,index) in goodsInfo" :key="index">
        <img :src=" '/api/' + item['pthumbnail']" />
        <div class="good-info">
          <span class="name">{{ item['name'] }}</span>
          <div style="display: flex; justify-content: space-between; align-items:center;">
            <div class="good-price">
              <span class="price1">¥</span>
              <span class="price2">{{ item['price1'] }}</span>
            </div>
            <label class="label-button" @click="addToCart(item)">加入购物车</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "goodsPage",
  data() {
    return {
      goodsInfo: null,
      goodsInfo_origin: null,
      goodsInfo_price_up: null,
      goodsInfo_price_down: null,
      sort_by: ["默认", "价格⬆", "价格⬇"],
      cur_sort_by: "默认",
      searchQuery: "",
      minPrice: "",
      maxPrice: ""
    };
  },
  mounted() {
    this.axiosIns.get("/goods/list").then(res => {
      this.goodsInfo = JSON.parse(JSON.stringify(res.data));
      this.goodsInfo_origin = JSON.parse(JSON.stringify(res.data));
      this.goodsInfo_price_up = JSON.parse(JSON.stringify(res.data));
      this.goodsInfo_price_down = JSON.parse(JSON.stringify(res.data));
      this.sortData();
    });
  },
  methods: {
    filterByPrice() {
      var cur_goods = this.goodsInfo_origin;
      if (this.cur_sort_by == this.sort_by[1])
        cur_goods = this.goodsInfo_price_up;
      if (this.cur_sort_by == this.sort_by[2])
        cur_goods = this.goodsInfo_price_down;

      this.goodsInfo =
        this.minPrice === "" || this.maxPrice === ""
          ? cur_goods
          : cur_goods.filter(good => {
              const min = parseFloat(this.minPrice);
              const max = parseFloat(this.maxPrice);
              return (
                (isNaN(min) || good.price1 >= min) &&
                (isNaN(max) || good.price1 <= max)
              );
            });
    },
    handleSearch() {
      const query = this.searchQuery.toLowerCase();
      var cur_goods = this.goodsInfo_origin;
      if (this.cur_sort_by == this.sort_by[1])
        cur_goods = this.goodsInfo_price_up;
      if (this.cur_sort_by == this.sort_by[2])
        cur_goods = this.goodsInfo_price_down;
      this.goodsInfo = cur_goods.filter(good =>
        good.name.toLowerCase().includes(query)
      );
    },
    switchSort(item) {
      this.cur_sort_by = item;
      if (item == this.sort_by[0]) this.goodsInfo = this.goodsInfo_origin;
      if (item == this.sort_by[1]) this.goodsInfo = this.goodsInfo_price_up;
      if (item == this.sort_by[2]) this.goodsInfo = this.goodsInfo_price_down;
      this.handleSearch();
      this.filterByPrice();
    },
    sortData() {
      var i, j, a, b, tem;
      for (i = 0; i < this.goodsInfo_price_up.length; i++) {
        for (j = 0; j < this.goodsInfo_price_up.length - 1; j++) {
          a = parseFloat(this.goodsInfo_price_up[j]["price1"]);
          b = parseFloat(this.goodsInfo_price_up[j + 1]["price1"]);
          if (b > a) {
            tem = this.goodsInfo_price_up[j];
            this.goodsInfo_price_up[j] = this.goodsInfo_price_up[j + 1];
            this.goodsInfo_price_up[j + 1] = tem;
          }
        }
      }
      for (i = 0; i < this.goodsInfo_price_down.length; i++) {
        for (j = 0; j < this.goodsInfo_price_down.length - 1; j++) {
          a = parseFloat(this.goodsInfo_price_down[j]["price1"]);
          b = parseFloat(this.goodsInfo_price_down[j + 1]["price1"]);
          if (a > b) {
            tem = this.goodsInfo_price_down[j];
            this.goodsInfo_price_down[j] = this.goodsInfo_price_down[j + 1];
            this.goodsInfo_price_down[j + 1] = tem;
          }
        }
      }
    },
    addToCart(item) {
      this.$confirm("是否将 " + item.name + " 添加到购物车？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axiosIns
            .post("/cart/add", null, {
              params: {
                userId: localStorage.getItem("userId"),
                goodsId: item.id,
                num: 1,
                price: item.price1
              }
            })
            .then(res => {
              this.$message.success(item.name + "\n" + "加入购物车成功");
              console.log(res);
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.goods-container {
  display: flex;
  width: calc(100vw - 18% - 25px);
  margin: 0 auto;
  padding: 25px 0 5% 25px;
  /* border: 1px solid rgb(230, 230, 231); */
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid rgb(230, 230, 231);
  box-shadow: 0 0 10px rgb(230, 230, 231);
  border-top: none;

  /* justify-content: space-between; */
  /* gap: 1%; */
}
.good-container {
  width: calc(20% - 2px - 25px);
  display: flex;
  flex-direction: column;
  margin-right: 25px;
  /* margin-left: 2%; */
  margin-bottom: 25px;
  padding: 0px 0px 2% 0px;
  /* border-radius: 12px; */
  border: 1px solid rgb(230, 230, 231);
  box-shadow: 0 0 10px rgb(230, 230, 231);
  transition: border 0.3s ease;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.good-container:hover {
  border: 1px solid rgb(192, 192, 193);
  transform: scale(1.01);
  box-shadow: 0 0 10px rgb(192, 192, 193);
}

.good-container img {
  /* width: 300px; */
  width: 90%;
  margin: 0 auto;
  border-radius: 12px;
  transform: scale(0.8);
  clip-path: polygon(1% 1%, 99% 1%, 99% 99%, 1% 99%);
}

.good-info {
  width: 90%;
  margin: 0 auto;
}

.good-info .name {
  width: 80%;
  margin: 0 auto;
  font-size: clamp(1px, 1.1vw, 32px);
  font-weight: 500;
  display: flex;
  justify-content: center;
  height: 4vw;
}
.good-price {
  display: flex;
  align-items: center;
}
.good-price span {
  color: #eea211;
  font-weight: 700;
}
.good-price .price1 {
  font-size: clamp(1px, 1.1vw, 32px);
}
.good-price .price2 {
  font-size: clamp(1px, 1.5vw, 32px);
}

.label-button {
  color: rgb(30, 28, 28); /* 字体颜色 */
  font-size: clamp(1px, 1vw, 32px);
  cursor: pointer; /* 鼠标悬停时显示为指针 */
  transition: background-color 0.3s ease; /* 背景色过渡 */
}

.label-button:hover {
  color: #bbab21; /* 悬停时改变背景色 */
}

.label-button:active {
  color: #887d18; /* 点击时改变背景色 */
}

.as-l-fullwidth {
  display: block;
  overflow: hidden;
  width: 100%;
}
.as-l-fullwidth div {
  display: block;
}
.dd-fill-tertiary {
  background-color: #f5f5f7;
  --ribbon-background-color: rgb(245, 245, 247);
}
.dd-holiday-animation-container {
  width: 100%;
  height: 75px;
  position: relative;
  margin-inline-start: auto;
  margin-inline-end: auto;
}
.dd-holiday-animation-container::before {
  content: " ";
  display: table;
}
.dd-holiday-animation-container::after {
  clear: both;
  content: " ";
  display: table;
}
.dd-holiday-animation-colors {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.dd-holiday-animation-color {
  filter: blur(20px);
  position: absolute;
  border-radius: 50%;
}
.dd-holiday-animation-yellow {
  width: 40%;
  height: 50px;
  background: #fd8c1f;
  top: -30px;
  right: 0;
  animation: yellowAnimation 1.5s ease-out forwards 0.5s;
}
@keyframes yellowAnimation {
  0% {
    top: -75px;
    right: 10vw;
  }

  50% {
    top: -30px;
  }

  100% {
    top: -30px;
    right: 0;
  }
}

.dd-holiday-animation-pink-one {
  width: 90%;
  height: 150px;
  background: #ff3f98;
  top: -135px;
  left: 0;
  right: 0;
  margin: 0 auto;
  opacity: 0.5;
  animation: pinkOneAnimation 2s ease-in-out forwards;
}

.dd-holiday-animation-pink-two {
  width: 68%;
  height: 150px;
  background: #e9a5ff;
  top: -135px;
  left: 0;
  right: 0;
  margin: 0 auto;
  animation: pinkTwoAnimation 1.2s ease-in-out forwards;
}

@keyframes pinkOneAnimation {
  0% {
    top: -200px;
    transform: scaleX(50%) translateX(0);
  }

  25% {
    top: -110px;
    transform: scaleX(50%) translateX(0);
  }

  50% {
    top: -120px;
    transform: scaleX(225%) translateX(10%);
  }

  100% {
    top: -135px;
    background: #e44cbb;
    transform: scaleX(225%) translateX(0);
  }
}
@keyframes pinkTwoAnimation {
  0% {
    top: -200px;
    transform: scaleX(50%) translateX(0);
  }

  25% {
    top: -120px;
    transform: scaleX(70%) translateX(-10%);
  }

  50% {
    top: -130px;
    transform: scaleX(225%) translateX(10%);
  }

  100% {
    top: -135px;
    background: #f55be4;
    transform: scaleX(225%) translateX(0);
    left: 0;
  }
}
.dd-holiday-animation-blue {
  width: 60%;
  height: 75px;
  top: -50px;
  left: 0;
  background: #4186fd;
  opacity: 0.5;
  animation: blueAnimation 1s ease 0.2s forwards;
}
@keyframes blueAnimation {
  0% {
    top: -100px;
    transform: translateX(0);
  }

  50% {
    top: -50px;
    transform: translateX(-15%);
  }

  100% {
    top: -50px;
    background: #019ffb;
    transform: translateX(0);
  }
}

.dd-image {
  position: absolute;
  height: 300px;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0;
  animation: imageAnimation 1s ease 1s forwards;
  min-width: 100vw;
  margin: 0 auto;
}
/* .search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px auto;
  border: 1px solid #e7e6e6;
  border-radius: 5px;
  padding: 5px 5px;
  background-color: white;
  width: 30%;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
}
.search-container:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}
.search-input {
  border: none;
  outline: none;
  padding: 8px;
  font-size: 16px;
  width: 80%;
}

.search-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #45a049;
} */
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

.goodsTools {
  display: flex;
  /* justify-content: flex-end; */
  position: relative;
  align-items: center;
  /* background-color: #dce0dc; */
  /* background: #1c202b; */
  background: white;
  width: calc(100vw - 18%);
  margin: 0 auto;
  margin-bottom: -1px;
  /* padding: 0% 9% 0% 9%; */
  min-height: 52px;
  /* margin-bottom: -2px; */
  /* border-radius: 5px; */
  z-index: 10;
  border: 1px solid rgb(230, 230, 231);
  /* box-shadow: 0 0 10px rgb(230, 230, 231); */
  /* border-bottom: none; */
}
.l_Right {
  margin: 0 25px 0 0;
  position: absolute;
  right: 2%;
  display: flex;
  justify-content: space-between;
  width: 350px;
  overflow: visible;
}
.w-Counter {
  position: relative;
  color: #888d94;
  margin: auto 0;
  min-width: 186px;
  height: 30px;
}
.w-Counter-inputa {
  position: absolute;
  z-index: 40;
  left: 0px;
  top: 0px;
  width: 210px;
}
.w-Counter-inputa:hover ~ .w-Counter-pannel {
  opacity: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.w-Counter-inputa:focus ~ .w-Counter-pannel {
  opacity: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.w-Counter-input {
  border: 1px solid #e3e3e3;
  border-color: #ebebeb;
  border-radius: 2px;
  width: 56px;
  background: 0 0;
  /* background-color: #484b5f; */
  color: black;
  text-align: center;
  font-size: 12px;
  padding: 3px 6px;
  margin: 0 6px;
  line-height: 24px;
  vertical-align: middle;
}

.w-Counter-input:focus {
  border-color: #dad9d9;
  outline: 0;
  color: black;
}

.w-Counter-input:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.w-Counter-pannel {
  display: block;
  border: 1px solid #e3e3e3;
  border-color: #ebebeb;
  border-radius: 2px;
  background: white;
  width: 210px;
  padding: 54px 0 12px 15px;
  z-index: 35;
  position: absolute;
  top: -11px;
  left: -8px;
  /* visibility: hidden; */
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0s 0.3s;
}
.w-Counter-pannel:hover {
  opacity: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.w-Counter-pannel .button_small {
  display: inline-block;
  min-width: 71px;
  width: 59px;
  height: 22px;
  background: #45536c;
  border-color: #21212b;
  border-radius: 2px;
  border: 0;
  vertical-align: middle;
  color: #fff !important;
  line-height: 22px;
  padding: 0 6px;
  margin: 0 18px 0 -1px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.w-Counter-pannel .button_small:hover {
  background: #566887;
}
.w-Counter-pannel .button_small_main {
  display: inline-block;
  min-width: 71px;
  width: 59px;
  height: 22px;
  background: #4773c8;
  border-color: #21212b;
  border-radius: 2px;
  border: 0;
  vertical-align: middle;
  color: #fff !important;
  line-height: 22px;
  padding: 0 6px;
  margin: 0 18px 0 -1px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.w-Counter-pannel .button_small_main:hover {
  background: #597cc2;
}

.w-Select-Multi {
  display: flex;
  color: #888d94;
  background: white;
  width: 100px;
  position: relative;
  cursor: pointer;
}

/* .w-Select-Multi-checkbox:checked ~ .w-Select-Multi {
  background: #3c3d47;
} */
.w-Select-Multi h3 {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  margin: auto 0;
  padding: 0 9px 0 9px;
  width: 79px;
  border: 1px solid rgb(96, 98, 102);
  border-color: #ebebeb;
  border-radius: 2px;
  outline: none;
}
.w-Select-Multi h3:hover {
  background: #d2d6dfb9;
}
.w-Select-Multi h3:active {
  background: 0 0;
}
.w-Select-Multi h3:hover ~ ul {
  opacity: 1;
}

.w-Select-Multi ul {
  background: white;
  top: 34px;
  border: none;
  left: 0;
  position: absolute;
  min-width: 60px;
  max-height: 256px;
  border-radius: 2px;
  z-index: 62;
  margin: 0;
  padding: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  border: 1px solid rgb(96, 98, 102);
  border-color: #ebebeb;
  border-radius: 2px;
  color: #606266;
}
.w-Select-Multi ul:hover {
  opacity: 1;
}
.w-Select-Multi li {
  list-style: none;
  border-bottom: 1px solid #e3e3e3;
  border-color: #ebebeb;
}
.w-Select-Multi li:hover {
  background: #d2d6dfb9;
}
.w-Select-Multi li:active {
  background: 0 0;
}
.w-Select-Multi li .on {
  background: #d2d6dfb9;
}
.w-Select-Multi h6 {
  line-height: 32px;
  font-size: 12px;
  padding: 0 9px;
  margin: 0;
  font-weight: 400;
  list-style: none;
  cursor: pointer;
}

.icon_drop {
  position: absolute;
  right: 7px;
  top: 18px;
  background-image: url(https://buff.163.com/static/images/sprite/icon.less.png?20241120121846);
  background-position: -48px -262px;
  width: 6px;
  height: 6px;
  color: #888d94;
  cursor: pointer;
  text-align: left;
  line-height: 50px;
}
</style>