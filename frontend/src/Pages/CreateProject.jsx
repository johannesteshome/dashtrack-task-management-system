import { Button, Form, Input } from 'antd';

const CreateProject = () => {
    const [form] = Form.useForm();

  return (
      <div>
          <h1 className='text-3xl my-4' >Create your Project</h1>
      <Form
        form={form}
        layout='vertical'
        >
        <Form.Item
          label='Project Name'
          required
          tooltip='This is a required field'>
          <Input placeholder='Enter Project Name' />
        </Form.Item>
        <Form.Item
          name='description'
          label='Description'
          rules={[
            {
              message: "Please input Description of your project",
            },
          ]}>
          <Input.TextArea
            showCount
            maxLength={100}
          />
        </Form.Item>
        <Form.Item>
          <Button type='default' className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4]' >Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default CreateProject