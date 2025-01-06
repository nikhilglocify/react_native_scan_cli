export interface ScheduledScan{
    id:string,
    time:string,
    scanDuration:number,
    date:Date  
    visitedSites?:string[],
    isCompleted?:boolean,
    type?:"scheduled" |"history"
    notificationId?:string
}


export interface svgProps  {
    height?: number;
    width?: number;
    color?:any
  };