export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 flex-1">
      {children}
    </main>
  );
}
