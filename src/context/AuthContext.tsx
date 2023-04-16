import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { CognitoUser } from "@aws-amplify/auth";
import { Auth, Hub } from "aws-amplify";

/*
Exports { AuthContext, useUser }
AuthContext provides { user }, and listens for auth events and executes setUser() after successful currentAuthenticatedUser().
useUser() returns { user } (Must be within AuthContext.)
*/

interface UserContextType {
  user: CognitoUser | null;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

interface Props {
  children: ReactElement;
}

export default function AuthContext({ children }: Props): ReactElement {
  const [user, setUser] = useState<CognitoUser | null>(null);

  async function checkUser() {
    try {
      const amplifyUser = await Auth.currentAuthenticatedUser();
      setUser(amplifyUser ?? null);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
    Hub.listen("auth", () => {
      checkUser();
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export const useUser = (): UserContextType => useContext(UserContext);
