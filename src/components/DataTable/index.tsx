import React, { useState, useEffect } from 'react';
import { Box, HStack, Text, Pressable, VStack } from '@ui';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { DataTableProps, ColumnDef, PaginationConfig } from '@app-types/components';
// import ActionsMenu from '@components/ActionsMenu';
import { CustomMenu } from '@components/ui/Menu';
import { LucideIcon } from '@components/ui';
import { Modal, Input, InputField } from '@ui';
import { usePlatform } from '@utils/platform';
import PaginationControls from './PaginationControls';

interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  showActions?: boolean;
  minWidth?: number; // Minimum width for horizontal scroll on mobile
}

const TableHeader = <T,>({ columns, showActions, minWidth }: TableHeaderProps<T>) => {
  const { t } = useLanguage();

  return (
    <HStack
      bg="$backgroundLight50"
      padding="$4"
      borderBottomColor="$borderLight300"
      space="md"
      minWidth={minWidth}
      borderTopLeftRadius="$2xl"
      borderTopRightRadius="$2xl"
    >
      {columns.map(column => (
        <Box
          key={column.key}
          flex={column.flex}
          width={column.width}
          alignItems={
            column.align === 'center'
              ? 'center'
              : column.align === 'right'
              ? 'flex-end'
              : 'flex-start'
          }
        >
          <Text {...TYPOGRAPHY.label} color={theme.tokens.colors.foreground}>
            {t(column.label)}
          </Text>
        </Box>
      ))}
      {showActions && (
        <Box width={60}>
          <Text {...TYPOGRAPHY.label} color={theme.tokens.colors.foreground}>
            {t('common.actions')}
          </Text>
        </Box>
      )}
    </HStack>
  );
};

/**
 * Table Row Component
 */
interface TableRowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  onActionClick?: (item: T) => void;
  showActions?: boolean;
  minWidth?: number; // Minimum width for horizontal scroll on mobile
  isLast?: boolean; // Whether this is the last row
}

