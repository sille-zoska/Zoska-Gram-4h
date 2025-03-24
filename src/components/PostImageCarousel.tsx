"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Box, IconButton, MobileStepper, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useSwipeable } from 'react-swipeable';

type PostImage = {
  id: string;
  imageUrl: string;
  order: number;
};

interface PostImageCarouselProps {
  images: PostImage[];
  aspectRatio?: string;
}

/**
 * A component that displays multiple post images in a carousel
 */
const PostImageCarousel = ({ images, aspectRatio = "1/1" }: PostImageCarouselProps) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleBack,
    trackMouse: true,
  });

  // If there's only one image, render it without carousel controls
  if (maxSteps <= 1) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio,
        }}
      >
        <Image
          src={sortedImages[0]?.imageUrl || ''}
          alt="Post image"
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 600px) 100vw, 600px"
        />
      </Box>
    );
  }

  return (
    <Box 
      {...swipeHandlers}
      sx={{ 
        position: 'relative', 
        width: '100%',
        touchAction: 'pan-y pinch-zoom'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          transform: `translateX(-${activeStep * 100}%)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {sortedImages.map((image, index) => (
          <Box
            key={image.id}
            sx={{
              position: 'relative',
              width: '100%',
              flexShrink: 0,
              aspectRatio,
              overflow: 'hidden',
            }}
          >
            <Image
              src={image.imageUrl}
              alt={`Post image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, 600px"
            />
          </Box>
        ))}
      </Box>

      {/* Left navigation button */}
      {activeStep > 0 && (
        <IconButton
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={handleBack}
        >
          <KeyboardArrowLeft />
        </IconButton>
      )}
      
      {/* Right navigation button */}
      {activeStep < maxSteps - 1 && (
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={handleNext}
        >
          <KeyboardArrowRight />
        </IconButton>
      )}

      {/* Image indicators */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '& .MuiMobileStepper-dot': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '& .MuiMobileStepper-dotActive': {
            backgroundColor: 'white',
          },
        }}
        nextButton={<Box />}
        backButton={<Box />}
      />
    </Box>
  );
};

export default PostImageCarousel; 