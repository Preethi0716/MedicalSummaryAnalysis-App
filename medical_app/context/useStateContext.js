import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [bookmarkDataUpdated, setBookmarkDataUpdated] = useState(false);

  return (
    <AppContext.Provider value={{ bookmarkDataUpdated, setBookmarkDataUpdated }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateContext = () => useContext(AppContext);