import { Table } from "antd";

const ListTable = (data, columns) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{
        x: 1500,
        y: 500,
      }}
    />
  );
};
export default ListTable;
