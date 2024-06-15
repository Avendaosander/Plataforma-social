import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Button
      size='lg'
      className='mx-0 px-3 w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
      shape='none'
      startContent={isDarkMode ? <MoonIcon /> : <LightIcon />}
      onClick={toggleDarkMode}
    >
      {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
    </Button>
  )
}

export default ButtonDarkMode