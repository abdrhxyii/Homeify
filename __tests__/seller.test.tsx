import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { useAuthStore } from '@/store/useAuthStore';
import { showSuccessNotification, showErrorNotification } from '@/lib/notificationUtil';
import SellerRegister from '@/app/seller-account/page';

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

describe('SellerRegister Component', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  const mockUseRouter = useRouter as jest.Mock;
  const mockSetCookie = setCookie as jest.Mock;
  const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
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

  it('renders seller registration form with all input fields', () => {
    render(<SellerRegister />);

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('allows user to input data into form fields', () => {
    render(<SellerRegister />);

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const phoneInput = screen.getByPlaceholderText('Phone Number');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(phoneInput).toHaveValue('1234567890');
  });

  it('successfully registers a seller and redirects', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        token: 'mock-token',
        user: {
          id: 'user1',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'SELLER',
        },
      },
    });

    render(<SellerRegister />);

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/auth/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        role: 'SELLER',
      });
      expect(mockSetCookie).toHaveBeenCalledWith(null, 'token', 'mock-token', {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
      expect(mockSetCookie).toHaveBeenCalledWith(
        null,
        'user',
        JSON.stringify({
          id: 'user1',
          email: 'john@example.com',
          name: 'John Doe',
          role: 'SELLER',
        }),
        {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        }
      );
      expect(mockCheckAuthStatus).toHaveBeenCalled();
      expect(mockShowSuccessNotification).toHaveBeenCalledWith('Account created successfully!');
      expect(mockPush).toHaveBeenCalledWith('/');
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

    render(<SellerRegister />);

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorNotification).toHaveBeenCalledWith('User already exists');
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('disables submit button and shows loading state during registration', async () => {
    mockAxios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SellerRegister />);

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Creating account...');
    expect(submitButton).toHaveClass('bg-gray-400');
  });
});