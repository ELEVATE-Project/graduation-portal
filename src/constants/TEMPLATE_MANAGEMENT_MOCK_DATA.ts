/**
 * Template Management Mock Data
 * Mock data for the Template Management table
 */

export interface Template {
  id: string;
  templateName: string;
  status: 'Active' | 'Inactive';
  creator: string;
  tasks: number;
  createdDate: string;
}

export const TEMPLATE_MANAGEMENT_MOCK_DATA: Template[] = [
  {
    id: '1',
    templateName: 'GBL Intervention Plan - Entrepreneurship Track',
    status: 'Active',
    creator: 'Admin User',
    tasks: 38,
    createdDate: '2024-11-15',
  },
  {
    id: '2',
    templateName: 'GBL Intervention Plan - Employment Track',
    status: 'Active',
    creator: 'Admin User',
    tasks: 34,
    createdDate: '2024-11-15',
  },
  {
    id: '3',
    templateName: 'GBL Intervention Plan - Entrepreneurship Track',
    status: 'Inactive',
    creator: 'Admin User',
    tasks: 36,
    createdDate: '2024-10-01',
  },
  {
    id: '4',
    templateName: 'GBL Intervention Plan - Employment Track',
    status: 'Inactive',
    creator: 'Admin User',
    tasks: 32,
    createdDate: '2024-10-01',
  },
];

