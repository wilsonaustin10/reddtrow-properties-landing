import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onAddressSelect?: (isSelected: boolean) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  isAddressSelected?: boolean;
}

const AddressAutocomplete = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = "123 Main St, City, State, ZIP",
  required = false,
  className = "h-12",
}: AddressAutocompleteProps) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // Mark address as valid when there's content
    onAddressSelect?.(newValue.trim().length > 0);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="address" className="flex items-center space-x-1 text-foreground">
        <MapPin className="w-4 h-4" />
        <span>Property Address {required && '*'}</span>
      </Label>

      <Input
        id="address"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
        className={className}
      />
    </div>
  );
};

export default AddressAutocomplete;
