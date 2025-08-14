// // utils/selectStyles.ts

// import { StylesConfig } from 'react-select';
// import { GroupBase } from 'react-select';

// const customStyles: StylesConfig<any, false, GroupBase<any>> = {
//   menuList: (base) => ({
//     ...base,
//     maxHeight: '200px',
//     overflowY: 'auto',
//     '::-webkit-scrollbar': {
//       width: '8px',
//     },
//     '::-webkit-scrollbar-track': {
//       background: '#ffffff',
//     },
//     '::-webkit-scrollbar-thumb': {
//       background: '#B0B0B0',
//       borderRadius: '4px',
//     },
//     '.dark &::-webkit-scrollbar-track': {
//       background: '#ffffff',
//     },
//     '.dark &::-webkit-scrollbar-thumb': {
//       background: '#B0B0B0',
//     },
//   }),
//   singleValue: (base) => ({
//     ...base,
//     color: '#B0B0B0', // Set your desired color here
//   }),
// };

// export default customStyles;

import { StylesConfig, GroupBase } from "react-select";

const customStyles: StylesConfig<any, false, GroupBase<any>> = {
  // Main container of the select input
  control: (base) => ({
    ...base,
    borderRadius: "8px",
    borderColor: "#E2E8F0",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#CBD5E0", // Slightly darker on hover
    },
  }),

  // Selected option text in main input field
  singleValue: (base) => ({
    ...base,
    color: "#0F0F0F", // Dark gray text
  }),

  // Dropdown menu list
  menuList: (base) => ({
    ...base,
    maxHeight: "200px",
    overflowY: "auto",
    "::-webkit-scrollbar": {
      // width: "8px",
      display : "none"
    },
    scrollbarWidth: "none", 
  }),

  // Each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#6A6A6A50" // medium grey
      : state.isFocused
      ? "#6A6A6A12" 
      : "white",
    color: state.isSelected ? "white" : "#0F0F0F", // Text color
    cursor: "pointer",
  }),
};

export default customStyles;
