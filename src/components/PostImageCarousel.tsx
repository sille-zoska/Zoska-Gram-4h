"use client";

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Box, IconButton, MobileStepper, useTheme, Fade, Zoom } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, ZoomIn as ZoomInIcon, Close as CloseIcon } from '@mui/icons-material';
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
 * PostImageCarousel Component
 * 
 * A modern image carousel for displaying multiple post images.
 * Features:
 * - Smooth transitions between images
 * - Touch and mouse swipe support
 * - Keyboard navigation
 * - Image zoom functionality
 * - Progress indicators
 * - Responsive design
 * - Loading animations
 */
const PostImageCarousel = ({ images, aspectRatio = "1/1" }: PostImageCarouselProps) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const maxSteps = images.length;

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1));
  }, [maxSteps]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') handleNext();
    if (event.key === 'ArrowLeft') handleBack();
    if (event.key === 'Escape' && isZoomed) setIsZoomed(false);
  }, [handleNext, handleBack, isZoomed]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleBack,
    trackMouse: true,
    delta: 10, // minimum distance in pixels before a swipe is registered
    swipeDuration: 500, // maximum time in ms to complete a swipe
  });

  // If there's only one image, render it without carousel controls
  if (maxSteps <= 1) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4],
        }}
      >
        <Image
          src={sortedImages[0]?.imageUrl || ''}
          alt="Post image"
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 600px) 100vw, 600px"
          onLoadingComplete={() => setIsLoading(false)}
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
        touchAction: isZoomed ? 'none' : 'pan-y pinch-zoom',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          transform: `translateX(-${activeStep * 100}%)`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              transition: 'all 0.3s ease',
              transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={image.imageUrl}
              alt={`Post image ${index + 1}`}
              fill
              style={{ 
                objectFit: 'cover',
                transition: 'opacity 0.3s ease',
                opacity: isLoading ? 0 : 1,
              }}
              sizes="(max-width: 600px) 100vw, 600px"
              onLoadingComplete={() => setIsLoading(false)}
              priority={index === activeStep}
            />
          </Box>
        ))}
      </Box>

      {/* Navigation buttons */}
      <Fade in={!isZoomed}>
        <Box>
          {/* Left navigation button */}
          {activeStep > 0 && (
            <IconButton
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: `${theme.palette.background.paper}CC`,
                backdropFilter: 'blur(4px)',
                '&:hover': { 
                  backgroundColor: theme.palette.background.paper,
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.2s ease',
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
                backgroundColor: `${theme.palette.background.paper}CC`,
                backdropFilter: 'blur(4px)',
                '&:hover': { 
                  backgroundColor: theme.palette.background.paper,
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
              onClick={handleNext}
            >
              <KeyboardArrowRight />
            </IconButton>
          )}
        </Box>
      </Fade>

      {/* Zoom indicator */}
      <Zoom in={!isZoomed}>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: `${theme.palette.background.paper}CC`,
            backdropFilter: 'blur(4px)',
            '&:hover': { 
              backgroundColor: theme.palette.background.paper,
            },
          }}
          onClick={() => setIsZoomed(true)}
        >
          <ZoomInIcon />
        </IconButton>
      </Zoom>

      {/* Close zoom button */}
      <Zoom in={isZoomed}>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: `${theme.palette.background.paper}CC`,
            backdropFilter: 'blur(4px)',
            '&:hover': { 
              backgroundColor: theme.palette.background.paper,
            },
          }}
          onClick={() => setIsZoomed(false)}
        >
          <CloseIcon />
        </IconButton>
      </Zoom>

      {/* Image indicators */}
      <Fade in={!isZoomed}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: `${theme.palette.background.paper}80`,
            backdropFilter: 'blur(4px)',
            '& .MuiMobileStepper-dot': {
              backgroundColor: `${theme.palette.text.secondary}80`,
              transition: 'all 0.3s ease',
            },
            '& .MuiMobileStepper-dotActive': {
              backgroundColor: theme.palette.primary.main,
              transform: 'scale(1.2)',
            },
          }}
          nextButton={<Box />}
          backButton={<Box />}
        />
      </Fade>
    </Box>
  );
};

export default PostImageCarousel; 