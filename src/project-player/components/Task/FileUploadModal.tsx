import React, { useState, useRef } from 'react';
import { Platform } from 'react-native';
import {
    VStack,
    HStack,
    Text,
    Box,
    Pressable,
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
import { theme } from '@config/theme';
import { requestCameraPermission, requestStoragePermission } from '../../../utils/permissions';
import Modal from '@components/ui/Modal';

// --- Helper Component for Selection Options ---
interface UploadMethodOptionProps {
    method: 'camera' | 'device';
    selectedMethod: 'camera' | 'device' | null;
    hoveredOption: 'camera' | 'device' | null;
    title: string;
    subtitle: string;
    icon: string;
    onSelect: (method: 'camera' | 'device') => void;
    onHoverIn: (method: 'camera' | 'device') => void;
    onHoverOut: () => void;
}

const UploadMethodOption: React.FC<UploadMethodOptionProps> = ({
    method,
    selectedMethod,
    hoveredOption,
    title,
    subtitle,
    icon,
    onSelect,
    onHoverIn,
    onHoverOut,
}) => {
    const isSelected = selectedMethod === method;
    const isHovered = hoveredOption === method;
    const activeColor = '$primary500'; // Pink/Maroon
    const activeBg = '$primary100';     // Light Pink

    return (
        <Pressable
            onPress={() => onSelect(method)}
            onHoverIn={() => onHoverIn(method)}
            onHoverOut={onHoverOut}
            accessibilityLabel={title}
            accessibilityRole="button"
        >
            <Box
                padding="$4"
                borderRadius="$lg"
                borderWidth={1}
                borderColor={isSelected || isHovered ? activeColor : '$borderLight200'}
                bg={isSelected || isHovered ? activeBg : '$white'}
                $web-cursor="pointer"
                $web-transition="all 0.2s ease"
            >
                <HStack space="md" alignItems="center">
                    <Box
                        width={40}
                        height={40}
                        borderRadius="$full"
                        bg={isSelected || isHovered ? '$white' : '$backgroundLight100'}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <LucideIcon
                            name={icon}
                            size={20}
                            color={isSelected || isHovered ? theme.tokens.colors.primary500 : theme.tokens.colors.textSecondary}
                        />
                    </Box>
                    <VStack flex={1}>
                        <Text
                            fontSize="$sm"
                            fontWeight="$medium"
                            color={isSelected || isHovered ? activeColor : theme.tokens.colors.textPrimary}
                        >
                            {title}
                        </Text>
                        <Text fontSize="$xs" color={theme.tokens.colors.textSecondary}>
                            {subtitle}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </Pressable>
    );
};

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
                    // For Android 13+ permissions we rely on requestStoragePermission update
                    // but we still need to be careful with selectionLimit
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

    // --- Helper Function for File Lists ---
    const renderFileList = (files: any[], title: string, showDelete: boolean = false) => {
        if (!files || files.length === 0) return null;
        return (
            <VStack space="sm">
                <Text
                    fontSize="$sm"
                    fontWeight="$semibold"
                    color={theme.tokens.colors.textPrimary}
                >
                    {title} ({files.length})
                </Text>
                <ScrollView maxHeight={150}>
                    <VStack space="xs">
                        {files.map((file, index) => (
                            <Box
                                key={`${title}-${index}`}
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
                                    {showDelete && (
                                        <Pressable onPress={() => {
                                            const newFiles = [...selectedFiles];
                                            newFiles.splice(index, 1);
                                            setSelectedFiles(newFiles);
                                            // If no files left, update method state if needed
                                            if (newFiles.length === 0) setSelectedMethod(null);
                                        }}>
                                            <GluestackIcon as={CloseIcon} size="sm" color="$textLight400" />
                                        </Pressable>
                                    )}
                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                </ScrollView>
            </VStack>
        );
    };

    const footerContent = (
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
                opacity={selectedFiles.length > 0 ? 1 : 0.5}
                isDisabled={selectedFiles.length === 0}
                $web-cursor="pointer"
                $hover-bg="$primary600"
            >
                <ButtonText color="$white" fontSize="$sm">
                    {t('projectPlayer.uploadConsent')}
                </ButtonText>
            </Button>
        </HStack>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            size="md"
            headerTitle={t('projectPlayer.chooseUploadMethod')}
            headerDescription={t('projectPlayer.uploadDocumentationFor', { name: displayName })}
            showCloseButton={true}
            maxWidth={500}
            footerContent={footerContent}
        >
            <VStack space="md">
                {/* Take a Photo */}
                <UploadMethodOption
                    method="camera"
                    selectedMethod={selectedMethod}
                    hoveredOption={hoveredOption}
                    title={t('projectPlayer.takePhoto')}
                    subtitle={t('projectPlayer.useDeviceCamera')}
                    icon="Camera"
                    onSelect={handleSelect}
                    onHoverIn={setHoveredOption}
                    onHoverOut={() => setHoveredOption(null)}
                />

                {/* Upload from Device */}
                <UploadMethodOption
                    method="device"
                    selectedMethod={selectedMethod}
                    hoveredOption={hoveredOption}
                    title={t('projectPlayer.uploadFromDevice')}
                    subtitle={t('projectPlayer.chooseFromGallery')}
                    icon="Upload"
                    onSelect={handleSelect}
                    onHoverIn={setHoveredOption}
                    onHoverOut={() => setHoveredOption(null)}
                />

                {/* Selected Files Section */}
                {renderFileList(selectedFiles, t('projectPlayer.selectedFiles'), true)}

                {/* Previously Uploaded Files Section */}
                {renderFileList(existingAttachments, t('projectPlayer.previouslyUploadedFiles'), false)}

                {/* Note Box - Blue Theme */}
                <Box
                    bg="$blue50"
                    borderColor="$blue200"
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$md"
                    marginTop="$2"
                >
                    <Text fontSize="$sm" color="$blue800">
                        <Text fontWeight="$bold" color="$blue800">Note: </Text>
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
        </Modal>
    );
};

export default FileUploadModal;
