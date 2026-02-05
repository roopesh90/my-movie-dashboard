'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const categories = [
  { name: 'All', href: '/' },
  { name: 'Outstanding', href: '/outstanding' },
  { name: 'Mediocre', href: '/mediocre' },
  { name: 'Shit', href: '/shit' },
  { name: 'To Watch', href: '/towatch' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              🎬 Movie Archive
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {categories.map((category) => {
                const isActive = pathname === category.href;
                return (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="relative px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <span
                      className={
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }
                    >
                      {category.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = pathname === category.href;
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
