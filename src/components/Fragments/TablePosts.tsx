import React, { useState } from "react";
import { Button, message, Table } from "antd";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { baseURL, instance } from "@/modules";
import { Blog } from "@/type";
import { useRouter } from "next/router";
import { Loading } from "../Elements/Loading";
import ModalConfirm from "../Elements/ModalConfirm";

const TablePosts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch data posts
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/posts`, {
        params: { page: page, per_page: pageSize },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`${baseURL}/posts/${id}`);
    },
    onSuccess: () => {
      message.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh data
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to delete post");
    },
  });

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedPostId !== null) {
      deleteMutation.mutate(selectedPostId);
    }
  };

  const dataTable = data?.map((item: Blog) => ({
    key: item.id,
    id: item.id,
    user_id: item.user_id,
    title: item.title,
    action: (
      <div className="flex gap-2 items-center flex-col md:flex-row">
        <Button
          onClick={() => router.push(`/blogs/detail/${item.id}`)}
          size="small"
          color="primary"
          variant="outlined"
        >
          Detail
        </Button>
        <Button
          size="small"
          color="green"
          variant="outlined"
          onClick={() => router.push(`/blogs/update/${item.id}`)}
        >
          Update
        </Button>
        <Button
          color="danger"
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedPostId(item.id);
            setIsModalOpen(true);
          }}
        >
          Delete
        </Button>
      </div>
    ),
  }));

  if (isLoading) return <Loading />;
  if (error) {
    messageApi.open({
      type: "error",
      content: error.message || "An error occurred",
    });
    return contextHolder;
  }

  return (
    <>
      {contextHolder}
      <ModalConfirm
        title="Delete Post"
        isModalOpen={isModalOpen}
        onConfirm={handleDelete}
        setIsModalOpen={setIsModalOpen}
      >
        <p>Are you sure you want to delete this post?</p>
      </ModalConfirm>

      <Button style={{ marginBottom: "1rem" }} onClick={() => router.push("/blogs/create")} type="primary">
        Create Post
      </Button>
      <Table<Blog> 
      style={{ overflowX: "auto" }}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "User ID", dataIndex: "user_id" },
          { title: "Title", dataIndex: "title" },
          { title: "Action", dataIndex: "action" },
        ]}
        dataSource={dataTable}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: 2000,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10"],
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />
    </>
  );
};

export default TablePosts;
