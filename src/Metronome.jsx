import React, { useState, useEffect, useRef } from 'react';
import './Metronome.css'; // Import the CSS file
const TWELVE = -90;

const Metronome = () => {
  const [bpm, setBpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(TWELVE);
  const lastTimestampRef = useRef(null);

  const calculateRotation = (timestamp) => {
    if (lastTimestampRef.current) {
      const elapsed = timestamp - lastTimestampRef.current;
      const beatsPerSecond = bpm / 60;
      const rotationPerBeat = 360 * beatsPerSecond;
      const newRotation = (rotation + (rotationPerBeat * elapsed) / 1000) % 360;
      setRotation(newRotation);
    }

    lastTimestampRef.current = timestamp;
  };

  useEffect(() => {
    let animationFrameId;

    const animate = (timestamp) => {
      calculateRotation(timestamp);
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      lastTimestampRef.current = performance.now();
      animate(lastTimestampRef.current);
    } else {
      cancelAnimationFrame(animationFrameId);
      lastTimestampRef.current = null;
      setRotation(TWELVE); // Reset rotation to 0 when stopping
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, bpm, rotation]);

  const startMetronome = () => {
    setIsPlaying(true);
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    setRotation(TWELVE);
  };

  const handleBpmChange = (newBpm) => {
    if (!isNaN(newBpm) && newBpm >= 30 && newBpm <= 240) {
      setBpm(newBpm);
    }
  };

  const handleIncrement = (amount) => {
    handleBpmChange(bpm + amount);
  };

  const handleDecrement = (amount) => {
    handleBpmChange(bpm - amount);
  };

  return (
    <div>
      <h1>Metronome</h1>
      <label htmlFor="bpm">BPM:</label>
      <input
        type="number"
        id="bpm"
        value={bpm}
        onChange={(e) => handleBpmChange(parseInt(e.target.value, 10))}
        min={30}
        max={240}
        disabled={isPlaying}
      />
      <div className="buttons-container">
        <button onClick={() => handleDecrement(10)} disabled={isPlaying}>
          -10
        </button>
        <button onClick={() => handleDecrement(5)} disabled={isPlaying}>
          -5
        </button>
        <button onClick={() => handleIncrement(5)} disabled={isPlaying}>
          +5
        </button>
        <button onClick={() => handleIncrement(10)} disabled={isPlaying}>
          +10
        </button>
      </div>
      <div className="metronome-container">
        <svg width="200" height="200">
          {/* Render outer circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="black"
            strokeWidth="2"
            fill="none"
          />

          {/* Render revolving circle */}
          <circle
            cx="100"
            cy="10"
            r="10"
            fill="black"
            transform={`rotate(${rotation + 90} 100 100)`}
          />
        </svg>

        <button onClick={isPlaying ? stopMetronome : startMetronome}>
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default Metronome;
