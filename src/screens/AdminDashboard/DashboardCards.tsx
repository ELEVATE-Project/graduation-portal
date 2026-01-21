import React, { useState } from 'react';
import { HStack, Box, Card, VStack, Text, Pressable, Badge, BadgeText } from '@ui';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { dashboardCardsStyles } from './DashboardStyle';
import { DashboardCard } from '@constants/ADMIN_DASHBOARD_CARDS';

interface DashboardCardsProps {
  cards: DashboardCard[];
  userId?: string;
}

/**
 * DashboardCards Component
 * Displays a horizontal stack of indicator cards for the admin dashboard
 */
const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  cards, 
  userId = '' 
}) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const handleCardPress = (card: DashboardCard) => {
    if (card.navigationUrl) {
      // @ts-ignore - Navigation type inference
      navigation.navigate(card.navigationUrl as never);
    }
  };

  return (
    <HStack {...dashboardCardsStyles.cardsContainer}>
      {cards.map(card => (
        <Pressable
          key={card.id}
          {...dashboardCardsStyles.pressable}
          onPress={() => handleCardPress(card)}
        >
          <Card 
            {...dashboardCardsStyles.card}
            borderColor={hoveredCardId === card.id ? '$primary500' : '$borderColor'}
            // @ts-ignore - Web-specific mouse events
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            style={hoveredCardId === card.id ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            } : undefined}
          >
            <VStack {...dashboardCardsStyles.cardContent}>
              {/* Icon and Title Row */}
              <HStack {...dashboardCardsStyles.iconTitleRow}>
                <HStack {...dashboardCardsStyles.iconTitleContainer}>
                  {/* Icon Container */}
                  <Box
                    {...dashboardCardsStyles.iconBox}
                    bg={card.iconColor || dashboardCardsStyles.iconBoxDefaultBg}
                  >
                    <LucideIcon 
                      name={card.icon || 'Circle'} 
                      size={dashboardCardsStyles.iconSize} 
                      color={dashboardCardsStyles.iconColor} 
                    />
                  </Box>

                  {/* Title */}
                  <VStack {...dashboardCardsStyles.titleContainer}>
                    <Text {...dashboardCardsStyles.titleText}>
                      {t(card.title)}
                    </Text>
                  </VStack>
                </HStack>

                {/* Right Arrow Icon */}
                <LucideIcon 
                  name="ChevronRight" 
                  {...dashboardCardsStyles.chevronIcon}
                />
              </HStack>

              {/* Description */}
              <Text {...dashboardCardsStyles.descriptionText}>
                {t(card.description)}
              </Text>

              {/* Topics Badge */}
              {card.status && (
                <HStack {...dashboardCardsStyles.badgeContainer}>
                  <Badge {...dashboardCardsStyles.badge}>
                    <BadgeText {...dashboardCardsStyles.badgeText}>
                      {t(card.status.label)}
                    </BadgeText>
                  </Badge>
                </HStack>
              )}
            </VStack>
          </Card>
        </Pressable>
      ))}
    </HStack>
  );
};

export default DashboardCards;
