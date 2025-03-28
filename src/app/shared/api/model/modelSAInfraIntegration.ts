/**
 * AI&D SOFI-META API
 * AI&D SOFI Meta Data Services API
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
//import { ModelNull } from './modelNull';

import { DateTime } from "luxon";
import { ModelSAUXIntegrationData } from "./modelSAUXIntegration";

export interface ModelSAInfraIntegration {
    createDatetime: DateTime; 
    createdBy: string;
    data: ModelSAInfraIntegrationData;
    updateDatetime: DateTime;
    updatedBy: string;
    _id: string;
}

export interface ModelSAInfraIntegrationData {
    infra_api_url: string;
    infra_api_key: string;
    infra_api_host_id: string;
    connectionString?: string | null;
    containers?: any | null;    
    type: string;
}

export interface ModelSAInfraIntegrationUpdate {
    data: ModelSAInfraIntegrationData | ModelSAUXIntegrationData;
}

