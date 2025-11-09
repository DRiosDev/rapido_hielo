// context/NetworkContext.jsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Network from "expo-network";
import { AppState } from "react-native";

interface NetworkContextType {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const checkConnection = async () => {
    const status = await Network.getNetworkStateAsync();
    setIsConnected(status.isConnected && status.isInternetReachable !== false);
  };

  useEffect(() => {
    checkConnection(); // initial check

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkConnection();
      }
    });

    const interval = setInterval(checkConnection, 5000); // check every 5 sec

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
