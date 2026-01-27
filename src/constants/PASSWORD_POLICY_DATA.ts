export const HIERARCHY_KEYS = [
    {
        id: 'admin',
        titleKey: 'admin.passwordPolicyPage.cards.admin.title',
        badgeKey: 'admin.passwordPolicyPage.cards.admin.badge',
        badgeColor: '$error900', 
        sections: [
            {
                type: 'success',
                titleKey: 'admin.passwordPolicyPage.labels.canResetFor',
                itemsKey: 'admin.passwordPolicyPage.cards.admin.canResetFor',
            }
        ],
        noteKey: 'admin.passwordPolicyPage.cards.admin.note'
    },
    {
        id: 'supervisor',
        titleKey: 'admin.passwordPolicyPage.cards.supervisor.title',
        badgeKey: 'admin.passwordPolicyPage.cards.supervisor.badge',
        badgeColor: '$error600',
        sections: [
            {
                type: 'success',
                titleKey: 'admin.passwordPolicyPage.labels.canResetFor',
                itemsKey: 'admin.passwordPolicyPage.cards.supervisor.canResetFor',
            },
            {
                type: 'error',
                titleKey: 'admin.passwordPolicyPage.labels.cannotResetFor',
                itemsKey: 'admin.passwordPolicyPage.cards.supervisor.cannotResetFor',
            }
        ]
    },
    {
        id: 'lc',
        titleKey: 'admin.passwordPolicyPage.cards.lc.title',
        badgeKey: 'admin.passwordPolicyPage.cards.lc.badge',
        badgeColor: '$gray600',
        sections: [
            {
                type: 'success',
                titleKey: 'admin.passwordPolicyPage.labels.selfServiceOnly',
                icon: 'Key',
                itemsKey: 'admin.passwordPolicyPage.cards.lc.selfServiceOnly',
            },
            {
                type: 'error',
                titleKey: 'admin.passwordPolicyPage.labels.cannotResetFor',
                itemsKey: 'admin.passwordPolicyPage.cards.lc.cannotResetFor',
            }
        ]
    }
];

export const REQUIREMENTS_KEYS = {
    strength: {
        titleKey: 'admin.passwordPolicyPage.section2.strengthRequirements.title',
        itemsKey: 'admin.passwordPolicyPage.section2.strengthRequirements.items'
    },
    process: {
        titleKey: 'admin.passwordPolicyPage.section2.resetProcess.title',
        itemsKey: 'admin.passwordPolicyPage.section2.resetProcess.items'
    }
};
