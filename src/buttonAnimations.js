export const animateButton = (button, type = 'success') => {
  // Reset animation
  button.classList.remove('animate');
  button.classList.remove('start');
  button.classList.remove('success');
  button.classList.remove('error');

  // Trigger reflow to restart CSS animations
  void button.offsetWidth;

  // Add animation class
  button.classList.add('animate');

  // Start the filling animation
  button.classList.add('start');

  // Optional: handle different types if needed
  if (type === 'success') {
    // You can add specific logic for success type if necessary
  } else if (type === 'error') {
    // Add specific logic for error type if necessary
  }

  // Remove animation class after 3 seconds (or however long you want the animation to last)
  setTimeout(() => {
    button.classList.remove('start');
  }, 3000);
};
