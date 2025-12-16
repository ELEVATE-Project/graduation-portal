import React from 'react';
import { Box, HStack, Text } from '@gluestack-ui/themed';
import { Participant, StatusType } from '@app-types/screens';
import { ColumnDef } from '@app-types/components';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { STATUS, PARTICIPANT_COLUMN_KEYS } from '@constants/app.constant';
import { LucideIcon } from '@ui/index';

/**
 * Progress Bar Component for Participants Table
 */
export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <HStack space="sm" alignItems="center" width="$full" maxWidth={200}>
    <Box
      flex={1}
      height={8}
      bg="$backgroundLight200"
      borderRadius="$full"
      overflow="hidden"
    >
      <Box
        width={`${progress}%`}
        height="$full"
        bg={theme.tokens.colors.info100}
        borderRadius="$full"
      />
    </Box>
    <Text
      {...TYPOGRAPHY.bodySmall}
      color={theme.tokens.colors.mutedForeground}
      minWidth={40}
    >
      {progress}%
    </Text>
  </HStack>
);

/**
 * All possible columns for Participants Table
 */
const allParticipantsColumns: ColumnDef<Participant>[] = [
  {
    key: 'name',
    label: 'participants.name',
    flex: 2,
    render: participant => (
      <Text {...TYPOGRAPHY.h4} color={theme.tokens.colors.foreground}>
        {participant.name}
      </Text>
    ),
  },
  {
    key: 'id',
    label: 'participants.participantID',
    flex: 1.5,
    render: participant => (
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
      >
        {participant.id}
      </Text>
    ),
  },
  {
    key: 'progress',
    label: 'participants.overallProgress',
    flex: 2,
    render: participant => <ProgressBar progress={participant.progress} />,
  },
  {
    key: 'graduated',
    label: 'participants.graduated',
    flex: 2,
    render: participant =>
      participant.progress === 100 ? (
        <LucideIcon
          name="AlertCircle"
          size={20}
          color={theme.tokens.colors.warning500}
        />
      ) : (
        '-'
      ),
  },
  {
    key: 'phone',
    label: 'participants.contact',
    flex: 1.5,
    render: participant => (
      <Text
        {...TYPOGRAPHY.bodySmall}
        color={theme.tokens.colors.mutedForeground}
      >
        {participant.phone}
      </Text>
    ),
  },
];

export const getParticipantsColumns = (
  status?: StatusType,
): ColumnDef<Participant>[] => {
  return allParticipantsColumns.filter(col => {
    if(([PARTICIPANT_COLUMN_KEYS.PROGRESS] as string[]).includes(col.key)) {
      if(status === STATUS.IN_PROGRESS) {return true} else {return false}
    }
    if(([PARTICIPANT_COLUMN_KEYS.GRADUATED] as string[]).includes(col.key)) {
      if(status === STATUS.GRADUATED) {return true} else {return false}
    }
    return true; // keep all other columns for any status
  });
};

/**
 * Default column configuration (for backward compatibility)
 * Shows all columns including progress
 */
export const participantsColumns = allParticipantsColumns;
