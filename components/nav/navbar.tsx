'use client';

import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

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
          <Link href="/" className="transition-colors hover:text-orange-500">
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
                    'transition-colors hover:text-orange-500',
                    isActive && 'text-orange-500'
                  )}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </div>
      </ul>
    </nav>
  );
};
