'use client';

import { SignInButton } from '@clerk/clerk-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { CrumpledPaperIcon } from '@radix-ui/react-icons';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';

import { ThemeToggle } from './theme-toggle';

const links: Array<{ name: string; href: Route }> = [
  { name: 'Resources', href: '/resources' },
  {
    name: 'Articles',
    href: '/articles',
  },
];

type NavbarProps = {
  className?: string;
};

export const Navbar = ({ className }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <ul className="flex items-center gap-6">
        <li>
          <Link href="/" className="flex items-center gap-2">
            <CrumpledPaperIcon className="h-8 w-8 text-primary" />
            <h1 className="sr-only font-bold uppercase md:not-sr-only">
              Digestor5000
            </h1>
          </Link>
        </li>
        <div className="ml-auto flex items-center gap-6">
          {links.map(({ name, href }) => {
            const isActive = pathname.startsWith(href);

            return (
              <li key={name}>
                <Link
                  href={href}
                  className={twMerge(
                    'rounded-sm px-2 py-1 transition-colors hover:bg-primary',
                    isActive && 'bg-primary'
                  )}
                >
                  {name}
                </Link>
              </li>
            );
          })}
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <ThemeToggle />
        </div>
      </ul>
    </nav>
  );
};
