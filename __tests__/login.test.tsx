import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { useAuthStore } from '@/store/useAuthStore';
import { showSuccessNotification, showErrorNotification } from '@/lib/notificationUtil';
import Page from '@/app/login/page';

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

describe('Login Page Component', () => {
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

  it('renders login form with all input fields and links', () => {
    render(<Page />);

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
  });

  it('allows user to input data into form fields', () => {
    render(<Page />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('successfully logs in a USER and redirects to home', async () => {
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

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'john@example.com',
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
      expect(mockShowSuccessNotification).toHaveBeenCalledWith('Welcome John Doe');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('successfully logs in an ADMIN and redirects to dashboard', async () => {
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

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockShowSuccessNotification).toHaveBeenCalledWith('Welcome Admin User');
    });
  });

  it('successfully logs in a SELLER and redirects to dashboard', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: {
          id: 'seller1',
          email: 'seller@example.com',
          name: 'Seller User',
          role: 'SELLER',
        },
      },
    });

    render(<Page />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'seller@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockShowSuccessNotification).toHaveBeenCalledWith('Welcome Seller User');
    });
  });

  it('displays error message and notification on login failure', async () => {
    mockAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid email or password',
        },
      },
    });

    render(<Page />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorNotification).toHaveBeenCalledWith('Invalid email or password');
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('disables submit button and shows loading state during login', async () => {
    mockAxios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Page />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Logging in...');
  });
});