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

export default function UpdatePost() {
  const router = useRouter();
  const { id } = router.query;
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [inputData, setInputData] = useState({
    title: "",
    id_user: "",
    author: "",
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["postDetail", id],
    enabled: !!id,
    queryFn: async () => {
      const [postResponse, usersDumy] = await Promise.all([
        axios.get(`${baseURL}/posts/${id}`),
        axios.get(`${baseURL}/users`),
      ]);
      let userResponse = null;

      try {
        if (postResponse.data.user_id) {
          userResponse = await axios.get(
            `${baseURL}/users/${postResponse.data.user_id}`
          );
        }
      } catch (error) {
        console.warn("User not found, skipping user data.", error);
      }
      setInputData({
        title: postResponse?.data.title,
        id_user: postResponse?.data.user_id,
        body: postResponse?.data.body,
        author: userResponse?.data?.name,
      });
      return {
        post: postResponse.data,
        users: usersDumy.data,
        author: userResponse?.data ?? null,
      };
    },
  });
  const handleSubmit = async () => {
    setLoadingOnSubmit(true);
    try {
      const response = await instance.put(`/posts/${id}`, {
        title: inputData.title,
        id_user: inputData.id_user,
        body: inputData.body,
      });

      messageApi.open({
        type: "success",
        content: "Succes Updated Post",
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
        <h1 className="text-xl font-bold py-2">Form Update Post</h1>
        <Form
          onFinish={handleSubmit}
          labelCol={{ span: 4 }}
          layout="vertical"
          style={{ width: "100%" }}
        >
          <Form.Item label="Title">
            <Input
              onChange={handleChange}
              value={inputData.title}
              id="title"
              placeholder="Input Title"
            />
          </Form.Item>
          <Form.Item label="Author">
            <Select
              id="id_user"
              onChange={handleSelectChange}
              placeholder={inputData.author || "Select Author"}
            >
              {data?.author && (
                <Select.Option key={data?.author?.id} value={data?.author?.id}>
                  {data?.author.name}
                </Select.Option>
              )}
              {data &&
                data?.users?.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Content">
            <TextArea
              id="body"
              value={inputData.body}
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
