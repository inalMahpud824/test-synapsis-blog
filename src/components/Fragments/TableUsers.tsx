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
import { Blog, User } from "@/type";
import { useRouter } from "next/router";
import { Loading } from "../Elements/Loading";
import ModalConfirm from "../Elements/ModalConfirm";

const TableUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch data posts
  const { isLoading, error, data } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/users`, {
        params: { page: page, per_page: pageSize },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`${baseURL}/users/${id}`);
    },
    onSuccess: () => {
      message.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh data
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to delete User");
    },
  });

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedUserId !== null) {
      deleteMutation.mutate(selectedUserId);
    }
  };

  const dataTable = data?.map((item: User) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    email: item.email,
    gender: item.gender,
    status: item.status,
    action: (
      <div className="flex gap-2 items-center flex-col md:flex-row">
        {/* <Button
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
        </Button> */}
        <Button
          color="danger"
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedUserId(item.id);
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
        title="Delete User"
        isModalOpen={isModalOpen}
        onConfirm={handleDelete}
        setIsModalOpen={setIsModalOpen}
      >
        <p>Are you sure you want to delete this user?</p>
      </ModalConfirm>

      {/* <Button
        style={{ marginBottom: "1rem" }}
        onClick={() => router.push("/blogs/create")}
        type="primary"
      >
        Create User
      </Button> */}
      <Table<Blog>
        style={{ overflowX: "auto" }}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          { title: "Gender", dataIndex: "gender" },
          { title: "Status", dataIndex: "status" },
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

export default TableUsers;
