import TEMPLATE_PATHWAY_DATA from '@constants/TEMPLATE_PATHWAYS';
import TEMPLATE_CATEGORIES from '@constants/TEMPLATE_CATEGORIES';
import { TemplateData } from '@app-types/screens';

export const getProjectTemplates = async (): Promise<TemplateData[]> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(TEMPLATE_PATHWAY_DATA);
        }, 100);
    });
};

export const getProjectCategories = async (): Promise<{ name: string; options: string[] }[]> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const categoriesArray = Object.entries(TEMPLATE_CATEGORIES).map(([name, options]) => ({
                name,
                options: options as string[],
            }));
            resolve(categoriesArray);
        }, 100);
    });
};
