import React from 'react';
import { Box } from '@gluestack-ui/themed';

interface ContainerProps {
  children: React.ReactNode;
  [key: string]: any;
}

const Container = ({ children, ...props }: ContainerProps) => {
  
  return (
    <Box
      // $md-px="$6"
      // px="$4"                     // padding like container padding
      // py="$6"
      w="100%"                    // full width
      maxWidth={1152}             // mobile: 100%
      mx="auto"  
      {...props}                 // center align horizontally
    >
      {children}
    </Box>
  );
};

export default Container;

