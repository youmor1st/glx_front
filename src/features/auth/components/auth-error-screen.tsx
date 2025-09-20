export default function AuthErrorScreen() {
  return (
    <div className="flex flex-col h-svh items-center justify-center">
      <img src="ErrorIllustation.svg" alt="Error" />
      <div className="flex items-center flex-col gap-1">
        <h2 className="text-light-100 font-semibold text-base">Oops!</h2>
        <p className="text-secondary-background/40 text-xs font-medium">
          Something went wrong. Please try again.
        </p>
      </div>
    </div>
  );
}
