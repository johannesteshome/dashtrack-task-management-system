import { Button, Form, Input, Modal, Radio } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { InviteUsers } from "../Redux/features/dataActions";

const notify = (text) => toast(text);

const AddTeamMemberModal = ({ open, onCreate, onCancel }) => {
  const [memberForm] = Form.useForm();

  const inviteUser = () => {
    memberForm
      .validateFields()
      .then((values) => {
        memberForm.resetFields();
        onCreate(values);
        
      })
  };

  const dispatch = useDispatch();
  return (
    <Modal
      open={open}
      title='Add New Team Member'
      okText='Invite user'
      okType='default'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={inviteUser}>
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