const TableRow = <T,>({
  item,
  columns,
  onRowClick,
  onActionClick,
  showActions,
  minWidth,
  isLast = false,
}: TableRowProps<T>) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [showDropoutModal, setShowDropoutModal] = useState(false);
  const [dropoutReason, setDropoutReason] = useState('');

  // Get item name and ID for the modal
  const itemName = (item as any)?.name || (item as any)?.id || 'participant';
  const itemId = (item as any)?.id;

  const handleMenuSelect = (key: string) => {
    if (key === 'view-details') {
      // @ts-ignore - Navigation type inference
      navigation.navigate('participant-detail', { participantId: itemId });
    } else if (key === 'log-visit') {
      // @ts-ignore - Navigation type inference
      navigation.navigate('log-visit', { participantId: itemId });
    } else if (key === 'dropout') {
      // Show confirmation modal
      setTimeout(() => {
        setShowDropoutModal(true);
      }, 100);
    }
  };

  const handleDropoutConfirm = (reason?: string) => {
    setShowDropoutModal(false);
    setDropoutReason(reason ?? ''); // Reset reason
    onActionClick?.(item);
  };


  const customTrigger = (triggerProps: any) => (
    <Pressable
      {...triggerProps}
      padding="$2"
      borderRadius="$sm"
      $web-cursor="pointer"
      sx={{
        ':hover': {
          bg: '$backgroundLight100',
        },
      }}
    >
      <LucideIcon
        name="MoreVertical"
        size={20}
        color={theme.tokens.colors.mutedForeground}
      />
    </Pressable>
  );

  return (
    <>
      <Box position="relative">
        <Pressable
          onPress={() => onRowClick?.(item)}
          $web-cursor={onRowClick ? 'pointer' : undefined}
        >
          <HStack
            padding="$4"
            borderBottomWidth={isLast ? 0 : 1}
            borderBottomColor="$borderLight200"
            space="md"
            alignItems="center"
            minWidth={minWidth}
            $web-transition="background-color 0.2s"
            sx={{
              ':hover': {
                bg: '$backgroundLight50',
              },
            }}
          >
            {columns.map(column => (
              <Box
                key={column.key}
                flex={column.flex}
                width={column.width}
                alignItems={
                  column.align === 'center'
                    ? 'center'
                    : column.align === 'right'
                    ? 'flex-end'
                    : 'flex-start'
                }
              >
                {column.render ? (
                  column.render(item)
                ) : (
                  <Text
                    {...TYPOGRAPHY.paragraph}
                    color={theme.tokens.colors.mutedForeground}
                  >
                    {String((item as any)[column.key] ?? '')}
                  </Text>
                )}
              </Box>
            ))}
            {showActions && (
              <Box width={60} alignItems="center">
                {/* <ActionsMenu<T> item={item} onDropout={onActionClick} /> */}
                <CustomMenu
                  items={[
                    {
                      key: 'view-details',
                      label: 'actions.viewDetails',
                      textValue: 'View Details',
                      iconElement: (
                        <Box marginRight="$2">
                          <LucideIcon
                            name="Eye"
                            size={20}
                            color={theme.tokens.colors.mutedForeground}
                          />
                        </Box>
                      ),
                    },
                    {
                      key: 'log-visit',
                      label: 'actions.logVisit',
                      textValue: 'Log Visit',
                      iconElement: (
                        <Box marginRight="$2">
                          <LucideIcon
                            name="ClipboardCheck"
                            size={20}
                            color={theme.tokens.colors.mutedForeground}
                          />
                        </Box>
                      ),
                    },
                    {
                      key: 'dropout',
                      label: 'actions.dropout',
                      textValue: 'Dropout',
                      iconElement: (
                        <Box marginRight="$2">
                          <LucideIcon
                            name="UserX"
                            size={20}
                            color={theme.tokens.colors.error.light}
                          />
                        </Box>
                      ),
                      color: theme.tokens.colors.error.light,
                    },
                  ]}
                  placement="bottom right"
                  offset={5}
                  trigger={customTrigger}
                  onSelect={handleMenuSelect}
                />
              </Box>
            )}
          </HStack>
        </Pressable>
      </Box>

      {/* Dropout Confirmation Modal */}
      <Modal
        isOpen={showDropoutModal}
        onClose={() => {
          setShowDropoutModal(false);
          setDropoutReason(''); // Reset on close
        }}
        headerTitle={t('actions.confirmDropout') || 'Confirm Dropout'}
        headerIcon={
          <LucideIcon
            name="UserX"
            size={24}
            color={theme.tokens.colors.error.light}
          />
        }
        maxWidth={500}
        cancelButtonText={t('common.cancel') || 'Cancel'}
        confirmButtonText={t('actions.confirmDropout') || 'Confirm Dropout'}
        onCancel={() => {
          setShowDropoutModal(false);
          setDropoutReason('');
        }}
        onConfirm={() => handleDropoutConfirm(dropoutReason)}
        confirmButtonColor={theme.tokens.colors.error.light}
      >
        <VStack space="lg">
          {/* Message */}
          <Text
            {...TYPOGRAPHY.paragraph}
            color={theme.tokens.colors.textSecondary}
            lineHeight="$xl"
          >
            {t('actions.dropoutMessage', { name: itemName }) ||
              `Mark ${itemName} as dropout from the program`}
          </Text>

          {/* Input Field */}
          <VStack space="sm">
            <Text
              {...TYPOGRAPHY.label}
              color={theme.tokens.colors.textPrimary}
              fontWeight="$medium"
            >
              {t('actions.dropoutReasonLabel') || 'Reason for Dropout'}
            </Text>
            <Input
              variant="outline"
              size="lg"
              borderWidth={2}
              borderColor={theme.tokens.colors.inputBorder}
              borderRadius="$md"
              bg={theme.tokens.colors.modalBackground}
              $focus-borderColor={theme.tokens.colors.inputFocusBorder}
              $focus-borderWidth={2}
              minHeight={80}
            >
              <InputField
                placeholder={
                  t('actions.dropoutReasonPlaceholder') || 'Enter reason for dropout...'
                }
                value={dropoutReason}
                onChangeText={setDropoutReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                paddingTop="$3"
                placeholderTextColor={theme.tokens.colors.textMuted}
              />
            </Input>
            <Text
              {...TYPOGRAPHY.bodySmall}
              color={theme.tokens.colors.textSecondary}
              lineHeight="$sm"
            >
              {t('actions.dropoutHint') ||
                'This will change the participant\'s status to "Not Enrolled" and log the action in their history.'}
            </Text>
          </VStack>
        </VStack>
      </Modal>
    </>
  );
};

