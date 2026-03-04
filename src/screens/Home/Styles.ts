export const dashboardStyles = {
  scrollView: {
    p: '$4',
    bg: '$backgroundColor',
    flex: 1,
  },
  mainVStack: {
    space: 'lg',
  },
  contentContainer: {
    space: 'lg',
  },
  metricsRow: {
    flexWrap: 'wrap',
    gap: '$2',
    justifyContent: 'space-between',
    $md: {
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      gap: '$4',
    },
  },
  metricColumn: {
    width: '48%',
    gap: '$2',
    $md: {
      width: 'auto',
      flex: 1,
    },
  },
  cardsRow: {
    flexWrap: 'wrap',
    gap: '$4',
    alignItems: 'stretch' as const,
    $md: {
      flexWrap: 'nowrap',
    },
  },
  cardColumn: {
    flex: 1,
    alignSelf: 'stretch' as const,
    minWidth: '100%',
    $md: {
      minWidth: '48%',
    },
  },
  placeholderBox: {
    p: '$8',
    bg: '$white',
    borderRadius: '$xl',
    borderWidth: 1,
    borderColor: '$borderColor',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  titleText: {
    fontSize: '$2xl',
    fontWeight: '$bold',
  },
  welcomeText: {
    color: '$textLight500',
  },
  statsHStack: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionsContainer: {
    flexWrap: 'wrap',
    space: 'lg',
  },
  sectionBox: {
    flex: 1,
    w: '100%',
  },
  sectionTitle: {
    fontWeight: '$bold',
    mb: '$2',
  },
  // Quick Actions Card
  quickActionsCard: {
    borderWidth: 1,
    borderColor: '$borderLight300',
    rounded: '$2xl',
    p: '$4',
    bg: '$backgroundLight0',
  },
} as const;
