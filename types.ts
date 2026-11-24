export interface Ticket {
    id: string,
    title: string,
    priority: "low" | "medium" | "high",
    status: "new" | "doing" | "done"
}