import { View } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import "./index.scss";
import Taro from "@tarojs/taro";

function Index() {
  const handleLoginRedirect = () => {
    // 跳转到登录页面的逻辑
    // 例如：使用 Taro 的路由跳转
    Taro.navigateTo({ url: "/pages/login/index" });
  };

  return (
    <View className="nutui-react-demo">
      <View className="index">欢迎使用 NutUI React 开发 Taro 多端项目2。</View>
      <View className="index">
        <Button type="primary" className="btn" onClick={handleLoginRedirect}>
          跳转登录
        </Button>
      </View>
    </View>
  );
}

export default Index;
