import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext debe usarse dentro de ChatProvider");
    }
    return context;
};