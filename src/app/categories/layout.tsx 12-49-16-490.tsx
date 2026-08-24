import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Categories | LocalFix',
  description: 'Browse our wide range of trusted home services including electricians, plumbers, and more.',
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
