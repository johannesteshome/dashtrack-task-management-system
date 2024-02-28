import { Button, Form, Input, Modal, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateTeam,
  GetMyProjects,
  GetOneProject,
} from "../Redux/features/dataActions";
import { ToastContainer, toast } from "react-toastify";

const notify = (text) => toast(text);

const CreateTeamModal = ({ open, onCreate, onCancel }) => {
  const [teamForm] = Form.useForm();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.data.currentProject);

  const createTeam = () => {
    teamForm.validateFields().then((values) => {
      dispatch(CreateTeam({ data: values, _id: project._id })).then((res) => {
        console.log(res);
        if (res.payload.success) {
          teamForm.resetFields();
          dispatch(GetMyProjects());
          dispatch(GetOneProject(project._id));
          return notify(res.payload.message);
        } else {
          return notify(res.payload.message);
        }
      });
    });
  };

  return (
    <Modal
      open={open}
      title='Create New Team'
      okText='Create'
      okType='default'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={createTeam}>
      <Form
        form={teamForm}
        layout='vertical'
        name='teamForm'
        initialValues={{}}>
        <Form.Item
          name='name'
          label='Team Name:'
          rules={[
            {
              required: true,
              message: "Please input the team name!",
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name='description'
          label='Description:'
          rules={[
            {
              required: true,
              message: "Please input some description!",
            },
          ]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeamModal;
