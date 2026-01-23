import { AssessmentSurveyCardData } from '@app-types/participant';

/**
 * Log Visit Cards Constant
 * Defines all available log visit cards with their configurations
 * Uses AssessmentSurveyCardData interface to reuse ObservationCard component
 */
export const LOG_VISIT_CARDS: AssessmentSurveyCardData[] = [
  {
    id: 'individual-enterprise-visit',
    solutionId: 'individual-enterprise-visit',
    name: 'logVisit.individualEnterpriseVisit.title',
    description: 'logVisit.individualEnterpriseVisit.description',
    icon: 'FileText',
    iconColor: "$primary500",
    navigationUrl: 'observation',
  },
  {
    id: 'group-visit-form',
    solutionId: 'group-visit-form',
    name: 'logVisit.groupVisitForm.title',
    description: 'logVisit.groupVisitForm.description',
    icon: 'Users',
    iconColor: "$blue500",
    navigationUrl: 'observation',
  },
  {
    id: 'midline-survey-form',
    solutionId: 'midline-survey-form',
    name: 'logVisit.midlineSurvey.title',
    description: 'logVisit.midlineSurvey.description',
    icon: 'BarChart',
    iconColor: "$warning500",
    navigationUrl: 'observation',
  },
];

export const FILTER_KEYWORDS = {
  LOG_VISIT: ["CHECK_INS"],
  ASSESSMENT_SURVEYS: ["ASSESSMENT_SURVEY"]
}

export const ICONS = {
  "individual visit observation framework": {icon: "FileText", color: "$primary500"},
  "individual/enterprise visit": {icon: "FileText", color: "$primary500"},
  "group-visit-form": {icon: "Users", color: "$blue500"},
  "midline-survey-form": {icon: "BarChart", color: "$warning500"},
  "household profile": {icon: "Users", color: "$white", iconColor: "$primary500"},
  "midline survey": {icon: "BarChart", color: "$warning500"},
  "group visit": {icon: "Users", color: "$blue500"},
  "log visit": {icon: "Users", color: "$blue500"},
  "intervention completion survey": {icon: "FileText", color: "$primary500"},
  "big push / asset transfer observation framework-1769076753343": {icon: "FileText", color: "$primary500"},
  "big push / asset transfer": {icon: "FileText", color: "$primary500"},
  "generate business idea": {icon: "FileText", color: "$primary500"},
}