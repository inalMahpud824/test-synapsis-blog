import { Loading } from "@/components/Elements/Loading";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { baseURL, instance } from "@/modules";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const { TextArea } = Input;

export default function CreatePost() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [inputData, setInputData] = useState({
    title: "",
    id_user: "",
    body: "",
  });
  const handleChange = (e: any) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSelectChange = (value: any) => {
    setInputData({
      ...inputData,
      id_user: value,
    });
  };
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/users`);
      return response.data;
    },
  });

  const handleSubmit = async () => {
    setLoadingOnSubmit(true);
    try {
      await instance.post(`/users/${inputData.id_user}/posts`, {
        title: inputData.title,
        body: inputData.body,
      });

      messageApi.open({
        type: "success",
        content: "Succes Created Post",
      });
      setLoadingOnSubmit(false);
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: (error as Error).message || "An error occurred",
      });
      setLoadingOnSubmit(false);
    }
  };

  if (error) {
    messageApi.open({
      type: "error",
      content: error.message || "An error occurred",
    });
    return contextHolder;
  }
  return (
    <DashboardLayout active="1">
      <div
        className="flex items-center gap-2 hover:font-bold cursor-pointer"
        onClick={() => router.push("/blogs")}
      >
        <ArrowLeftOutlined />
        <p className="">Back</p>
      </div>
      {isLoading || (loadingOnSubmit && <Loading />)}
      {error && <Loading />}
      {contextHolder}
      <>
        <h1 className="text-xl font-bold py-2">Form Post</h1>
        <Form
          onFinish={handleSubmit}
          labelCol={{ span: 4 }}
          layout="vertical"
          style={{ width: "100%" }}
        >
          <Form.Item label="Title">
            <Input
              onChange={handleChange}
              id="title"
              placeholder="Input Title"
            />
          </Form.Item>
          <Form.Item label="Author">
            <Select
              id="id_user"
              onChange={handleSelectChange}
              placeholder="Select Author"
            >
              {data &&
                data.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Content">
            <TextArea
              id="body"
              onChange={handleChange}
              rows={4}
              placeholder="Post Content Input"
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </>
    </DashboardLayout>
  );
}
