# webShop
*基于vue的web前端大作业,实现网上购物系统*。

## 概要

- #### **登录注册**

  - 用户登录注册

  - 记住密码

  - localStorage永久化存储cookie(userId)

  - 登录验证码功能

  - 用户登录路由守卫

- #### **商品页面**

  - 商品加入购物车

  - 搜索功能

  - 最高价最低价筛选功能

  - 商品排序功能(默认,价格升序,价格降序)

- #### **购物车页面**

  - 删除购物车商品项

  - 搜索功能

  - 结算预览小窗口

  - 多选商品项生成订单

- #### **订单页面**

  - 搜索功能(订单号,商品名称)

  - 排序功能(最新订单,最早订单,订单号升序,订单号降序)



## 实现

- #### box翻转效果

两个元素均用absolute定位方式,都设置背面隐藏,使两个元素重叠在一起。初始将注册box翻转达到隐藏效果，点击注册后执行翻转。

- ####  **对接验证码**

引入验证码接口的js

​	![image](/res/图片9.png)

验证码的初始化以及成功后的函数回调

​	![image](/res/图片10.png)

## 页面

- #### 登录注册

​	<img src="/res/login.png" alt="image" style="zoom:80%;" />

​	<img src="/res/captcha.png" style="zoom:80%;" />



- #### 商品页面

​	<img src="/res/goods.png" style="zoom:80%;" alt="image"/>

- #### 购物车页面

​	<img src="/res/goodscart.png" style="zoom:80%;" />

​	<img src="/res/buyNow.png" style="zoom:80%;" />

- #### 订单页面

​	<img src="/res/orders.png" style="zoom:80%;" />



## 注意

- 后端接口由学校提供
- 验证码只在前端验证，应该放在后端

