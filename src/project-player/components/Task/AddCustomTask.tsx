import React, { useState } from 'react';
import { Box, HStack, Text } from '@gluestack-ui/themed';
import { Pressable } from 'react-native';
import { LucideIcon } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { useProjectContext } from '../../context/ProjectContext';
import AddCustomTaskModal from './AddCustomTaskModal';
import { addCustomTaskStyles } from './Styles';
import { AddCustomTaskProps } from 'src/project-player/types';

const AddCustomTask: React.FC<AddCustomTaskProps> = ({
  templateId,
  templateName,
}) => {
  const { t } = useLanguage();
  const { config } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if AddCustomTask button should be shown (default to true if not specified)
  const shouldShowButton = config.showAddCustomTaskButton !== false;

  // Don't render if config says not to show
  if (!shouldShowButton) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Add Task Button */}
      <Pressable
        onPress={handleOpenModal}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Box
          {...addCustomTaskStyles.buttonBox}
          {...(isHovered ? addCustomTaskStyles.buttonBoxHovered : {})}
        >
          <HStack {...addCustomTaskStyles.buttonContent}>
            <LucideIcon
              name="Plus"
              size={18}
              color={theme.tokens.colors.primary500}
              strokeWidth={2.5}
            />
            <Text
              {...TYPOGRAPHY.button}
              color="$primary500"
              fontWeight="$semibold"
            >
              {t('projectPlayer.addTaskToPillar')}
            </Text>
          </HStack>
        </Box>
      </Pressable>

      {/* Add Custom Task Modal */}
      <AddCustomTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        templateId={templateId}
        templateName={templateName}
        mode="add"
      />
    </>
  );
};

export default AddCustomTask;
