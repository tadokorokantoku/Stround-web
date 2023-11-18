"use client"

import React, { FC } from 'react';
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge';
import {RxCaretLeft, RxCaretRight} from 'react-icons/rx'

import Button from '@/components/Button'
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser'
import '@mantine/core/styles.css';
import HeaderIcon from './HeaderIcon';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
};

const Header: FC<HeaderProps> = ({
  children,
  className
}) => {
  const authModal = useAuthModal();
  const router = useRouter();

  const { user, userDetails } = useUser();

  return (
    <div
      className={twMerge(`
        h-fit
        bg-gradient-to-b
        from-emerald-800
        p-6
      `,
      className)}>
        <div className='
          w-full
          mb-4
          flex
          items-center
          justify-between
        '>
          <div className="
            hidden
            md:flex
            gap-x-2
            items-center
          ">
            <button
            onClick={() => router.back()} 
            className='
              rounded-full
              bg-black
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            '>
              <RxCaretLeft className="text-white" size={35} />
            </button>
            <button
            onClick={() => router.forward()}  
            className='
              rounded-full
              bg-black
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            '>
              <RxCaretRight className="text-white" size={35} />
            </button>
          </div> 
          {user && userDetails ? (
            <HeaderIcon user={userDetails} />
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onSingUp}
                  className='
                    bg-transparent
                    text-neutral-300
                    font-medium
                  '
                >
                  Sign up
                </Button>
                <Button
                  onClick={authModal.onSingIn}
                  className='
                    bg-white
                    px-6
                    py-2
                  '
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
        {children}
    </div>
  )
};

export default Header;