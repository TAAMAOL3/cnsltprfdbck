// buttonAnimations.js

export const animateButton = (button, type = 'success') => {
  // Reset animation
  button.classList.remove('animate');
  button.classList.remove('success');
  button.classList.remove('error');

  // Add animation and success/error class
  button.classList.add('animate');
  button.classList.add(type);

  // Remove animation class after 6 seconds
  setTimeout(() => {
    button.classList.remove('animate');
  }, 6000);
};
