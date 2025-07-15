import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders home page with Welcome text', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const heading = screen.getByText(/Welcome To Hotel Booking/i);
  expect(heading).toBeInTheDocument();
});
