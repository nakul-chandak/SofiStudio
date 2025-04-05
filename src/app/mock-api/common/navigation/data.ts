/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : '',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: '',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : '',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : '',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: '',
        children: [
            {
                 id  :'category',
                title: 'Category',
                type : 'basic',
                icon : '',
                link : '/category'
            }
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : '',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: '',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : '',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : '',
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
                 id  : 'category',
                title: 'Category',
                type : 'basic',
                icon : '',
                link : '/category'
            }
        ],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : '',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: '',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : '',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : '',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: '',
        children: [
            {
                 id  : 'category',
                title: 'Category',
                type : 'basic',
                icon : '',
                link : '/category'
            }
        ],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Home',
        type : 'basic',
        icon : '',
        link : '/home'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: '',
        children: [
            {
                 id   : 'user',
                title: 'Users',
                type : 'basic',
                icon : '',
                link : '/users'
            },
            {
                id   : 'settings',
                title: 'Settings',
                type : 'basic',
                icon : '',
                link : '/settings'
            },
        ],
    },
    {
        id: 'content',
        title: 'Content',
        type: 'group',
        icon: '',
        children: [
            {
                 id  : 'category',
                title: 'Category',
                type : 'basic',
                icon : '',
                link : '/category'
            }
        ],
    },
];
