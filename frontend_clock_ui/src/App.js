import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/**
 * Pads a number with a leading zero if it is less than 10.
 * @param {number} num - The number to pad.
 * @returns {string} Zero-padded string representation.
 */
function padZero(num) {
  return String(num).padStart(2, '0');
}

/**
 * Formats a Date object into a human-readable date string.
 * Example output: "Wednesday, June 18, 2025"
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString(undefined, options);
}

/**
 * Builds a time string from a Date object.
 * @param {Date} date - The current date/time.
 * @param {boolean} is24Hour - Whether to use 24-hour format.
 * @returns {{ time: string, period: string }} An object with formatted time and AM/PM period (empty in 24h mode).
 */
function formatTime(date, is24Hour) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  if (is24Hour) {
    return { time: `${padZero(hours)}:${minutes}:${seconds}`, period: '' };
  }

  // 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 → 12
  return { time: `${padZero(hours)}:${minutes}:${seconds}`, period };
}

// PUBLIC_INTERFACE
/**
 * App – Root component for the Simple Clock application.
 *
 * Displays the current time (HH:MM:SS) updating every second,
 * the current date, and provides a toggle between 12-hour and 24-hour formats.
 *
 * @returns {JSX.Element} The rendered clock UI.
 */
function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  // Update the clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Toggles between 12-hour and 24-hour time format.
   */
  const toggleFormat = useCallback(() => {
    setIs24Hour((prev) => !prev);
  }, []);

  const { time, period } = formatTime(currentTime, is24Hour);
  const dateString = formatDate(currentTime);

  return (
    <div className="App">
      <div className="clock-card" role="main" aria-label="Simple Clock">
        {/* Title */}
        <h1 className="clock-title">Simple Clock</h1>

        {/* Time display */}
        <div className="clock-time" aria-live="polite" aria-atomic="true" data-testid="clock-time">
          {time}
          {period && <span className="clock-period">{period}</span>}
        </div>

        {/* Date display */}
        <p className="clock-date" data-testid="clock-date">
          {dateString}
        </p>

        {/* 12/24-hour toggle */}
        <button
          className="toggle-button"
          onClick={toggleFormat}
          aria-label={`Switch to ${is24Hour ? '12-hour' : '24-hour'} format`}
          data-testid="toggle-format"
        >
          🕐 Switch to{' '}
          <span className="toggle-label">{is24Hour ? '12H' : '24H'}</span>
        </button>
      </div>
    </div>
  );
}

export default App;
