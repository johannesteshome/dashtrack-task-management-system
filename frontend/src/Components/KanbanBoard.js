import { KanbanComponent, ColumnDirective, ColumnsDirective} from '@syncfusion/ej2-react-kanban'

export default function KanbanBoard({data,columns}) {

    return (
    <KanbanComponent 
          id="kanban" 
          keyField="status" 
          className='w-full h-full bg-transparent border-2 border-gray-200 rounded-md shadow-md m-4 p-4'
          dataSource={data}
          cardSettings={{contentField: "summary", headerField: "id"}}
          >
        <ColumnsDirective>
          {
            columns.map((column, index) => {
              return <ColumnDirective key={index} headerText={column} keyField={column}/>
            })
          }
        </ColumnsDirective>
    </KanbanComponent>)
}