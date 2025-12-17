import React, { useState, useRef } from 'react';
import { Platform } from 'react-native';
import {
    VStack,
    HStack,
    Text,
    Box,
    Pressable,
    Modal as GluestackModal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ButtonText,
    CloseIcon,
    Icon as GluestackIcon,
    ScrollView,
} from '@gluestack-ui/themed';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { LucideIcon } from '@ui';
import { commonModalContainerStyles, commonModalContentStyles } from '@components/ui/Modal/Styles';
import { theme } from '@config/theme';
import { requestCameraPermission, requestStoragePermission } from '../../../utils/permissions';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (method: 'camera' | 'device', files?: any[]) => void;
    onConfirm?: (files?: any[]) => void;
    taskName: string;
    participantName?: string;
    existingAttachments?: any[]; // Allow passing existing attachments
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    onConfirm,
    taskName,
    participantName,
    existingAttachments = [],
}) => {
    const { t } = useLanguage();
    const [selectedMethod, setSelectedMethod] = useState<'camera' | 'device' | null>(null);
    const [hoveredOption, setHoveredOption] = useState<'camera' | 'device' | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

    const cameraInputRef = useRef<HTMLInputElement>(null);
    const deviceInputRef = useRef<HTMLInputElement>(null);
    const isWeb = Platform.OS === 'web';



    // Handle camera/device selection
    const handleSelect = async (method: 'camera' | 'device') => {
        setSelectedMethod(method);

        if (isWeb) {
            // Trigger click immediately to ensure browser doesn't block it
            if (method === 'camera') {
                cameraInputRef.current?.click();
            } else {
                deviceInputRef.current?.click();
            }
        } else {
            const options: CameraOptions & ImageLibraryOptions = {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 2000,
                maxWidth: 2000,
                quality: 0.8,
            };

            try {
                if (method === 'camera') {
                    const hasPermission = await requestCameraPermission();
                    if (!hasPermission) {
                        console.log('Camera permission denied');
                        return;
                    }
                    const result = await launchCamera(options);
                    if (result.assets && result.assets.length > 0) {
                        setSelectedFiles(result.assets);
                        onUpload(method, result.assets);
                    }
                } else {
                    const hasPermission = await requestStoragePermission();
                    if (!hasPermission) {
                        console.log('Storage permission denied');
                        return;
                    }
                    const result = await launchImageLibrary({ ...options, selectionLimit: 0 });
                    if (result.assets && result.assets.length > 0) {
                        setSelectedFiles(result.assets);
                        onUpload(method, result.assets);
                    }
                }
            } catch (error) {
                console.error('Image picker error:', error);
            }
        }
    };

    const handleWebFileChange = (event: React.ChangeEvent<HTMLInputElement>, method: 'camera' | 'device') => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);
            onUpload(method, fileArray);
        }
    };

    const handleUploadConsent = () => {
        if (onConfirm) {
            onConfirm(selectedFiles);
        }
        setSelectedMethod(null);
        setSelectedFiles([]);
        onClose();
    };

    const handleCancel = () => {
        setSelectedMethod(null);
        setSelectedFiles([]);
        onClose();
    };

    // If task is 'Capture Consent', show participant name, otherwise show task name
    const isConsentTask = taskName === 'Capture Consent';
    const displayName = isConsentTask ? (participantName || taskName) : (taskName || participantName);

    /**
     * THEME MAPPING FIX:
     * Using updated logic: Both inputs now share the Pink ($primary500/$primary100) hover/selected state.
     */

    return (
        <GluestackModal
            isOpen={isOpen}
            onClose={handleCancel}
            size="md"
            {...commonModalContainerStyles}
        >
            <ModalBackdrop />
            <ModalContent
                {...commonModalContentStyles}
                maxWidth={500}
                bg="$white"
            >
                <ModalHeader borderBottomWidth={0} padding="$5" paddingBottom="$2">
                    <VStack flex={1} space="xs">
                        <Text
                            fontSize="$lg"
                            fontWeight="$semibold"
                            color={theme.tokens.colors.textPrimary}
                        >
                            {t('projectPlayer.chooseUploadMethod')}
                        </Text>
                        <Text
                            fontSize="$sm"
                            color={theme.tokens.colors.textSecondary}
                        >
                            {t('projectPlayer.uploadDocumentationFor', { name: displayName })}
                        </Text>
                    </VStack>
                    <Pressable onPress={handleCancel} accessibilityLabel={t('common.close')}>
                        <GluestackIcon as={CloseIcon} size="md" color="$textLight500" />
                    </Pressable>
                </ModalHeader>

                <ModalBody padding="$5" paddingTop="$3" paddingBottom="$3">
                    <VStack space="md">
                        {/* Take a Photo - Pink Theme */}
                        <Pressable
                            onPress={() => handleSelect('camera')}
                            onHoverIn={() => setHoveredOption('camera')}
                            onHoverOut={() => setHoveredOption(null)}
                            accessibilityLabel={t('projectPlayer.takePhoto')}
                            accessibilityRole="button"
                        >
                            <Box
                                padding="$4"
                                borderRadius="$lg"
                                borderWidth={1}
                                borderColor={
                                    selectedMethod === 'camera'
                                        ? '$primary500' // Maroon border when selected
                                        : hoveredOption === 'camera'
                                            ? '$primary500' // Maroon border on hover
                                            : '$borderLight200'
                                }
                                bg={
                                    selectedMethod === 'camera'
                                        ? '$primary100' // Light Pink bg selected
                                        : hoveredOption === 'camera'
                                            ? '$primary100' // Light Pink bg hover
                                            : '$white'
                                }
                                $web-cursor="pointer"
                                $web-transition="all 0.2s ease"
                            >
                                <HStack space="md" alignItems="center">
                                    <Box
                                        width={40}
                                        height={40}
                                        borderRadius="$full"
                                        bg={selectedMethod === 'camera' || hoveredOption === 'camera' ? '$white' : '$backgroundLight100'}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <LucideIcon
                                            name="Camera"
                                            size={20}
                                            color={selectedMethod === 'camera' || hoveredOption === 'camera' ? theme.tokens.colors.primary500 : theme.tokens.colors.textSecondary}
                                        />
                                    </Box>
                                    <VStack flex={1}>
                                        <Text
                                            fontSize="$sm"
                                            fontWeight="$medium"
                                            color={selectedMethod === 'camera' || hoveredOption === 'camera' ? '$primary500' : theme.tokens.colors.textPrimary}
                                        >
                                            {t('projectPlayer.takePhoto')}
                                        </Text>
                                        <Text
                                            fontSize="$xs"
                                            color={theme.tokens.colors.textSecondary}
                                        >
                                            {t('projectPlayer.useDeviceCamera')}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </Pressable>

                        {/* Upload from Device - Pink Theme on Hover/Select (Was Gray) */}
                        <Pressable
                            onPress={() => handleSelect('device')}
                            onHoverIn={() => setHoveredOption('device')}
                            onHoverOut={() => setHoveredOption(null)}
                            accessibilityLabel={t('projectPlayer.uploadFromDevice')}
                            accessibilityRole="button"
                        >
                            <Box
                                padding="$4"
                                borderRadius="$lg"
                                borderWidth={1}
                                borderColor={
                                    selectedMethod === 'device'
                                        ? '$primary500' // Pink Border
                                        : hoveredOption === 'device'
                                            ? '$primary500' // Pink Border
                                            : '$borderLight200'
                                }
                                bg={
                                    selectedMethod === 'device'
                                        ? '$primary100' // Pink BG
                                        : hoveredOption === 'device'
                                            ? '$primary100' // Pink BG
                                            : '$white'
                                }
                                $web-cursor="pointer"
                                $web-transition="all 0.2s ease"
                            >
                                <HStack space="md" alignItems="center">
                                    <Box
                                        width={40}
                                        height={40}
                                        borderRadius="$full"
                                        bg={selectedMethod === 'device' || hoveredOption === 'device' ? '$white' : '$backgroundLight100'}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <LucideIcon
                                            name="Upload"
                                            size={20}
                                            color={selectedMethod === 'device' || hoveredOption === 'device' ? theme.tokens.colors.primary500 : theme.tokens.colors.textSecondary}
                                        />
                                    </Box>
                                    <VStack flex={1}>
                                        <Text
                                            fontSize="$sm"
                                            fontWeight="$medium"
                                            color={selectedMethod === 'device' || hoveredOption === 'device' ? '$primary500' : theme.tokens.colors.textPrimary}
                                        >
                                            {t('projectPlayer.uploadFromDevice')}
                                        </Text>
                                        <Text
                                            fontSize="$xs"
                                            color={theme.tokens.colors.textSecondary}
                                        >
                                            {t('projectPlayer.chooseFromGallery')}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </Pressable>


                        {/* Selected Files Section (Clean Look) */}
                        {selectedFiles.length > 0 && (
                            <VStack space="sm">
                                <Text
                                    fontSize="$sm"
                                    fontWeight="$semibold"
                                    color={theme.tokens.colors.textPrimary}
                                >
                                    {t('projectPlayer.selectedFiles')} ({selectedFiles.length})
                                </Text>
                                <ScrollView maxHeight={150}>
                                    <VStack space="xs">
                                        {selectedFiles.map((file, index) => (
                                            <Box
                                                key={`selected-${index}`}
                                                padding="$3"
                                                borderRadius="$md"
                                                bg="$badgeSuccessBg"
                                                borderWidth={1}
                                                borderColor="$success200"
                                            >
                                                <HStack space="md" alignItems="center">
                                                    <Box
                                                        width={24}
                                                        height={24}
                                                        justifyContent="center"
                                                        alignItems="center"
                                                    >
                                                        <LucideIcon
                                                            name="FileText"
                                                            size={20}
                                                            color={theme.tokens.colors.success500}
                                                        />
                                                    </Box>
                                                    <VStack flex={1}>
                                                        <Text
                                                            {...TYPOGRAPHY.h4}
                                                            color={theme.tokens.colors.textPrimary}
                                                            numberOfLines={1}
                                                        >
                                                            {file.fileName || file.name || 'Untitled File'}
                                                        </Text>
                                                        <Text
                                                            {...TYPOGRAPHY.bodySmall}
                                                            color={theme.tokens.colors.textSecondary}
                                                        >
                                                            {(file.fileSize || file.size ? ((file.fileSize || file.size) / 1024).toFixed(1) + ' KB' : 'Unknown size')}
                                                        </Text>
                                                    </VStack>
                                                    <Pressable onPress={() => {
                                                        const newFiles = [...selectedFiles];
                                                        newFiles.splice(index, 1);
                                                        setSelectedFiles(newFiles);
                                                        // If no files left, reset method? Maybe not needed.
                                                        if (newFiles.length === 0) setSelectedMethod(null);
                                                    }}>
                                                        <GluestackIcon as={CloseIcon} size="sm" color="$textLight400" />
                                                    </Pressable>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </ScrollView>
                            </VStack>
                        )}

                        {/* Previously Uploaded Files Section (Updated to Clean Look) */}
                        {existingAttachments && existingAttachments.length > 0 && (
                            <VStack space="sm">
                                <Text
                                    fontSize="$sm"
                                    fontWeight="$semibold"
                                    color={theme.tokens.colors.textPrimary}
                                >
                                    {t('projectPlayer.previouslyUploadedFiles')} ({existingAttachments.length})
                                </Text>
                                <ScrollView maxHeight={150}>
                                    <VStack space="xs">
                                        {existingAttachments.map((file, index) => (
                                            <Box
                                                key={index}
                                                padding="$3"
                                                borderRadius="$md"
                                                bg="$badgeSuccessBg"
                                                borderWidth={1}
                                                borderColor="$success200"
                                            >
                                                <HStack space="md" alignItems="center">
                                                    <Box
                                                        width={24}
                                                        height={24}
                                                        justifyContent="center"
                                                        alignItems="center"
                                                    >
                                                        <LucideIcon
                                                            name="FileText"
                                                            size={20}
                                                            color={theme.tokens.colors.success500}
                                                        />
                                                    </Box>
                                                    <VStack flex={1}>
                                                        <Text
                                                            {...TYPOGRAPHY.h4}
                                                            color={theme.tokens.colors.textPrimary}
                                                            numberOfLines={1}
                                                        >
                                                            {file.name || 'Untitled File'}
                                                        </Text>
                                                        <Text
                                                            {...TYPOGRAPHY.bodySmall}
                                                            color={theme.tokens.colors.textSecondary}
                                                        >
                                                            {(file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown size')}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </ScrollView>
                            </VStack>
                        )}

                        {/* Note Box - Blue Theme */}
                        <Box
                            style={{
                                backgroundColor: '#eff6ff',
                                borderColor: '#bfdbfe',
                                borderWidth: 1,
                            }}
                            padding="$3"
                            borderRadius="$md"
                            marginTop="$2"
                        >
                            <Text fontSize="$xs" style={{ color: '#1e40af' }}>
                                <Text fontWeight="$bold" style={{ color: '#1e40af' }}>Note: </Text>
                                {t('projectPlayer.uploadSignedDocumentation')}
                            </Text>
                        </Box>
                    </VStack>

                    {isWeb && (
                        <>
                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                                onChange={(e) => handleWebFileChange(e, 'camera')}
                            />
                            <input
                                ref={deviceInputRef}
                                type="file"
                                accept="image/*,application/pdf,.doc,.docx"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => handleWebFileChange(e, 'device')}
                            />
                        </>
                    )}
                </ModalBody>

                <ModalFooter borderTopWidth={0} padding="$5" paddingTop="$2">
                    <HStack space="md" width="$full" justifyContent="flex-end">
                        <Button
                            variant="outline"
                            onPress={handleCancel}
                            borderWidth={1}
                            borderColor="$borderLight300"
                            borderRadius="$md"
                            paddingHorizontal="$5"
                            paddingVertical="$2"
                            $web-cursor="pointer"
                            $hover-bg="$backgroundLight50"
                        >
                            <ButtonText color={theme.tokens.colors.textPrimary} fontSize="$sm">
                                {t('common.cancel')}
                            </ButtonText>
                        </Button>

                        <Button
                            bg="$primary500" // Maroon/Pink
                            onPress={handleUploadConsent}
                            borderRadius="$md"
                            paddingHorizontal="$5"
                            paddingVertical="$2"
                            opacity={selectedMethod ? 1 : 0.5}
                            isDisabled={!selectedMethod}
                            $web-cursor="pointer"
                            $hover-bg="$primary600"
                        >
                            <ButtonText color="$white" fontSize="$sm">
                                {t('projectPlayer.uploadConsent')}
                            </ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent >
        </GluestackModal >
    );
};

export default FileUploadModal;
