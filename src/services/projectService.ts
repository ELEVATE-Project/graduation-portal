import TEMPLATE_PATHWAY_DATA from '@constants/TEMPLATE_PATHWAYS';
import TEMPLATE_CATEGORIES from '@constants/TEMPLATE_CATEGORIES';
import { TemplateData } from '@app-types/screens';

// TODO: Replace simulated API calls with real backend integration when API endpoints are available
export const getProjectTemplates = async (): Promise<TemplateData[]> => {
    // Simulate API call - Replace with actual fetch/axios call in production
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(TEMPLATE_PATHWAY_DATA);
        }, 100);
    });
};

export const getProjectCategories = async (): Promise<{ name: string; options: string[] }[]> => {
    // Simulate API call - Replace with actual fetch/axios call in production
    return new Promise((resolve) => {
        setTimeout(() => {
            const categoriesArray = Object.entries(TEMPLATE_CATEGORIES).map(([name, options]) => ({
                name,
                options,
            }));
            resolve(categoriesArray);
        }, 100);
    });
};
