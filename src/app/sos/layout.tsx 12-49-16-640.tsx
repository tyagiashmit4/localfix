import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency SOS Services | LocalFix',
  description: 'Get immediate help for electrical, plumbing, and safety emergencies. Fast dispatch within minutes.',
};

export default function SOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
