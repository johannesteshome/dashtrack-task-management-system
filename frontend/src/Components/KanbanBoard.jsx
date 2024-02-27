import { KanbanComponent, ColumnDirective, ColumnsDirective} from '@syncfusion/ej2-react-kanban'
import { extend, addClass } from '@syncfusion/ej2-base';
import "./KanbanBoard.css"
export default function KanbanBoard({data,columns}) {
    
     const fields = [
        { text: "ID", key: "Id", type: "TextBox" },
        { text: "Status", key: "Status",type: "DropDown" },
        { text: "Assignee",key:"Assignee", type: "TextBox" },
        { key: "RankId", type: "TextBox" },
        { text: "Summary",key:"Summary", type: "TextArea" },
    ];
    const cardRendered = (args) => {
        let val = args.data.Priority;
        addClass([args.element], val);
    };
    const columnTemplate = (props) => {
        return (
                <div className="header-text">{props.headerText}</div>);
    };
    const cardTemplate = (props) => {
        return (<div className={"card-template"}>
                <div className="e-card-header">
                    <div className="e-card-header-caption">
                        <div className="e-card-header-title e-tooltip-text">
                            {props.Title}
                        </div>
                    </div>
                </div>
                <div className="e-card-content e-tooltip-text">
                    <div className="e-text">{props.Summary}</div>
                </div>
                <div className="e-card-custom-footer">
                    {props.Tags.split(",").map((tag) => (<div className="e-card-tag-field e-tooltip-text" key={tag}>{tag}</div>))}
                    <div className="e-card-avatar">{getString(props.Assignee)}</div>
                </div>
            </div>);
    };
    const getString = (assignee) => {
        return assignee.match(/\b(\w)/g).join("").toUpperCase();
    };
    return (<div className="schedule-control-section">
            <div className="col-lg-12 control-section">
                <div className="control-wrapper">
                    <KanbanComponent 
                    id="kanban" 
                    cssClass="kanban-overview" 
                    keyField="Status" 
                    dataSource={data}  
                    cardSettings={{
                      headerField: "Title",
                      template: cardTemplate.bind(this),
                      selectionType: "Multiple",
                      }} 
                    dialogSettings={{ fields: fields }} 
                    className='py-5'
                    cardRendered={cardRendered.bind(this)}
                    >
                      <ColumnsDirective>
                        {
                          columns.map((column, index) => {
                            return <ColumnDirective key={index} headerText={column} keyField={column} allowToggle={true} template={columnTemplate.bind(this)}/>
                          })
                        }
                      </ColumnsDirective>

                    </KanbanComponent>
                </div>
            </div>
        </div>);
}