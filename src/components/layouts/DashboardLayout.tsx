import React, { useState } from "react";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

const { Header, Sider } = Layout;

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
  const [collapse, setCollapse] = useState(false);

  return (
    <Layout >
      <Sider breakpoint="lg" collapsedWidth="0" onCollapse={() => setCollapse(!collapse)}>
        {/* <div className="demo-logo-vertical" /> */}
        <h1 className={`text-white flex items-center justify-center my-6 md:text-2xl font-bold ${collapse ? "hidden" : ""}`}>
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
      <div className="w-full min-h-screen max-h-screen overflow-y-auto bg-[#F5F5F5] ">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <div className="py-4 px-7">
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout;
