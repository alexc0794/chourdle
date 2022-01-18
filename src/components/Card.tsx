import { ReactElement } from "react";
import { Box, Heading, keyframes } from "@chakra-ui/react";


const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

type CardProps = {
  children: ReactElement,
  isShimmering?: boolean,
};

export default function Card({
  children,
  isShimmering,
}: CardProps) {
  const shimmerProps = isShimmering ? {
    bg: 'linear-gradient(45deg, #d422b1, #ffce00)',
    animation: `${shimmer} 10s ease infinite`,
    bgSize: '200% 200%'
  } : {};

  return (
    <Box
      bg='background.dark'
      color='white'
      m='0 0 1rem'
      p='0.5rem'
      width='100%'
      borderRadius='0.25rem'
      {...shimmerProps}
    >
      {children}
    </Box>
  );
}