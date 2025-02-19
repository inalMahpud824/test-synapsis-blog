import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "@/modules";
import { Comment } from "@/type";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Loading } from "../Elements/Loading";

export default function PostDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["postDetail", id],
    enabled: !!id,
    queryFn: async () => {
      const [postResponse, commentResponse] = await Promise.all([
        axios.get(`${baseURL}/posts/${id}`),
        axios.get(`${baseURL}/posts/${id}/comments`),
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
      return {
        post: postResponse.data,
        comments: commentResponse.data,
        author: userResponse?.data ?? null,
      };
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error fetching post details.</p>;

  return (
    <div>
      <div
        className="flex items-center gap-2 hover:font-bold cursor-pointer"
        onClick={() => router.push("/blogs")}
      >
        <ArrowLeftOutlined />
        <p className="">Back</p>
      </div>
      <h2 className="text-lg font-bold">{data?.post.title}</h2>
      {data?.author ? (
        <h3 className="text-sm italic pb-2 -pt-1">
          Created by: <span className="font-semibold">{data?.author.name}</span>{" "}
          Email: <span className="font-semibold">{data?.author.email}</span>{" "}
          Status: <span className="font-semibold">{data?.author.status}</span>{" "}
          Gender: <span className="font-semibold">{data?.author.gender}</span>
        </h3>
      ) : (
        <h3 className="text-sm italic pb-2 -pt-1">Created by: Anonymous</h3>
      )}
      <p className="">{data?.post.body}</p>

      <h2 className="text-lg font-bold py-2">Comment</h2>
      {data?.comments.length > 0 ? (
        data?.comments.map((comment: Comment, index: number) => (
          <div className="pb-2" key={index}>
            <h3 className="font-semibold">{comment.name}</h3>
            <p className="pl-2">{comment.body}</p>
          </div>
        ))
      ) : (
        <p>No comments</p>
      )}
    </div>
  );
}
