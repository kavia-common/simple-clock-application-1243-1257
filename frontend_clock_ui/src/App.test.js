import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

// Use fake timers so we can control the clock
beforeEach(() => {
  jest.useFakeTimers();
  // Set a fixed date: Wednesday, January 15, 2025 14:30:45
  jest.setSystemTime(new Date(2025, 0, 15, 14, 30, 45));
});

afterEach(() => {
  jest.useRealTimers();
});

test('renders the Simple Clock title', () => {
  render(<App />);
  const titleElement = screen.getByText(/simple clock/i);
  expect(titleElement).toBeInTheDocument();
});

test('displays the current time', () => {
  render(<App />);
  const timeElement = screen.getByTestId('clock-time');
  expect(timeElement).toBeInTheDocument();
  // Default is 12-hour format: 02:30:45 PM
  expect(timeElement.textContent).toContain('02:30:45');
  expect(timeElement.textContent).toContain('PM');
});

test('displays the current date', () => {
  render(<App />);
  const dateElement = screen.getByTestId('clock-date');
  expect(dateElement).toBeInTheDocument();
  // Should contain the year and month at minimum
  expect(dateElement.textContent).toContain('2025');
  expect(dateElement.textContent).toContain('January');
});

test('renders the format toggle button', () => {
  render(<App />);
  const toggleButton = screen.getByTestId('toggle-format');
  expect(toggleButton).toBeInTheDocument();
  expect(toggleButton.textContent).toContain('24H');
});

test('toggles between 12-hour and 24-hour format', () => {
  render(<App />);
  const toggleButton = screen.getByTestId('toggle-format');
  const timeElement = screen.getByTestId('clock-time');

  // Initially 12-hour: "02:30:45 PM"
  expect(timeElement.textContent).toContain('02:30:45');
  expect(timeElement.textContent).toContain('PM');

  // Click to switch to 24-hour
  fireEvent.click(toggleButton);
  expect(timeElement.textContent).toContain('14:30:45');
  expect(timeElement.textContent).not.toContain('PM');
  expect(timeElement.textContent).not.toContain('AM');

  // Button label should now say "12H"
  expect(toggleButton.textContent).toContain('12H');

  // Click again to switch back to 12-hour
  fireEvent.click(toggleButton);
  expect(timeElement.textContent).toContain('02:30:45');
  expect(timeElement.textContent).toContain('PM');
});

test('updates time every second', () => {
  render(<App />);
  const timeElement = screen.getByTestId('clock-time');

  // Initial: 02:30:45
  expect(timeElement.textContent).toContain('02:30:45');

  // Advance by 1 second
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(timeElement.textContent).toContain('02:30:46');

  // Advance by another 14 seconds to reach :00
  act(() => {
    jest.advanceTimersByTime(14000);
  });

  expect(timeElement.textContent).toContain('02:31:00');
});
