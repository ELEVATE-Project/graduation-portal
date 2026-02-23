import React from 'react';
import { Box, Text, VStack, HStack, Pressable } from '@ui';
import { LucideIcon } from '@ui';
import { templateCardStyles } from './Styles';

interface TemplateCardProps {
    title: string;
    description: string;
    buttonText: string;
    onDownload: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
    title,
    description,
    buttonText,
    onDownload,
}) => {
    return (
        <Pressable {...templateCardStyles.container}>
            <VStack {...templateCardStyles.contentVStack}>
                <HStack {...templateCardStyles.headerHStack}>
                    <Text {...templateCardStyles.title}>{title}</Text>
                    <LucideIcon name="Info" size={16} color="$textSecondary" />
                </HStack>

                <Text {...templateCardStyles.description}>{description}</Text>

                <Box {...templateCardStyles.buttonContainer}>
                    <Pressable
                        onPress={onDownload}
                        {...templateCardStyles.downloadButton}
                    >
                        <LucideIcon name="FileDown" size={16} color="$textPrimary" />
                        <Text {...templateCardStyles.buttonText}>{buttonText}</Text>
                    </Pressable>
                </Box>
            </VStack>
        </Pressable>
    );
};
