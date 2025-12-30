import type { TemplateData } from '@app-types/screens';

export const TEMPLATE_PATHWAY_DATA: TemplateData[] = [
  {
    id: 'entrepreneurship-2',
    title: 'Entrepreneurship Pathway 2',
    description:
      'Alternative comprehensive intervention plan for participants pursuing entrepreneurship with tailored support across all pillars',
    tag: 'Entrepreneurship',
    badgeBg: '$badgeSuccessBg',
    badgeTextColor: '$badgeSuccessText',
    pillarsCount: 4,
    tasksCount: 38,
    version: 'v2.1',
    includedPillars: [
      { name: 'Social Empowerment', tasks: 11 },
      { name: 'Livelihoods', tasks: 17 },
      { name: 'Financial Inclusion', tasks: 6 },
      { name: 'Social Protection', tasks: 4 },
    ],
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship Pathway',
    description:
      'Comprehensive intervention plan for participants starting or enhancing a business with full support across all pillars',
    tag: 'Entrepreneurship',
    badgeBg: '$badgeSuccessBg',
    badgeTextColor: '$badgeSuccessText',
    pillarsCount: 4,
    tasksCount: 38,
    version: 'v2.1',
    includedPillars: [
      { name: 'Social Empowerment', tasks: 11 },
      { name: 'Livelihoods', tasks: 17 },
      { name: 'Financial Inclusion', tasks: 6 },
      { name: 'Social Protection', tasks: 4 },
    ],
  },
  {
    id: 'employment',
    title: 'Employment Pathway',
    description:
      'Comprehensive intervention plan for participants seeking formal employment with full support across all pillars',
    tag: 'Employment',
    badgeBg: '$badgeInfoBg',
    badgeTextColor: '$badgeInfoText',
    pillarsCount: 4,
    tasksCount: 34,
    version: 'v2.1',
    includedPillars: [
      { name: 'Social Empowerment', tasks: 11 },
      { name: 'Livelihoods', tasks: 13 },
      { name: 'Financial Inclusion', tasks: 6 },
      { name: 'Social Protection', tasks: 4 },
    ],
  },
];

export default TEMPLATE_PATHWAY_DATA;
