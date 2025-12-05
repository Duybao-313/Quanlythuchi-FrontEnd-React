
type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function AmountInput({ value, onChange, placeholder }: Props) {
  return (
    <input
      inputMode="numeric"
      value={value}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d.,-]/g, "");
        onChange(raw);
      }}
      placeholder={placeholder ?? "0"}
      className="w-full border rounded px-3 py-2 text-lg font-medium"
      aria-label="Số tiền"
    />
  );
}