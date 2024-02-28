import { Button, Form, Input, Modal, Radio } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { InviteUsers, GetMyProjects } from "../Redux/features/dataActions";
import io from "socket.io-client";


const notify = (text) => toast(text);

const AddTeamMemberModal = ({ open, onCreate, onCancel }) => {
  const [memberForm] = Form.useForm();
  const project = useSelector((state) => state.data.currentProject);
  const { _id, email } = useSelector((state) => state.auth.user);
  const socket = io("http://localhost:5000");
  

  const inviteUser = () => {
    memberForm
      .validateFields()
      .then((values) => {
        dispatch(InviteUsers({ data: values, _id: project._id })).then((res) => {
          console.log(res);
          if (res.payload.success) {
            memberForm.resetFields();
            const newNotification = {
              email: values.email,
              text: "Project Invitation Request. Check your Email",
            };

          socket.emit("createNotification", newNotification);
            dispatch(GetMyProjects());

            return notify(res.payload.message);
          } else {
            return notify(res.payload.message);
          }
        });

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
