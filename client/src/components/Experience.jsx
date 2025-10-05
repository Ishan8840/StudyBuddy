import React from "react";
import { useSession } from "../context/SessionContext";
import { Flame, Trophy, Star, TrendingUp } from "lucide-react";

const Experience = () => {
  const { exp, focusPercentage } = useSession();

  // Calculate stats (you can adjust these based on your logic)
  const streak = 7;
  const level = 12;
  const todayXP = exp;
  const currentXP = 2450 + exp;
  const maxXP = 3000;
  const progress = (currentXP / maxXP) * 100;


  return (
    <div style={styles.container}>
      <div style={styles.statsRow}>
        {/* Streak */}
        <div style={styles.streakCard}>
          <Flame style={styles.streakIcon} size={18} />
          <div style={styles.cardContent}>
            <p style={styles.cardLabel}>Streak</p>
            <p style={styles.cardValue}>7 days</p>
          </div>
        </div>

        {/* Level */}
        <div style={styles.levelCard}>
          <Trophy style={styles.levelIcon} size={18} />
          <div style={styles.cardContent}>
            <p style={styles.cardLabel}>Level</p>
            <p style={styles.cardValue}>12</p>
          </div>
        </div>

        {/* Today XP */}
        <div style={styles.todayCard}>
          <Star style={styles.todayIcon} size={18} />
          <div style={styles.cardContent}>
            <p style={styles.cardLabel}>Today</p>
            <p style={styles.cardValue}>+{todayXP} XP</p>
          </div>
        </div>

        {/* Focus Badge */}
        <div style={styles.focusBadge}>
          <TrendingUp style={styles.focusIcon} size={16} />
          <span style={styles.focusText}>Focus: {focusPercentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <p style={styles.progressLabel}>XP Progress</p>
          <p style={styles.progressValue}>{currentXP} / 3000</p>
        </div>
        <div style={styles.progressBarBg}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
		display: 'flex',
		flexDirection: 'column',
		width: '90vw',                  // match min-width: 90vw
		padding: '15px 20px',           // same as session-bar
		backgroundColor: '#0b0b0f',     // same background
		borderRadius: '14px',           // same as session-bar
		border: '1px solid #313144',    // same border
		fontFamily: 'sans-serif',
		color: 'white',
		gap: '10px',                     // spacing between stats row and progress
		margin: '20px',             // center horizontally
		alignSelf: 'flex-start',         // shrink vertically to content
	},
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  streakCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "12px",
    backgroundColor: "rgba(120, 53, 15, 0.3)",
    border: "1px solid rgba(234, 88, 12, 0.3)",
  },
  levelCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "12px",
    backgroundColor: "rgba(126, 34, 206, 0.2)",
    border: "1px solid rgba(168, 85, 247, 0.3)",
  },
  todayCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "12px",
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    border: "1px solid rgba(34, 211, 238, 0.3)",
  },
  focusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    marginLeft: "auto",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  cardLabel: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.5)",
    margin: 0,
    fontWeight: "400",
  },
  cardValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
    lineHeight: "1.2",
  },
  streakIcon: {
    color: "#ea580c",
    flexShrink: 0,
  },
  levelIcon: {
    color: "#a855f7",
    flexShrink: 0,
  },
  todayIcon: {
    color: "#22d3ee",
    flexShrink: 0,
  },
  focusIcon: {
    color: "#10b981",
    flexShrink: 0,
  },
  focusText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#10b981",
  },
  progressSection: {
    width: "100%",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  progressLabel: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.4)",
    margin: 0,
    fontWeight: "400",
  },
  progressValue: {
    fontSize: "11px",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
    margin: 0,
  },
  progressBarBg: {
    width: "100%",
    height: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)",
    borderRadius: "9999px",
    transition: "width 0.5s ease",
  },
};

export default Experience;
