import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { useAuthStore } from '@/store/useAuthStore';
import { showSuccessNotification, showErrorNotification } from '@/lib/notificationUtil';
import Page from '@/app/register/page';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('nookies', () => ({
  setCookie: jest.fn(),
}));
jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));
jest.mock('@/lib/notificationUtil', () => ({
  showSuccessNotification: jest.fn(),
  showErrorNotification: jest.fn(),
}));

describe('Register Page Component', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
  const mockSetCookie = setCookie as jest.Mock;
  const mockShowSuccessNotification = showSuccessNotification as jest.Mock;
  const mockShowErrorNotification = showErrorNotification as jest.Mock;

  const mockPush = jest.fn();
  const mockCheckAuthStatus = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseAuthStore.mockReturnValue({
      checkAuthStatus: mockCheckAuthStatus,
      isAuthenticated: false,
      role: undefined,
      currentLoggedInUserId: null,
      logout: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('renders registration form with all input fields', () => {
    render(<Page />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
  });

  it('allows user to input data into form fields', () => {
    render(<Page />);

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email address');
    const phoneInput = screen.getByLabelText('Phone Number');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('1234567890');
    expect(passwordInput).toHaveValue('password123');
  });

  it('successfully registers a user and redirects based on role', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: {
          id: 'user1',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'USER',
        },
      },
    });

    render(<Page />);

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email address');
    const phoneInput = screen.getByLabelText('Phone Number');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/register', {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      });
      expect(mockSetCookie).toHaveBeenCalledWith(null, 'token', 'mock-token', {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
      expect(mockSetCookie).toHaveBeenCalledWith(null, 'user', JSON.stringify({
        id: 'user1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'USER',
      }), {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
      expect(mockCheckAuthStatus).toHaveBeenCalled();
      expect(mockShowSuccessNotification).toHaveBeenCalledWith('Registration successful');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('redirects to dashboard for ADMIN role after successful registration', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: {
          id: 'admin1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
    });

    render(<Page />);

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email address');
    const phoneInput = screen.getByLabelText('Phone Number');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'Admin User' } });
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message and notification on registration failure', async () => {
    mockAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'User already exists',
        },
      },
    });

    render(<Page />);

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email address');
    const phoneInput = screen.getByLabelText('Phone Number');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorNotification).toHaveBeenCalledWith('User already exists');
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('disables submit button and shows loading state during registration', async () => {
    mockAxios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Page />);

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email address');
    const phoneInput = screen.getByLabelText('Phone Number');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Registering...');
    expect(submitButton).toHaveClass('bg-gray-400');
  });
});