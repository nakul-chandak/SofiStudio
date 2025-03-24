export interface Category { 
    _id:string;
    name: string;
    workflowName: string;
    description: string;
    tags: Array<string>;
    photo?: string | null;
    createdBy :string;
    createDatetime:string;
    updatedBy:string;
    updateDatetime:string;
}