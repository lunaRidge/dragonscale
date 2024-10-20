// src/pages/login/index.tsx
import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import React from "react";

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      const res = await Taro.login();
      if (res.code) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const response = await Taro.request({
          url: "https://your-api-url.com/login", // 替换为你的 API 地址
          method: "POST",
          data: {
            code: res.code,
          },
        });
        // 处理登录成功后的逻辑
        console.log("登录成功", response.data);
      } else {
        console.error("登录失败！" + res.errMsg);
      }
    } catch (error) {
      console.error("登录过程中发生错误", error);
    }
  };

  return (
    <View>
      <Button onClick={handleLogin}>登录</Button>
    </View>
  );
};

export default Login;
