'use client';

import { SignInButton } from '@clerk/clerk-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';

import logo from './logo.png';

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
          <Link href="/">
            <h1 className="sr-only">Digestor 5000</h1>
            <Image src={logo} width={64} height={64} alt="Digestor 5000 logo" />
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
        </div>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </ul>
    </nav>
  );
};
