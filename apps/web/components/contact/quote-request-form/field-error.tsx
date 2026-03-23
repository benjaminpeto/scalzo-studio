export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-3 text-sm text-destructive">{message}</p>;
}
