import { Button, Form, Input, Modal, Radio } from "antd";

const AssignCourseModal = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title='Create a new collection'
      okText='Assign Course'
      okType='default'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}>
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{}}>
        <Form.Item
          name='teacher'
          label='Teacher Name'
          rules={[
            {
              required: true,
              message: "Please input the teacher name!",
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name='course'
          label='Course'
          rules={[
            {
              required: true,
              message: "Please input the course name!",
            },
          ]}>
          <Input type='textarea' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignCourseModal;
