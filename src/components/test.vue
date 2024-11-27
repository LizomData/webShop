<template>
    <div id="body">
       <div>这个是路由测试！！！</div>
       <div>
        <router-link to = "/hw">链接跳转测试</router-link>
       </div>
       <div>
        <el-button @click="Tohw">链接按钮跳转测试</el-button>
       </div>
       <div>
        <el-button type="primary" @click="sendReq">发送请求测试</el-button>

       </div>
    </div>
</template>
<script>
import axios  from 'axios';  
const ins=axios.create(
    {
        baseURL:'/api',
        timeout:2000
    }
)
export default{
    name:"TestPage",
    methods:{
    Tohw()
    {   
        
            this.$router.push('/hw')
    },
    sendReq()
    {
ins.get('goods/list').then((res)=>
{
    console.log(res.data)   
    console.log(res.data[0])    
    // alert(JSON.stringify(res.data));
    const names = res.data.map(product => "名称："+product.name);
    alert(names.join('\n'));
}).catch((err)=>{
    console.warn(err)
})

    }
}
}

</script>

<style>
#body{
    display: flex;  
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* align-content: center;  */
    /* justify-items: center;
    align-content: center; 
    align-items: center; */
    
}
</style>