import React from "react";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    icon: FileTextOutlined,
    label: <Link href="/blogs">Blogs</Link>,
  },
  {
    icon: UserOutlined,
    label: <Link href="/users">Users</Link>,
  },
].map((item, index) => ({
  key: String(index + 1),
  icon: React.createElement(item.icon),
  label: item.label,
}));

import { ReactNode } from "react";
import Link from "next/link";

const DashboardLayout = ({
  children,
  active,
}: {
  children: ReactNode;
  active: string;
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        {/* <div className="demo-logo-vertical" /> */}
        <h1 className="text-white flex items-center justify-center my-6 md:text-2xl font-bold ">
          Dashboard Blog
        </h1>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[active]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