/**
 * Empty State Component
 */
interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  const { t } = useLanguage();

  return (
    <Box padding="$8" alignItems="center">
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
      >
        {message ? t(message) : t('common.noDataFound')}
      </Text>
    </Box>
  );
};

/**
 * Loading State Component
 */
interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  const { t } = useLanguage();

  return (
    <Box padding="$8" alignItems="center">
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
      >
        {message || t('common.loading')}
      </Text>
    </Box>
  );
};

const DataTable = <T,>({
  data,
  columns,
  onRowClick,
  onActionClick,
  isLoading = false,
  emptyMessage,
  loadingMessage,
  showActions = false,
  getRowKey,
  pagination,
  onPageChange,
}: DataTableProps<T>) => {
  const { isMobile } = usePlatform();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => Math.max(1, pagination?.pageSize ?? 10));
  
  // Calculate pagination values with validation
  const isPaginationEnabled = pagination?.enabled ?? false;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = isPaginationEnabled ? Math.max(1, Math.ceil(data.length / safePageSize)) : 1;
  const startIndex = isPaginationEnabled ? (currentPage - 1) * safePageSize : 0;
  const endIndex = isPaginationEnabled ? startIndex + safePageSize : data.length;
  const paginatedData = isPaginationEnabled ? data.slice(startIndex, endIndex) : data;
  
  // Sync pageSize from props and reset to page 1 when data changes
  useEffect(() => {
    if (!isPaginationEnabled) return;
    
    if (pagination?.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(Math.max(1, pagination.pageSize));
      setCurrentPage(1);
    }
  }, [isPaginationEnabled, pagination?.pageSize]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };
  
  // Handle page size change with validation
  const handlePageSizeChange = (newPageSize: number) => {
    if (!Number.isFinite(newPageSize) || newPageSize <= 0) return;
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };
  
  // Calculate minimum width for horizontal scroll on mobile
  // This ensures all columns are visible when scrolling horizontally
  const minTableWidth = isMobile ? 800 : undefined;

  // Single table content - used for both mobile and desktop
  const tableContent = (
    <VStack width="$full" minWidth={minTableWidth}>
      <TableHeader columns={columns} showActions={showActions} minWidth={minTableWidth} />
      <Box>
        {isLoading ? (
          <LoadingState message={loadingMessage} />
        ) : paginatedData.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          paginatedData.map((item, index) => (
            <TableRow
              key={getRowKey(item)}
              item={item}
              columns={columns}
              onRowClick={onRowClick}
              onActionClick={onActionClick}
              showActions={showActions}
              minWidth={minTableWidth}
              isLast={index === paginatedData.length - 1}
            />
          ))
        )}
      </Box>
    </VStack>
  );

  return (
    <Box width="$full">
      <Box
        bg={theme.tokens.colors.backgroundPrimary.light}
        borderRadius="$2xl"
        borderWidth={1}
        borderColor="$borderLight300"
        overflow={isMobile ? 'hidden' : 'visible'}
      >
        {isMobile ? (
          // Mobile: Wrap table in horizontal ScrollView
          <ScrollView horizontal showsHorizontalScrollIndicator>
            {tableContent}
          </ScrollView>
        ) : (
          // Desktop: Wrap table in vertical scroll container (only if needed)
          tableContent
        )}
      </Box>
      {isPaginationEnabled && totalPages > 1 && pagination && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={data.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          config={pagination}
        />
      )}
    </Box>
  );
};

export default DataTable;
