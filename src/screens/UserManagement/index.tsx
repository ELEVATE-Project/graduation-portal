import React, { useState, useRef } from 'react';
import { VStack, HStack, Button, Text, Image, Box, Pressable, Card, useAlert, Modal } from '@ui';
import { View, Platform } from 'react-native';
import { LucideIcon } from '@ui/index';

import UploadIcon from '../../assets/images/UploadIcon.png';
import ExportIcon from '../../assets/images/ExportIcon.png';
import { useLanguage } from '@contexts/LanguageContext';
import BulkOperationsCard from '../../components/BulkOperationsCard';
import StatCard, { StatsRow } from '@components/StatCard';
import { USER_MANAGEMENT_STATS } from '@constants/USER_MANAGEMENT_STATS';
import { SearchFilter, FilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import FilterButton from '@components/Filter';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { usePlatform } from '@utils/platform';
import { userManagementStyles as styles } from './Styles';
import { theme } from '@config/theme';
import { getSignedUrl, uploadFileToSignedUrl, bulkUserCreate } from '../../services/bulkUploadService';

/**
 * UserManagementScreen - Layout is automatically applied by navigation based on user role
 */
const UserManagementScreen = () => {
  const { t } = useLanguage();
  const { isMobile } = usePlatform();
  const { showAlert } = useAlert();
  const data = [SearchFilter, ...FilterOptions];
  
  // File upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle CSV upload: closes options modal and triggers native file picker
  const handleUploadCSV = () => {
    setIsUploadModalOpen(false);
    // Trigger file input click
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process selected CSV file: validates file type and handles upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate CSV file extension
    if (!file.name.toLowerCase().endsWith('.csv')) {
      showAlert('error', t('admin.actions.csvValidationError'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
          return;
        }

    setIsUploading(true);
    
    try {
      // Step 1: Get signed URL
      const signedUrlResponse = await getSignedUrl(file.name);
      if (!signedUrlResponse.result?.signedUrl) {
          throw new Error(t('admin.actions.uploadErrorSignedUrl'));
        }

      // Step 2: Upload file to signed URL
      await uploadFileToSignedUrl(signedUrlResponse.result.signedUrl, file);

      // Step 3: Trigger bulk user creation
      const filePath = signedUrlResponse.result.filePath || signedUrlResponse.result.destFilePath;
      if (!filePath) {
        throw new Error(t('admin.actions.uploadErrorFilePathNotFound'));
      }
      
      const bulkCreateResponse = await bulkUserCreate(filePath, ['name', 'email'], 'UPLOAD');
      
      // Show success toast
      showAlert('success', t('admin.actions.uploadSuccess'));
      
    } catch (error: any) {
      // Use API error message if available, otherwise use generic error message
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        t('admin.actions.uploadError');
        
      showAlert('error', errorMessage);
      } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <VStack space="md" width="100%">
      <TitleHeader
        title="admin.menu.userManagement"
        description="admin.userManagementDescription"
        right={
          <HStack space="md" alignItems="center">
            <Button
              {...titleHeaderStyles.outlineButton}
              onPress={() => setIsUploadModalOpen(true)}
            >
              <HStack space="sm" alignItems="center">
                <Image 
                  source={UploadIcon}
                  style={{ width: 16, height: 16 }}
                  alt="Upload icon"
                />
                <Text {...titleHeaderStyles.outlineButtonText}>
                  {t('admin.actions.bulkUploadCSV')}
                </Text>
              </HStack>
            </Button>
            
            <Button
              {...titleHeaderStyles.solidButton}
              onPress={() => {
                // Handle create user
              }}
            >
              <HStack space="sm" alignItems="center">
                <Image 
                  source={ExportIcon}
                  style={{ width: 16, height: 16 }}
                  alt="Export icon"
                />
                <Text {...titleHeaderStyles.solidButtonText}>
                  {t('admin.actions.createUser')}
                </Text>
              </HStack>
            </Button>
          </HStack>
        }
      />
      
      <FilterButton data={data} />
      
      <BulkOperationsCard/>
      {/* Stats and Bulk Operations - Display after table */}
      <View style={{ marginTop: 24, width: '100%' }}>
        <StatsRow>
          {USER_MANAGEMENT_STATS.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              count={stat.count}
              subLabel={stat.subLabel}
              color={stat.color}
      />
          ))}
        </StatsRow>
      </View>
      
      {/* Upload Users Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        headerTitle={t('admin.actions.uploadUsers')}
        headerDescription={t('admin.actions.uploadUsersDescription')}
        size="md"
        borderRadius="$lg"
      >
        <VStack space="md" width="100%">
          {/* Upload CSV Option */}
          <Pressable 
            onPress={handleUploadCSV}
            // @ts-ignore - Web-specific event handlers
            onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
            onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
          >
            <Card
              {...(styles.uploadOptionCard as any)}
              bg={isHovered ? "$accent200" : "$white"}
            >
              <HStack space="md" alignItems="center">
                {/* Icon Container */}
                <Box
                  {...(styles.uploadCSVIconContainer as any)}
                >
                  <LucideIcon 
                    name="FileUp" 
                    size={16} 
                    color={theme.tokens.colors.primary500} 
                  />
                </Box>
                
                {/* Text Content */}
                <VStack flex={1} space="xs">
                  <Text 
                    {...TYPOGRAPHY.bodySmall} 
                    color={theme.tokens.colors.textPrimary}
                    fontWeight="$medium"
                  >
                    {t('admin.actions.uploadCSV')}
          </Text>
                  <Text 
                    {...TYPOGRAPHY.caption} 
                    color={theme.tokens.colors.textMutedForeground}
                  >
                    {t('admin.actions.uploadCSVDescription')}
              </Text>
                </VStack>
              </HStack>
            </Card>
          </Pressable>

          {/* Add User Option - Disabled */}
          <Pressable disabled>
            <Card
              {...(styles.uploadOptionCardDisabled as any)}
              bg="$white"
            >
              <HStack space="md" alignItems="center">
                {/* Icon Container */}
                <Box
                  {...(styles.addUserIconContainer as any)}
                >
                <LucideIcon
                    name="UserPlus" 
                  size={16}
                    color="#6B7280" 
                />
                </Box>
                
                {/* Text Content */}
                <VStack flex={1} space="xs">
                  <Text 
                    {...TYPOGRAPHY.bodySmall} 
                    color={theme.tokens.colors.textPrimary}
                    fontWeight="$medium"
                  >
                    {t('admin.actions.addUser')}
                  </Text>
                  <Text 
                    {...TYPOGRAPHY.caption} 
                    color={theme.tokens.colors.textMutedForeground}
                  >
                    {t('admin.actions.addUserDescription')}
                </Text>
                </VStack>
              </HStack>
            </Card>
          </Pressable>
        </VStack>
      </Modal>

      {/* Hidden File Input for CSV Upload - triggers native file picker on "Upload CSV" click */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
    </VStack>
  );
};

export default UserManagementScreen;
