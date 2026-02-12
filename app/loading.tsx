export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]">
      <div className="loader-spinner" aria-hidden />
    </div>
  );
}
