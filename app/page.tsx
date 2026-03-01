"use client";

import { AppProvider, useApp } from "@/lib/store";
import LandingScreen from "@/components/screens/LandingScreen";
import CaptureScreen from "@/components/screens/CaptureScreen";
import AnalyzingScreen from "@/components/screens/AnalyzingScreen";
import GateScreen from "@/components/screens/GateScreen";
import ResultsScreen from "@/components/screens/ResultsScreen";
import BookingScreen from "@/components/screens/BookingScreen";

function ScreenRouter() {
  const { state } = useApp();

  switch (state.screen) {
    case "landing":   return <LandingScreen />;
    case "capture":   return <CaptureScreen />;
    case "analyzing": return <AnalyzingScreen />;
    case "gate":      return <GateScreen />;
    case "results":   return <ResultsScreen />;
    case "booking":   return <BookingScreen />;
    default:          return <LandingScreen />;
  }
}

export default function Home() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}
