'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mt-6 text-center">
      <h2 className="mb-6 text-2xl font-bold">
        Oops, something went wrong! 😿
      </h2>
      <p>{error.message}</p>
    </div>
  );
}
