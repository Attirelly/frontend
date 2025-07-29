// utils/selectStyles.ts

import { StylesConfig } from 'react-select';
import { GroupBase } from 'react-select';

const customStyles: StylesConfig<any, false, GroupBase<any>> = {
  menuList: (base) => ({
    ...base,
    maxHeight: '200px',
    overflowY: 'auto',
    '::-webkit-scrollbar': {
      width: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: '#ffffff',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#B0B0B0',
      borderRadius: '4px',
    },
    '.dark &::-webkit-scrollbar-track': {
      background: '#ffffff',
    },
    '.dark &::-webkit-scrollbar-thumb': {
      background: '#B0B0B0',
    },
  }),
  // Add more overrides (control, option, etc) if needed
};

export default customStyles;
