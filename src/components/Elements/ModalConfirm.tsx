import { Modal } from "antd";
import { ReactNode } from "react";

const ModalConfirm = ({
  onConfirm,
  children,
  isModalOpen,
  title,
  setIsModalOpen,
}: {
  title: string;
  onConfirm: () => void;
  children: ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={onConfirm}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalConfirm;
