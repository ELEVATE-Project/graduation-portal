import React from 'react';
import {
  HStack,
  VStack,
  Text,
  Box,
  Progress,
  ProgressFilledTrack,
  LucideIcon,
  Container,
  Button,
  ButtonText,
  ButtonIcon
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { observationStyles } from './Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { StatusBadge } from '@components/ObservationCards';

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
    <VStack {...observationStyles.headerContainer}>
      <Container $md-px='$6' px='$4' py='$4'>
        {/* Top Row: Back Button and Action Buttons */}
        <HStack
          {...observationStyles.headerContent}
        >
          {/* @ts-ignore: Back Button */}
          <Button variant="ghost" onPress={onBackPress}>
            <ButtonIcon as={LucideIcon} name="ArrowLeft" size={16} />
            <ButtonText {...TYPOGRAPHY.bodySmall}>{t('common.back')}</ButtonText>
          </Button>
        </HStack>

        {/* Title and Progress Badge Row */}
        <HStack
          {...observationStyles.titleAndProgressContainer}
        >
          <Text {...TYPOGRAPHY.h4}>
            {title}
          </Text>

          {/* Progress Badge */}
          <Box
            {...observationStyles.progressBadge}
          >
            <Text {...observationStyles.progressBadgeText}>
              {progress}% 
            </Text>
            <StatusBadge status={status} />
          </Box>
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
      </Container>
    </VStack>
  );
};

export default Header;

