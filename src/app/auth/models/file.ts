export interface IFile{
    uploaded: boolean;
    percentage: number;
    uploading: boolean;
    url: string;
    error: boolean;
    errorMessage: string;
}

export class File implements IFile{
    uploaded: boolean;
    uploading: boolean;
    percentage: number;
    url: string;
    error: boolean;
    errorMessage: string;

    constructor(uploading?:boolean, uploaded?: boolean, percentage?: number, url?:string){
        this.uploaded = uploaded;
        this.percentage = percentage;
        this.url = url;
        this.uploading = uploading;
    }
}