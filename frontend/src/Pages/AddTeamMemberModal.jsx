import { Button, Form, Input, Modal, Radio } from "antd";

const AddTeamMemberModal = ({ open, onCreate, onCancel }) => {
  const [memberForm] = Form.useForm();

  return (
    <Modal
      open={open}
      title='Add New Team Member'
      okText='Invite user'
      okType='default'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        console.log("object");
      }}>
      <Form
        form={memberForm}
        layout='vertical'
        name='memberForm'
        initialValues={{}}>
        <Form.Item
          name='email'
          label='Invite Member via Email:'
          rules={[
            {
              required: true,
              message: "Please input an email to invite a user!",
            },
          ]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeamMemberModal;
