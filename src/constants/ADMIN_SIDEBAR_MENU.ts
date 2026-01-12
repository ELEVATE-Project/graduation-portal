interface SidebarItem {
  key: string;
  label: string;
  icon: string; // Lucide icon name
  route?: string;
  children?: SidebarItem[];
}

export const MAIN_MENU_ITEMS: SidebarItem[] = [
  {
    key: 'user-management',
    label: 'admin.menu.userManagement',
    icon: 'Users', // Lucide icon name
    route: 'user-management',
  },
  {
    key: 'template-management',
    label: 'admin.menu.templateManagement',
    icon: 'FileText', // Lucide icon name
    route: 'TemplateManagement',
  },
  {
    key: 'audit-log',
    label: 'admin.menu.auditLog',
    icon: 'Activity', // Lucide icon name for activity log
    route: 'audit-log',
  },
];

export const QUICK_ACTION_MENU_ITEMS: SidebarItem[] = [
  {
    key: 'upload-users',
    label: 'admin.menu.uploadUsers',
    icon: 'Upload', // Lucide icon name
    route: 'UploadUsers',
  },
  {
    key: 'new-lc',
    label: 'admin.menu.createUser',
    icon: 'UserPlus', // Lucide icon name
    route: 'NewLC',
  },
];
