import React, { act, useState } from "react";
import { Button, Flex, message, Spin, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "@/modules";
import { Blog } from "@/type";
import { useRouter } from "next/router";

const columns: TableColumnsType<Blog> = [
  { title: "ID", dataIndex: "id" },
  { title: "User ID", dataIndex: "user_id" },
  { title: "Title", dataIndex: "title" },
  { title: "Action", dataIndex: "action" },
];

const TablePosts = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
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
  const dataTable = data?.map((item: Blog) => ({
    key: item.id,
    id: item.id,
    user_id: item.user_id,
    title: item.title,
    // action: <Button href={`/blogs/detail/${item.id}`} type="primary">Detail</Button>,
    action: <Button onClick={() => router.push(`/blogs/detail/${item.id}`)} type="primary">Detail</Button>,
  }));

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  } else if (error) {
     messageApi.open({
       type: "error",
       content: error.message || "An error occurred",
     });
     return contextHolder;
  } else {
    return (
      <Flex gap="middle" vertical>
        <Table<Blog>
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: 2912,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10"],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
        />
      </Flex>
    );
  }
};

export default TablePosts;
