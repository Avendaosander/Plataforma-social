import React, { useState } from 'react'
import Button from './Button'
import LightIcon from '../icons/LightIcon'
import MoonIcon from '../icons/MoonIcon';

function ButtonDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <Button
      className='mx-0 px-3 text-sm md:text-lg w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
      shape='none'
      startContent={isDarkMode ? <MoonIcon className='size-4 md:size-5'/> : <LightIcon className='size-4 md:size-5'/>}
      onClick={toggleDarkMode}
    >
      {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
    </Button>
  )
}

export default ButtonDarkMode