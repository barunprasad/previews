"use client";

import { useState, useEffect, useCallback } from "react";

const ONBOARDING_KEY = "previews-onboarding-complete";
const TOUR_KEY = "previews-tour-complete";

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Default to true to prevent flash
  const [hasCompletedTour, setHasCompletedTour] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY) === "true";
    const tourComplete = localStorage.getItem(TOUR_KEY) === "true";

    setHasSeenOnboarding(onboardingComplete);
    setHasCompletedTour(tourComplete);
    setIsLoaded(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboarding(true);
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_KEY, "true");
    setHasCompletedTour(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(TOUR_KEY);
    setHasSeenOnboarding(false);
    setHasCompletedTour(false);
  }, []);

  return {
    hasSeenOnboarding,
    hasCompletedTour,
    isLoaded,
    completeOnboarding,
    completeTour,
    resetOnboarding,
  };
}
