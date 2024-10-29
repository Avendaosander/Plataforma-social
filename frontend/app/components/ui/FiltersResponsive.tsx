import Link from 'next/link';
import React from 'react'
import Button from './Button';
import { usePathname } from 'next/navigation';
import UserCheck from '../icons/UserCheckIcon';
import TrendingIcon from '../icons/TrendingIcon';

function FiltersResponsive() {
	const pathname = usePathname()
  return (
    <div className="md:hidden flex items-center justify-center border-b border-white/40 w-full">
      <ul className="flex">
        <li>
          <Link href={"/home/followers"}>
            <Button
              variant='ghost'
              shape='none'
              className={`p-2 ${
                pathname == "/home/followers"
                  ? "bg-storm-100/30"
                  : "hover:bg-storm-100/20"
              }`}
              startContent={<UserCheck className="size-4 md:size-5" />}
            >
              Siguiendo
            </Button>
          </Link>
        </li>
        <li>
          <Link href={"/home/populates"}>
            <Button
              variant='ghost'
              shape='none'
              className={`p-2 ${
                pathname == "/home/populates"
                  ? "bg-storm-100/30"
                  : "hover:bg-storm-100/20"
              }`}
              startContent={<TrendingIcon className="size-4 md:size-5" />}
            >
              Populares
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default FiltersResponsive