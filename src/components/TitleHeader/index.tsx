import React from 'react';
import { HStack, VStack, Text } from '@ui';
import { titleHeaderStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import { usePlatform } from '@utils/platform';

export interface TitleHeaderProps {
  title: string; // Translation key for the header title
  description: string; // Translation key for the header description
  right?: React.ReactNode;
  bottom?: React.ReactNode;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  description,
  right,
  bottom,
}) => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();

  return (
    <HStack
      justifyContent={isMobile ? 'flex-start' : 'space-between'}
      alignItems={isMobile ? 'flex-start' : 'center'}
      flexWrap="wrap"
      width="100%"
    >
      <VStack {...titleHeaderStyles.textContainer} flex={1}>
        <Text {...titleHeaderStyles.titleText}>{t(title)}</Text>
        <Text {...titleHeaderStyles.descriptionText}>{t(description)}</Text>
        {bottom && <VStack marginTop={'$3'}>{bottom}</VStack>}
      </VStack>

      {/* 
        Conditionally render right-side content (action buttons, icons, etc.)
        - Only renders if 'right' prop is provided (not null/undefined)
        - On mobile: wraps in VStack to stack buttons vertically
        - On desktop: wraps in VStack with flex-end alignment to position content on the right
        - This allows screens to optionally include action buttons without breaking layout
      */}
      {right && (
        <VStack
          alignItems={isMobile ? 'stretch' : 'flex-end'}
          width={isMobile ? '$full' : undefined}
        >
          {right}
        </VStack>
      )}
    </HStack>
  );
};

export default TitleHeader;
