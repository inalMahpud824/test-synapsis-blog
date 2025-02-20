import { CommentFormProps } from "@/type";
import { Button, Form, Input } from "antd";
const { TextArea } = Input;



const CommentForm = ({
  postCommentMutation,
  inputData,
  setInputData,
}: CommentFormProps) => {
  const handleSubmitComment = async () => {
    postCommentMutation.mutate();
  };

  const handleChange = (e: any) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Form
      onFinish={handleSubmitComment}
      layout="vertical"
      style={{ width: "100%" }}
    >
      <h2 className="text-lg font-bold pt-5'">Start Comment</h2>
      <Form.Item label="Name">
        <Input id="name" onChange={handleChange} placeholder="Input Title" />
      </Form.Item>
      <Form.Item label="Email">
        <Input id="email" onChange={handleChange} placeholder="Input Title" />
      </Form.Item>

      <Form.Item label="Comment">
        <TextArea
          id="body"
          onChange={handleChange}
          rows={4}
          placeholder="Add Comment"
        />
      </Form.Item>
      <div className="flex justify-end">
        <Button type="primary" htmlType="submit">
          Comment
        </Button>
      </div>
    </Form>
  );
};

export default CommentForm;
