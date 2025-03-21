/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'mat_outline:admin_panel_settings',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : 'mat_outline:settings',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: 'heroicons_outline:sparkles',
        children: [
            {
                 id   : 'category',
                title: 'Category',
                type : 'basic',
                icon : 'mat_outline:category',
                link : '/Category'
            }
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'mat_outline:admin_panel_settings',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : 'mat_outline:settings',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: 'heroicons_outline:sparkles',
        children: [
            {
                 id   : 'category',
                title: 'Category',
                type : 'basic',
                icon : 'mat_outline:category',
                link : '/Category'
            }
        ],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'mat_outline:admin_panel_settings',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : 'mat_outline:settings',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: 'heroicons_outline:sparkles',
        children: [
            {
                 id   : 'category',
                title: 'Category',
                type : 'basic',
                icon : 'mat_outline:category',
                link : '/Category'
            }
        ],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'mat_outline:admin_panel_settings',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : 'mat_outline:settings',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: 'heroicons_outline:sparkles',
        children: [
            {
                 id   : 'category',
                title: 'Category',
                type : 'basic',
                icon : 'mat_outline:category',
                link : '/Category'
            }
        ],
    },
];
