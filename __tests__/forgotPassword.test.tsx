import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { showSuccessNotification, showErrorNotification } from '@/lib/notificationUtil';
import ResetPasswordPage from '@/app/forgot-password/page';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/lib/notificationUtil', () => ({
  showSuccessNotification: jest.fn(),
  showErrorNotification: jest.fn(),
}));

describe('ResetPasswordPage Component', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  const mockUseRouter = useRouter as jest.Mock;
  const mockShowSuccessNotification = showSuccessNotification as jest.Mock;
  const mockShowErrorNotification = showErrorNotification as jest.Mock;

  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders reset password form with all input fields', () => {
    render(<ResetPasswordPage />);

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  it('allows user to input data into form fields', () => {
    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

    expect(emailInput).toHaveValue('john@example.com');
    expect(newPasswordInput).toHaveValue('newpassword123');
    expect(confirmPasswordInput).toHaveValue('newpassword123');
  });

  it('successfully resets password and redirects to login', async () => {
    mockAxios.patch.mockResolvedValue({
      data: { message: 'Password reset successful.' },
    });

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAxios.patch).toHaveBeenCalledWith('/api/auth/forgot-password', {
        email: 'john@example.com',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      });
      expect(mockShowSuccessNotification).toHaveBeenCalledWith('Password reset successful.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('displays error when passwords do not match', () => {
    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(mockAxios.patch).not.toHaveBeenCalled();
  });

  it('displays error message and notification on reset failure', async () => {
    mockAxios.patch.mockRejectedValue({
      response: {
        data: {
          message: 'User not found.',
        },
      },
    });

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowErrorNotification).toHaveBeenCalledWith('User not found.');
      expect(screen.getByText('User not found.')).toBeInTheDocument();
    });
  });

  it('disables submit button and shows loading state during reset', async () => {
    mockAxios.patch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Resetting...');
    expect(submitButton).toHaveClass('bg-gray-400');
  });
});