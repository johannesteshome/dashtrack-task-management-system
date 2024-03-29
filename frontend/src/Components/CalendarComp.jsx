import { Scheduler } from "@aldabil/react-scheduler";

export default function CalendarComp({data}){
    const eventData=data.map((e)=>{
        return(
          {
            event_id: e.Id,
            title: e.Title,
            start: new Date(e.Date[0]),
            end: new Date(e.Date[1])
          }
        )
    })
    console.log(eventData)
    return(
    <Scheduler 
      events={eventData}
      draggable={false}
      editable={false}
      deletable={false}
      />
    )
}