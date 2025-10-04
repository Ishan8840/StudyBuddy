// src/context/SessionContext.jsx
import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({
    timeStarted: null,
    timeEnded: null,
    touchedFace: [],
    distracted: [],
    breaks: [],
  });
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isNotFocused, setIsNotFocused] = useState(false);

  const startSession = () => {
    setSession({
      timeStarted: new Date().toISOString(),
      timeEnded: null,
      touchedFace: [],
      distracted: [],
      breaks: [],
    });
    setIsSessionActive(true);
  };

  const endSession = async () => {
    const updatedSession = {
      ...session,
      timeEnded: new Date().toISOString(),
    };

    setSession(updatedSession); // still update React state

    try {
      const res = await fetch("http://localhost:5000/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSession), // use updated object here
      });
      const data = await res.json();
      console.log("✅ Session sent to backend:", data);
    } catch (err) {
      console.error("❌ Failed to end session:", err);
    }

    setIsSessionActive(false);
    console.log(updatedSession);
  };

  const touchedFace = () => {
    setSession((prev) => ({
      ...prev,
      touchedFace: [...prev.touchedFace, new Date().toISOString()],
    }));
  };

  const breakStart = () => {
    setIsOnBreak(true);
    setSession((prev) => ({
      ...prev,
      breaks: [...prev.breaks, [new Date().toISOString()]],
    }));
  };

  const breakEnd = () => {
    setIsOnBreak(false);
    setSession((prev) => {
      if (prev.breaks.length === 0) return prev; // no break to end

      const updatedBreaks = [...prev.breaks];
      const lastBreak = updatedBreaks[updatedBreaks.length - 1];

      // update last break with an "end" timestamp
      updatedBreaks[updatedBreaks.length - 1] = {
        ...lastBreak,
        end: new Date().toISOString(),
      };

      return {
        ...prev,
        breaks: updatedBreaks,
      };
    });
  };

  const distractionStart = () => {
    setIsNotFocused(true);
    setSession((prev) => ({
      ...prev,
      distracted: [...prev.distracted, [new Date().toISOString()]],
    }));
  };

  const distractionEnd = () => {
    setIsNotFocused(false);
    setSession((prev) => {
      if (prev.distracted.length === 0) return prev; // no break to end

      const updatedDistraction = [...prev.distracted];
      const lastDistraction = updatedDistraction[updatedDistraction.length - 1];

      // update last break with an "end" timestamp
      updatedDistraction[updatedDistraction.length - 1] = {
        ...lastDistraction,
        end: new Date().toISOString(),
      };

      return {
        ...prev,
        distracted: updatedDistraction,
      };
    });
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        startSession,
        endSession,
        touchedFace,
        breakStart,
        breakEnd,
        distractionStart,
        distractionEnd,
        isNotFocused,
        isSessionActive,
        setIsSessionActive,
        isOnBreak,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
