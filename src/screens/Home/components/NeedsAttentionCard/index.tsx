import React from 'react';
import { Box, VStack, HStack, Text, Progress, ProgressFilledTrack, Card } from '@ui';
import { LucideIcon } from '@ui';
import { needsAttentionCardStyles } from './Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';

interface Participant {
  name: string;
  id: string;
  progress: number;
}

interface NeedsAttentionCardProps {
  participants?: Participant[];
}

const NeedsAttentionCard: React.FC<NeedsAttentionCardProps> = ({
  participants = [
    { name: 'Bongani Zungu', id: '1006C', progress: 5 },
    { name: 'Mbali Cele', id: '1006D', progress: 8 },
    { name: 'Dakalo Ramaano', id: '1010', progress: 15 },
    { name: 'Rebecca Stone', id: '1016', progress: 19 },
    { name: 'Andile Nkosi', id: '1007', progress: 28 },
  ],
}) => {
  const toRgba = (color: string, alpha: number) => {
    if (/^#([0-9a-fA-F]{6})$/.test(color)) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (/^#([0-9a-fA-F]{3})$/.test(color)) {
      const r = parseInt(color[1] + color[1], 16);
      const g = parseInt(color[2] + color[2], 16);
      const b = parseInt(color[3] + color[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  };

  const warning = (theme.tokens.colors.warning500 as string) || '#fe9a00';
  const iconBg = toRgba(warning, 0.12);
  const rowBg = toRgba(warning, 0.08);
  const rowBorder = toRgba(warning, 0.35);

  return (
    <Card {...needsAttentionCardStyles.container} variant="elevated">
      <HStack {...needsAttentionCardStyles.header}>
        <Box {...needsAttentionCardStyles.iconContainer} bg={iconBg as any}>
          <LucideIcon name="Clock" size={20} color="$warning500" />
        </Box>
        <Text {...TYPOGRAPHY.h4} color="$textPrimary">
          Needs Attention
        </Text>
      </HStack>
      
      <VStack {...needsAttentionCardStyles.content}>
        {participants.map((participant, index) => (
          <Card
            key={index}
            {...needsAttentionCardStyles.participantItem}
            bg={rowBg as any}
            borderColor={rowBorder as any}
          >
            <HStack {...needsAttentionCardStyles.participantRow}>
              <VStack {...needsAttentionCardStyles.participantInfo}>
                <Text {...TYPOGRAPHY.bodySmall} color="$textPrimary" fontWeight="$medium">
                  {participant.name}
                </Text>
                <Text {...TYPOGRAPHY.caption} color="$textSecondary">
                  {participant.id}
                </Text>
              </VStack>
              <HStack {...needsAttentionCardStyles.participantRight} space="sm" alignItems="center">
                <Text {...TYPOGRAPHY.h4} color="$warning500" fontWeight="$bold">
                  {participant.progress}%
                </Text>
                <Progress
                  value={participant.progress}
                  w={60}
                  h="$1.5"
                  bg="$progressBarBackground"
                  {...needsAttentionCardStyles.progressBar}
                >
                  <ProgressFilledTrack bg="$blue500" />
                </Progress>
              </HStack>
            </HStack>
          </Card>
        ))}
      </VStack>
    </Card>
  );
};

export default NeedsAttentionCard;

