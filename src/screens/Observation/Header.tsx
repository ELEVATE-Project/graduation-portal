import React from 'react';
import {
  HStack,
  Text,
  Box,
  Progress,
  ProgressFilledTrack,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { observationStyles } from './Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { StatusBadge } from '@components/ObservationCards';
import { PageHeader } from '@components/PageHeader';

interface HeaderProps {
  title: string;
  progress: number;
  participantInfo: {
    name: string;
    date: string;
  } | null;
  onBackPress: () => void;
  status: string;
}

const Header: React.FC<HeaderProps> = ({ title, progress, participantInfo, onBackPress, status }) => {
  const { t } = useLanguage();

  return (
    <PageHeader
      onBackPress={onBackPress}
      backButtonText={t('common.back')}
      _content={{ "$md-px": '$0', px: '$0', py: '$0' }}
      _container={{ "$md-px": '$6', px: '$4', py: '$4' }}
    >
      {/* Title and Progress Badge Row */}
      <HStack
        {...observationStyles.titleAndProgressContainer}
      >
        <Text {...TYPOGRAPHY.h4}>
          {title}
        </Text>
        <StatusBadge status={status} preFix={<Text {...TYPOGRAPHY.caption}> {progress}% </Text>} />
      </HStack>

      {/* Progress Bar */}
      <Box {...observationStyles.progressBarContainer}>
        <Progress value={progress} {...observationStyles.progressBar}>
          <ProgressFilledTrack {...observationStyles.progressBarFill} />
        </Progress>
      </Box>

      {/* Participant Name and Date */}
      {participantInfo && (
        <Text {...observationStyles.participantInfoText}>
          {participantInfo.name} • {participantInfo.date}
        </Text>
      )}
    </PageHeader>
  );
};

export default Header;

