type StatusItemProps = {
  label: string;
  value: string;
  mono?: boolean;
};

export function StatusItem({ label, value, mono = false }: StatusItemProps) {
  return (
    <div className="status-item">
      <p>{label}</p>
      <p className={mono ? "status-value monospace" : "status-value"}>{value}</p>
    </div>
  );
}