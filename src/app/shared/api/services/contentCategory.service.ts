import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { BehaviorSubject, catchError, from, map, Observable, of, ReplaySubject, tap }                                        from 'rxjs';

import { ModelCommonResponse } from '../model/modelCommonResponse';
import { ModelContentCategoryDelete } from '../model/modelContentCategoryDelete';
//import { ModelNull } from '../model/modelNull';

import { BASE_PATH }  from '../variables';
import { Configuration }  from '../configuration';
import { environment } from 'environments/environment';
import { Category } from '../model/models';

@Injectable({ providedIn: 'root' })
export class ContentCategoryService {

   protected basePath = environment.BASE_API_PATH;
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(
        null
    );

    private _category: BehaviorSubject<Category | null> = new BehaviorSubject(
        null
    );

    private _categorId: ReplaySubject<string> = new ReplaySubject<string>();


    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]> {
        return this._categories.asObservable();
    }

        /**
     * Getter for category
     */
    get category$(): Observable<Category> {
        return this._category.asObservable();
    }

    /**
     * setter for category edit and pass category Id
     */
    set setCategoryId(value: string) {
        this._categorId.next(value);
    }

      /**
     * getter for category Id
     */
    get getCategoryId$(): Observable<string> {
        return this._categorId.asObservable();
    }

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
        ).pipe(tap((category)=>{
            this._category.next(category);
        }));
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
        ).pipe(tap((categories)=>{
            this._categories.next(categories);
        }));
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

        if(term ==='') {
            return of (this.listAllCategoriesContentCategoryListAllGet().subscribe())
        }
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
        ).pipe(tap((categories)=>{
            this._categories.next(categories);
        }));
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
    public updateCategoryContentCategoryUpdatePostForm(formData:FormData, observe?: 'body', reportProgress?: boolean): Observable<ModelCommonResponse>;
    public updateCategoryContentCategoryUpdatePostForm(formData:FormData, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ModelCommonResponse>>;
    public updateCategoryContentCategoryUpdatePostForm(formData:FormData, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ModelCommonResponse>>;
    public updateCategoryContentCategoryUpdatePostForm(formData:FormData, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

       

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

       
        return this.httpClient.request<ModelCommonResponse>('post',`${this.basePath}/content/category/update`,
            {
                body: formData,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    getUrlToBlobFile(imageUrl: string, fileName: string): Observable<File | null> {
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

        return this.httpClient.get(imageUrl, { responseType: 'blob',headers:headers}).pipe(
          catchError((error) => {
            console.error('Error converting URL to Blob:', error);
            return of(null); // Return null in case of error
          }),
          map((blob) => {
            if (!blob) {
              return null; // Handle the null blob from error case
            }
            const file = new File([blob], fileName, {
              type: blob.type,
            });
            return file;
          })
        );
      }

      urlToBlob(imageUrl: string): Observable<Blob | null> {
        return from(
          fetch(imageUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
              }
              return response.blob();
            })
            .catch((error) => {
              console.error('Error fetching image:', error);
              return null;
            })
        ).pipe(
          catchError(() => of(null)) // Handle any errors from the from conversion to observable.
        );
      }
    

}
