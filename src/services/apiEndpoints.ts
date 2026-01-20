const prefix = '/api';
export const API_ENDPOINTS = {
  LOGIN: `${prefix}/user/v1/account/login`,
  ADMIN_LOGIN: `${prefix}/user/v1/admin/login`,
  USER_PROFILE: `${prefix}/user/v1/user/read`,
  TARGETED_SOLUTIONS: `${prefix}/survey/v1/solutions/targetedSolutions`,
  OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/entities`,
  UPDATE_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/updateEntities`,
  SEARCH_OBSERVATION_ENTITIES: `${prefix}/survey/v1/observations/searchEntities`,
  OBSERVATION_SOLUTION: `${prefix}/survey/v1/observations/assessment`,
  OBSERVATION_SUBMISSIONS: `${prefix}/survey/v1/observationSubmissions/list`,
  PARTICIPANTS_LIST: `${prefix}/user/v1/account/search`,
  PARTICIPANTS_SUB_ENTITY_LIST: `${prefix}/entity-management/v1/entities/subEntityList`,
  ENTITY_DETAILS: `${prefix}/entity-management/v1/entities/details`,
  PROJECT_CATEGORIES_LIST: `/project/v1/library/categories/list?parentId=null&keywords=idp&getChildren=true`,
  GET_ENTITY_DETAILS: (id: string) =>
    `${prefix}/entity-management/v1/entities/details/${id}`,
  UPDATE_ENTITY_DETAILS: (id: string) =>
    `${prefix}/entity-management/v1/entities/update/${id}`,
};
