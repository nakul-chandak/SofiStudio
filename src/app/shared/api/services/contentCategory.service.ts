import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { ModelCommonResponse } from '../model/modelCommonResponse';
import { ModelContentCategoryDelete } from '../model/modelContentCategoryDelete';
//import { ModelNull } from '../model/modelNull';

import { BASE_PATH }  from '../variables';
import { Configuration }  from '../configuration';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class ContentCategoryService {

   protected basePath = environment.BASE_API_PATH;
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Add Category
     * 
     * @param name 
     * @param workflowName 
     * @param description 
     * @param tags 
     * @param file 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addCategoryContentCategoryAddPostForm(formdata:FormData, observe?: 'body', reportProgress?: boolean): Observable<ModelCommonResponse>;
    public addCategoryContentCategoryAddPostForm(formdata:FormData, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ModelCommonResponse>>;
    public addCategoryContentCategoryAddPostForm(formdata:FormData, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ModelCommonResponse>>;
    public addCategoryContentCategoryAddPostForm(formdata:FormData, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // authentication (OAuth2PasswordBearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);
        

        return this.httpClient.request<ModelCommonResponse>('post',`${this.basePath}/content/category/add`,
            {
                body: formdata,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete Category
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteCategoryContentCategoryDeletePost(body: ModelContentCategoryDelete, observe?: 'body', reportProgress?: boolean): Observable<ModelCommonResponse>;
    public deleteCategoryContentCategoryDeletePost(body: ModelContentCategoryDelete, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ModelCommonResponse>>;
    public deleteCategoryContentCategoryDeletePost(body: ModelContentCategoryDelete, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ModelCommonResponse>>;
    public deleteCategoryContentCategoryDeletePost(body: ModelContentCategoryDelete, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling deleteCategoryContentCategoryDeletePost.');
        }

        let headers = this.defaultHeaders;

        // authentication (OAuth2PasswordBearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ModelCommonResponse>('post',`${this.basePath}/content/category/delete`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Find Category
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findCategoryContentCategoryFindIdGet(id: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public findCategoryContentCategoryFindIdGet(id: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public findCategoryContentCategoryFindIdGet(id: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public findCategoryContentCategoryFindIdGet(id: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling findCategoryContentCategoryFindIdGet.');
        }

        let headers = this.defaultHeaders;

        // authentication (OAuth2PasswordBearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('get',`${this.basePath}/content/category/find/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * List All Categories
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listAllCategoriesContentCategoryListAllGet(observe?: 'body', reportProgress?: boolean): Observable<any>;
    public listAllCategoriesContentCategoryListAllGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public listAllCategoriesContentCategoryListAllGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public listAllCategoriesContentCategoryListAllGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // authentication (OAuth2PasswordBearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('get',`${this.basePath}/content/category/list-all`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Search Categories
     * 
     * @param term 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public searchCategoriesContentCategorySearchGet(term: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public searchCategoriesContentCategorySearchGet(term: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public searchCategoriesContentCategorySearchGet(term: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public searchCategoriesContentCategorySearchGet(term: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (term === null || term === undefined) {
            throw new Error('Required parameter term was null or undefined when calling searchCategoriesContentCategorySearchGet.');
        }

        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (term !== undefined && term !== null) {
            queryParameters = queryParameters.set('term', <any>term);
        }

        let headers = this.defaultHeaders;

        // authentication (OAuth2PasswordBearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('get',`${this.basePath}/content/category/search`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update Category
     * 
     * @param id 
     * @param name 
     * @param workflowName 
     * @param description 
     * @param tags 
     * @param file 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateCategoryContentCategoryUpdatePostForm(id: string, name: string, workflowName: string, description: string, tags: Array<string>, file: string | null, observe?: 'body', reportProgress?: boolean): Observable<ModelCommonResponse>;
    public updateCategoryContentCategoryUpdatePostForm(id: string, name: string, workflowName: string, description: string, tags: Array<string>, file: string | null, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ModelCommonResponse>>;
    public updateCategoryContentCategoryUpdatePostForm(id: string, name: string, workflowName: string, description: string, tags: Array<string>, file: string | null, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ModelCommonResponse>>;
    public updateCategoryContentCategoryUpdatePostForm(id: string, name: string, workflowName: string, description: string, tags: Array<string>, file: string | null, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateCategoryContentCategoryUpdatePost.');
        }

        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling updateCategoryContentCategoryUpdatePost.');
        }

        if (workflowName === null || workflowName === undefined) {
            throw new Error('Required parameter workflowName was null or undefined when calling updateCategoryContentCategoryUpdatePost.');
        }

        if (description === null || description === undefined) {
            throw new Error('Required parameter description was null or undefined when calling updateCategoryContentCategoryUpdatePost.');
        }

        if (tags === null || tags === undefined) {
            throw new Error('Required parameter tags was null or undefined when calling updateCategoryContentCategoryUpdatePost.');
        }

        if (file === null || file === undefined) {
            throw new Error('Required parameter file was null or undefined when calling updateCategoryContentCategoryUpdatePost.');
        }

        let headers = this.defaultHeaders;

        // authentication (OAuth2PasswordBearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): void; };
        let useForm = false;
        let convertFormParamsToString = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        }

        if (id !== undefined) {
            formParams = formParams.append('id', <any>id) as any || formParams;
        }
        if (name !== undefined) {
            formParams = formParams.append('name', <any>name) as any || formParams;
        }
        if (workflowName !== undefined) {
            formParams = formParams.append('workflowName', <any>workflowName) as any || formParams;
        }
        if (description !== undefined) {
            formParams = formParams.append('description', <any>description) as any || formParams;
        }
        if (tags) {
            tags.forEach((element) => {
                formParams = formParams.append('tags', <any>element) as any || formParams;
            })
        }
        if (file !== undefined) {
            formParams = formParams.append('file', <any>file) as any || formParams;
        }

        return this.httpClient.request<ModelCommonResponse>('post',`${this.basePath}/content/category/update`,
            {
                body: convertFormParamsToString ? formParams.toString() : formParams,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
