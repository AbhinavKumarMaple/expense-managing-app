import React, {createContext, useState, useContext} from 'react';

const ImageContext = createContext();

export const ImageProvider = ({children}) => {
  const [newScannedImages, setNewScannedImages] = useState([]);
  const [count, setCount] = useState(0);

  return (
    <ImageContext.Provider
      value={{newScannedImages, setNewScannedImages, count, setCount}}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  return useContext(ImageContext);
};
