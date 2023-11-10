

import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Settings from '../src/Settings';

test('renders Settings component', () => {
  // Render the Settings component within a Router
  const { getByText } = render(
    <Router>
      <Settings />
    </Router>
  );

  // Verify that the component renders with the expected content
  const settingsText = getByText(/Settings/i);
  expect(settingsText).toBeInTheDocument();

  // You can add more assertions based on your component's content and structure
  // For example, you might want to check if certain elements or links are present.
});
