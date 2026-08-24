import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login or Sign Up | LocalFix',
  description: 'Access your LocalFix account to manage bookings, track emergencies, and connect with experts.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
