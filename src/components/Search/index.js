import React from 'react';
import { AutoComplete } from 'antd';
const Search = ({ placeholder, onSelect, onSearch, options, children }) => {
  return (
    <>
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300 }}
        options={options}
        onSearch={onSearch}
        onSelect={(val, option) => onSelect(val, option)}
        placeholder={placeholder}
      >
        {children}
      </AutoComplete>
    </>
  );
};

export default Search;
