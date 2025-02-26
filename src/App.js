import { useState, useEffect } from "react";
import "./styles.css";

const ANIMATION_DURATION = 3000; // Match the 3s in CSS animation
const MAX_CONCURRENT = 2; // Maximum number of bars that can animate simultaneously

const ProgressBar = ({ item }) => {
  const activeClass = item.hasStarted ? "active" : "";

  return (
    <div className="progressbar-container">
      <div className={`progress-bar ${activeClass}`}>
        <span className="progress-text">{item.name}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [progressList, setProgressList] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  const handleClick = () => {
    const newId = progressList.length + 1;

    setProgressList((prev) => [
      ...prev,
      {
        id: newId,
        name: `Progress Bar ${newId}`,
        hasCompleted: false,
        hasStarted: false,
      },
    ]);
  };

  // Start animations for bars that should be active
  useEffect(() => {
    // Don't proceed if there are no progress bars
    if (progressList.length === 0) {
      return;
    }

    // Get inactive and not completed bars
    const waitingBars = progressList.filter(
      (item) => !item.hasStarted && !item.hasCompleted
    );

    // Check if we can start more animations (under our limit)
    const availableSlots = MAX_CONCURRENT - activeCount;

    if (availableSlots > 0 && waitingBars.length > 0) {
      // Get the next bars to animate (limited by available slots)
      const barsToStart = waitingBars.slice(0, availableSlots);

      // Start these bars
      setProgressList((prev) =>
        prev.map((item) =>
          barsToStart.some((bar) => bar.id === item.id)
            ? { ...item, hasStarted: true }
            : item
        )
      );

      // Update active count
      setActiveCount((prev) => prev + barsToStart.length);

      // Set timers for each newly started bar
      barsToStart.forEach((bar) => {
        setTimeout(() => {
          // Mark as completed
          setProgressList((prev) =>
            prev.map((item) =>
              item.id === bar.id ? { ...item, hasCompleted: true } : item
            )
          );

          // Decrease active count
          setActiveCount((prev) => prev - 1);
        }, ANIMATION_DURATION);
      });
    }
  }, [progressList, activeCount]);

  return (
    <div className="App">
      <h1>Throttled Progress Bars ({MAX_CONCURRENT} at a time)</h1>
      <h2>
        Only {MAX_CONCURRENT} bars animate simultaneously, others wait in queue
      </h2>
      <button className={"add-button"} onClick={handleClick}>
        Add Progress Bar
      </button>
      <div className="status-indicators">
        <div className="status-item">
          <span className="status-count">{activeCount}</span> animating
        </div>
        <div className="status-item">
          <span className="status-count">
            {
              progressList.filter(
                (item) => !item.hasStarted && !item.hasCompleted
              ).length
            }
          </span>{" "}
          waiting
        </div>
        <div className="status-item">
          <span className="status-count">
            {progressList.filter((item) => item.hasCompleted).length}
          </span>{" "}
          completed
        </div>
      </div>
      {progressList.map((item) => (
        <ProgressBar key={item.id} item={item} />
      ))}
    </div>
  );
}
