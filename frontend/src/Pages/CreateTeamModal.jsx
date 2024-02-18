import { Button, Form, Input, Modal, Radio } from "antd";

const CreateTeamModal = ({ open, onCreate, onCancel }) => {
  const [teamForm] = Form.useForm();

  return (
    <Modal
      open={open}
      title='Create New Team'
      okText='Create'
      okType='default'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        console.log("object");
      }}>
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
      </Form>
    </Modal>
  );
};

export default CreateTeamModal;
