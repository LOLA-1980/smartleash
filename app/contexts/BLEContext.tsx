import React, {
    createContext,
    useContext,
    useState,
} from "react";

type BLEContextType = {

  connected: boolean;

  deviceName: string | null;

  battery: number;

  connect: (name: string) => void;

  disconnect: () => void;

};

const BLEContext = createContext<BLEContextType>(
  {} as BLEContextType
);

export function BLEProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [connected, setConnected] =
    useState(false);

  const [deviceName, setDeviceName] =
    useState<string | null>(null);

  const [battery, setBattery] =
    useState(100);

  const connect = (name: string) => {

  setConnected(true);

  setDeviceName(name);

  setBattery(100);

};

const disconnect = () => {

  setConnected(false);

  setDeviceName(null);

};

return (

  <BLEContext.Provider
    value={{
      connected,
      deviceName,
      battery,
      connect,
      disconnect,
    }}
  >

    {children}

  </BLEContext.Provider>

);

}

export function useBLE() {

  return useContext(BLEContext);

}