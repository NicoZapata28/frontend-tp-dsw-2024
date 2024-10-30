import audioIcon from './img/audio-icon.svg';
import peripheralsIcon from './img/peripherals-icon.svg';
import tabletsIcon from './img/tablets-icon.svg';

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Audio':
      return audioIcon;
    case 'Periféricos':
      return peripheralsIcon;
    case 'Tablets':
      return tabletsIcon;
    default:
      return '';
  }
};