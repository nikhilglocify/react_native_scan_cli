export interface ScheduledScan{
    id:string,
    time:string,
    scanDuration:number,
    date:Date  
    visitedSites?:string[],
    isCompleted?:boolean,
    notificationId?:string
}