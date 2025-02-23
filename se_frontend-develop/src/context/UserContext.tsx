import React, { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { fetchJobSeekerInfo } from "../api/JobSeeker";
import { fetchEmployerInfo } from "../api/Employer";
import { fetchCompanyInfo } from "../api/Company";

interface UserContextType {
  user: any;
  isLoading: boolean;
  isLoggedIn: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const { isLoading: isLoadingJobSeeker } = useQuery(
    "currentJobSeeker",
    fetchJobSeekerInfo,
    {
      onSuccess: (data) => {
        setUser((prev: any) => prev ?? data);
      },
    }
  );

  const { isLoading: isLoadingEmployer } = useQuery(
    "currentEmployer",
    fetchEmployerInfo,
    {
      onSuccess: (data) => {
        setUser((prev: any) => prev ?? data);
      },
    }
  );

  const { isLoading: isLoadingCompany } = useQuery(
    "currentCompany",
    fetchCompanyInfo,
    {
      onSuccess: (data) => {
        setUser((prev: any) => prev ?? data);
      },
    }
  );

  const isLoading = isLoadingJobSeeker || isLoadingEmployer || isLoadingCompany;
  const isLoggedIn = !!user;

  return (
    <UserContext.Provider value={{ user, isLoading, isLoggedIn, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
