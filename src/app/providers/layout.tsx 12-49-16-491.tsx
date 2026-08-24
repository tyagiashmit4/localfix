import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Rated Service Experts | LocalFix',
  description: 'Find and book top-rated, verified local service professionals in your area.',
};

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
