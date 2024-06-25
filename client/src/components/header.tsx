'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const initializeTheme = () => {
    const darkThemePreffered = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(darkThemePreffered);
  };

  const exchangeGoogleToken = async (code: string) => {
    await axios.post(
      'http://localhost:3001/api/auth/google',
      {
        code,
      },
      { withCredentials: true },
    );
  };

  const googleLogin = useGoogleLogin({
    onSuccess: ({ code }) => exchangeGoogleToken(code),
    scope: 'profile',
    flow: 'auth-code',
  });

  useEffect(() => {
    initializeTheme();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      document.documentElement.removeAttribute('data-mode');
    }
  }, [darkMode]);

  const sharedBarClass = 'h-1 bg-slate-50 dark:bg-slate-400 transition-all animation-delay-400';

  const firstBarClass = classNames(sharedBarClass, {
    'translate-y-3.5 rotate-[-45deg]': menuOpen,
  });

  const middleBarClass = classNames(sharedBarClass, {
    'opacity-0': menuOpen,
  });

  const lastBarClass = classNames(sharedBarClass, {
    'translate-y-[-0.45rem] rotate-45': menuOpen,
  });

  const stripContainerClass = classNames('w-full h-full', {
    'overflow-hidden absolute hidden': !menuOpen,
    'opacity-100 fixed top-0 left-0 block': menuOpen,
  });

  const navContainerClass = classNames(
    'flex items-center justify-center flex-col items-center h-full',
    {
      'translate-y-0': menuOpen,
    },
  );

  const stripClass = classNames(
    'absolute inset-y-0 w-1/5 bg-slate-950 translate-y-[-100%] animate-slideIn',
  );

  const toggleThemeClass = classNames('fas text-3xl w-8 h-8', {
    'fa-sun': !darkMode,
    'fa-moon': darkMode,
  });

  return (
    <header className="flex justify-between p-2 shadow-md sticky bg-slate-950">
      <h1 className="text-3xl md:text-5xl grow text-slate-50 dark:text-slate-400">RaffleHub</h1>
      <button className="text-slate-50 dark:text-slate-400 google-button" onClick={googleLogin}>
        Login
      </button>
      <div className="px-2 cursor-pointer text-slate-50 dark:text-slate-400 my-auto">
        <i className={toggleThemeClass} onClick={toggleDarkMode} />
      </div>
      <div
        className="w-8 h-8 flex flex-col justify-around z-10 cursor-pointer my-auto"
        onClick={toggleMenu}
      >
        <div className={firstBarClass}></div>
        <div className={middleBarClass}></div>
        <div className={lastBarClass}></div>
      </div>
      <div className={stripContainerClass}>
        <div className={`${stripClass} left-[0%]`} />
        <div className={`${stripClass} left-[20%] animation-delay-100`} />
        <div className={`${stripClass} left-[40%] animation-delay-200`} />
        <div className={`${stripClass} left-[60%] animation-delay-300`} />
        <div className={`${stripClass} left-[80%] animation-delay-400`} />
        <nav className="h-5/6">
          <ul className={navContainerClass}>
            <li className="my-4">
              <Link
                href="/"
                onClick={toggleMenu}
                className="text-4xl transition-all font-thin text-slate-100 dark:text-slate-400 md:hover:font-normal md:hover:border-b"
              >
                Raffles
              </Link>
            </li>
            <li className="my-4">
              <Link
                href="/raffles/new"
                onClick={toggleMenu}
                className="text-4xl transition-all font-thin text-slate-100 dark:text-slate-400 md:hover:font-normal md:hover:border-b"
              >
                Create new raffle
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
