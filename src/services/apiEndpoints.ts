const prefix = '/api';
export const API_ENDPOINTS = {
    LOGIN: `${prefix}/user/v1/account/login`,
    ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
    USER_PROFILE: `${prefix}/user/v1/user/read`,
    PARTICIPANTS_LIST: `${prefix}/user/v1/account/search`,  // Used for both participants and users (differentiated by type parameter)
    USER_ROLES_LIST: `${prefix}/user/v1/user-role/list`,  // Fetch available user roles for dynamic filter
    ENTITY_TYPES_LIST: `${prefix}/entity-management/v1/entityTypes/list`,  // Fetch entity types (province, district, etc.)
    ENTITIES_BY_TYPE: `${prefix}/entity-management/v1/entities/listByEntityType`,  // Fetch entities by type (e.g., provinces)
    TARGETED_SOLUTIONS: `${prefix}/survey/v1/solutions/targetedSolutions`,
    OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/entities`,
    UPDATE_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/updateEntities`,
    SEARCH_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/searchEntities`,
    OBSERVATION_SOLUTION: `${prefix}/survey/v1/observations/assessment`,
    OBSERVATION_SUBMISSIONS: `${prefix}/survey/v1/observationSubmissions/list`,
    PARTICIPANTS_SUB_ENTITY_LIST: `${prefix}/entity-management/v1/entities/subEntityList`,
    ENTITY_DETAILS: `${prefix}/entity-management/v1/entities/details`,
}