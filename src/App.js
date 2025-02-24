import { useState } from "react";
import "./styles.css";

const ProgressBar = ({ item }) => {
  const activeClass = item.hasCompleted ? "active" : "";
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

  const handleClick = () => {
    const newId = progressList.length + 1;

    setProgressList((prev) => [
      ...prev,
      {
        id: newId,
        name: `name is my ${newId}`,
        hasCompleted: false,
        hasStarted: true,
      },
    ]);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button className={"add-button"} onClick={handleClick}>
        Add Progress Bar
      </button>
      {progressList.map((item) => (
        <ProgressBar key={item.id} item={item} />
      ))}
    </div>
  );
}
