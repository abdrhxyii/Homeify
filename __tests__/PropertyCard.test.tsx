import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { showErrorNotification } from '@/lib/notificationUtil';
import PropertyCard from '@/components/propertycard';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/lib/notificationUtil', () => ({
  showErrorNotification: jest.fn(),
}));

describe('PropertyCard component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  const mockProperty = {
    _id: '123',
    title: 'Modern Apartment',
    price: 250000,
    location: 'New York, USA',
    bedrooms: 3,
    amenities: ['wifi', 'pool'],
    images: ['/test-image.jpg'],
  };

  it('renders property details', () => {
    render(<PropertyCard description={''} propertyType={''} bathrooms={0} area={0} listingType={''} sellerId={''} createdAt={''} {...mockProperty} />);

    expect(screen.getByText(/Modern Apartment/i)).toBeInTheDocument();
    expect(screen.getByText(/\$250,000/)).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    expect(screen.getByText(/3 Bed/)).toBeInTheDocument();
    expect(screen.getByText(/Wi-Fi/)).toBeInTheDocument();
  });

  it('tracks click and navigates to property page on card click', async () => {
    (axios.post as jest.Mock).mockResolvedValue({});

    render(<PropertyCard description={''} propertyType={''} bathrooms={0} area={0} listingType={''} sellerId={''} createdAt={''} {...mockProperty} />);

    const card = screen.getByRole('img').closest('div');
    fireEvent.click(card!);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/property/track-click', { propertyId: '123' });
      expect(mockPush).toHaveBeenCalledWith('/property/123');
    });
  });

  it('shows error notification on click failure but still navigates', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Failed'));

    render(<PropertyCard description={''} propertyType={''} bathrooms={0} area={0} listingType={''} sellerId={''} createdAt={''} {...mockProperty} />);

    const card = screen.getByRole('img').closest('div');
    fireEvent.click(card!);

    await waitFor(() => {
      expect(showErrorNotification).toHaveBeenCalledWith('Failed to record property click');
      expect(mockPush).toHaveBeenCalledWith('/property/123');
    });
  });
});
