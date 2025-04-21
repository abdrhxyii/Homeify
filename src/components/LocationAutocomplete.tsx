import { useEffect, useRef } from 'react';
import { Input } from 'antd';
import { FormInstance } from 'antd/lib/form';

interface LocationAutocompleteProps {
  form: FormInstance;
}

const LocationAutocomplete = ({ form }: LocationAutocompleteProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      types: ['address'],
      componentRestrictions: { country: 'us' } // Optional: restrict to a specific country
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current!.getPlace();
      
      if (!place.formatted_address) return;
      
      // Update the form with the selected place's full address
      form.setFieldsValue({ location: place.formatted_address });
      
      // Optionally store latitude and longitude
      if (place.geometry?.location) {
        form.setFieldsValue({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        });
      }
    });

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [form]);

  return (
    <Input 
      ref={inputRef as any} 
      placeholder="Start typing your address"
    />
  );
};

export default LocationAutocomplete;