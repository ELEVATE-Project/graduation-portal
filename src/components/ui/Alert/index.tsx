import React from 'react';
import {
  useToast,
  Toast,
  ToastDescription,
  VStack,
  HStack,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import type { AlertOptions } from '@app-types/components';
import { useLanguage } from '@contexts/LanguageContext';

/*
  Example usage:
  const { showAlert } = useAlert();

  // Show different types of alerts with default placement (bottom)
  showAlert('error', 'Operation failed');
  showAlert('success', 'Data saved!');
  showAlert('info', 'Processing...');
  showAlert('warning', 'Please check your input');

  // Show alert with custom placement
  showAlert('success', 'Data saved!', { placement: 'top-right' });
  showAlert('error', 'Operation failed', { placement: 'bottom-left' });
  showAlert('info', 'Processing...', { placement: 'bottom', duration: 5000 });
*/

// Icon mapping for different alert types
const getAlertIcon = (action: 'error' | 'warning' | 'success' | 'info' | 'attention') => {
  switch (action) {
    case 'success':
      return { name: 'CheckCircle', color: theme.tokens.colors.success600 || '#00a63e' };
    case 'error':
      return { name: 'XCircle', color: theme.tokens.colors.error600 || '#dc2626' };
    case 'warning':
      return { name: 'AlertTriangle', color: '#f59e0b' };
    case 'info':
      return { name: 'Info', color: theme.tokens.colors.info100 || '#0ea5e9' };
    case 'attention':
      return { name: 'AlertCircle', color: '#f59e0b' };
    default:
      return { name: 'Info', color: theme.tokens.colors.info100 || '#0ea5e9' };
  }
};

export const useAlert = () => {
  const toast = useToast();
  const { t } = useLanguage();

  const showAlert = (
    action: 'error' | 'warning' | 'success' | 'info' | 'attention',
    description: string,
    options: AlertOptions = {},
  ) => {
    const {
      variant = 'solid',
      placement = 'top',
      duration = 5000,
    } = options;

    const icon = getAlertIcon(action);

    // Convert placement format if needed (Gluestack UI uses spaces, not hyphens)
    const gluestackPlacement = placement.replace('-', ' ') as any;
    
    toast.show({
      placement: gluestackPlacement,
      duration,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action={action} variant={variant}>
            <HStack space="md" alignItems="center">
              <LucideIcon name={icon.name} size={16} color={icon.color} />
              <VStack space="xs" flex={1}>
                <ToastDescription>{t(description)}</ToastDescription>
              </VStack>
            </HStack>
          </Toast>
        );
      },
    });
  };

  return {
    showAlert,
  };
};
