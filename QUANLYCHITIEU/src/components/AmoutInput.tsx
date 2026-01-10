type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function AmountInput({ value, onChange, placeholder }: Props) {
  // Format display value with thousand separators
  const formatDisplay = (val: string) => {
    if (!val) return "";
    const numbers = val.replace(/\D/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Get clean numeric value
  const getCleanValue = (val: string) => {
    return val.replace(/\D/g, "");
  };

  return (
    <input
      inputMode="numeric"
      value={formatDisplay(value)}
      onChange={(e) => {
        const cleanValue = getCleanValue(e.target.value);
        onChange(cleanValue);
      }}
      placeholder={placeholder ?? "0"}
      className="w-full border rounded px-3 py-2 text-lg font-medium"
      aria-label="Số tiền"
    />
  );
}
