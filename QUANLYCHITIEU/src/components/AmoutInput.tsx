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
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="text-gray-400 font-medium">₫</span>
      </div>
      <input
        inputMode="numeric"
        value={formatDisplay(value)}
        onChange={(e) => {
          const cleanValue = getCleanValue(e.target.value);
          onChange(cleanValue);
        }}
        placeholder={placeholder ?? "0"}
        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        aria-label="Số tiền"
      />
    </div>
  );
}
