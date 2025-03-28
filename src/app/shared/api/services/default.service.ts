/**
 * AI&D SOFI-META API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.4
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { HTTPValidationError } from '../model/hTTPValidationError';
//import { ModelNull } from '../model/modelNull';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class DefaultService {

    protected basePath = '/';
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
     * Live
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public liveLiveGet(observe?: 'body', reportProgress?: boolean): Observable<any>;
    public liveLiveGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public liveLiveGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public liveLiveGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

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

        return this.httpClient.request<any>('get',`${this.basePath}/live`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Ready
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public readyReadyGet(observe?: 'body', reportProgress?: boolean): Observable<any>;
    public readyReadyGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public readyReadyGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public readyReadyGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

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

        return this.httpClient.request<any>('get',`${this.basePath}/ready`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Signin User
     * 
     * @param grantType 
     * @param username 
     * @param password 
     * @param scope 
     * @param clientId 
     * @param clientSecret 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public signinUserTokenPostForm(grantType: string, username: string, password: string, scope: string, clientId: string, clientSecret: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public signinUserTokenPostForm(grantType: string, username: string, password: string, scope: string, clientId: string, clientSecret: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public signinUserTokenPostForm(grantType: string, username: string, password: string, scope: string, clientId: string, clientSecret: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public signinUserTokenPostForm(grantType: string, username: string, password: string, scope: string, clientId: string, clientSecret: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (grantType === null || grantType === undefined) {
            throw new Error('Required parameter grantType was null or undefined when calling signinUserTokenPost.');
        }

        if (username === null || username === undefined) {
            throw new Error('Required parameter username was null or undefined when calling signinUserTokenPost.');
        }

        if (password === null || password === undefined) {
            throw new Error('Required parameter password was null or undefined when calling signinUserTokenPost.');
        }

        if (scope === null || scope === undefined) {
            throw new Error('Required parameter scope was null or undefined when calling signinUserTokenPost.');
        }

        if (clientId === null || clientId === undefined) {
            throw new Error('Required parameter clientId was null or undefined when calling signinUserTokenPost.');
        }

        if (clientSecret === null || clientSecret === undefined) {
            throw new Error('Required parameter clientSecret was null or undefined when calling signinUserTokenPost.');
        }

        let headers = this.defaultHeaders;

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
            'application/x-www-form-urlencoded'
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

        if (grantType !== undefined) {
            formParams = formParams.append('grant_type', <any>grantType) as any || formParams;
        }
        if (username !== undefined) {
            formParams = formParams.append('username', <any>username) as any || formParams;
        }
        if (password !== undefined) {
            formParams = formParams.append('password', <any>password) as any || formParams;
        }
        if (scope !== undefined) {
            formParams = formParams.append('scope', <any>scope) as any || formParams;
        }
        if (clientId !== undefined) {
            formParams = formParams.append('client_id', <any>clientId) as any || formParams;
        }
        if (clientSecret !== undefined) {
            formParams = formParams.append('client_secret', <any>clientSecret) as any || formParams;
        }

        return this.httpClient.request<any>('post',`${this.basePath}/token`,
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
