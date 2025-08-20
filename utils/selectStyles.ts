// import { StylesConfig, GroupBase } from "react-select";

// const customStyles: StylesConfig<any, false, GroupBase<any>> = {
//   // Main container of the select input
//   control: (base) => ({
//     ...base,
//     borderRadius: "8px",
//     borderColor: "#E2E8F0",
//     boxShadow: "none",
//     "&:hover": {
//       borderColor: "#CBD5E0", // Slightly darker on hover
//     },
//   }),

//   // Selected option text in main input field
//   singleValue: (base) => ({
//     ...base,
//     color: "#0F0F0F", // Dark gray text
//   }),

//   // Dropdown menu list
//   menuList: (base) => ({
//     ...base,
//     maxHeight: "200px",
//     overflowY: "auto",
//     "::-webkit-scrollbar": {
//       // width: "8px",
//       display : "none"
//     },
//     scrollbarWidth: "none", 
//   }),

//   // Each option in dropdown
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#6A6A6A50" // medium grey
//       : state.isFocused
//       ? "#6A6A6A12" 
//       : "white",
//     color: state.isSelected ? "white" : "#0F0F0F", // Text color
//     cursor: "pointer",
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
  valueContainer: (base) => ({
    ...base,
    justifyContent: "center", // This centers the content horizontally
  }),

  // Selected option text in main input field
  singleValue: (base) => ({
    ...base,
    color: "#0F0F0F", // Dark gray text
  }),

  // Dropdown menu container (the pop-up)
  // --- THIS IS THE ADDED SECTION ---
  menu: (base) => ({
    ...base,
    // Set a fixed width, a percentage, or 'max-content'
    width: "max-content", // Automatically sizes to fit the longest option
    minWidth: "100%",      // Ensures it's at least as wide as the input
    zIndex: 9999,          // Ensures the menu appears above other content
  }),
  // --- END OF ADDED SECTION ---

  // Dropdown menu list
  menuList: (base) => ({
    ...base,
    maxHeight: "400px",
    overflowY: "auto",
    "::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
  }),

  // Each option in dropdown
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#6A6A6A50" // medium grey for selected
      : state.isFocused
      ? "#6A6A6A12" // light grey for focused/hover
      : "white",
    color: "#0F0F0F", // Text color for options
    cursor: "pointer",
  }),
};

export default customStyles;