import { Routes } from '@angular/router';
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component';
import { SettingsAccountComponent } from './account/account.component';
import { inject } from '@angular/core';
import { SuperAdminService } from 'app/shared/api/services/api';

export default [
    {
        path: '',
        component: SettingsComponent,
        resolve: {
        },
        children: [
            {
                path: '',
                component: SettingsAccountComponent,
                resolve: {
                    superAdminInfraIntegration: () => inject(SuperAdminService).userMeSuperAdminGetDataGet('INFRA-INTEGRATION'),
                    superAdminUXIntegration: () => inject(SuperAdminService).userMeSuperAdminGetUXDataGet('UX-INTEGRATION')
                }
            }
        ]
    },
] as Routes;
