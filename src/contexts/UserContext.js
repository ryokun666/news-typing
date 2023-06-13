import { createContext, useState, useContext } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
