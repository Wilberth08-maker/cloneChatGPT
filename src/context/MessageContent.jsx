import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./message-content.scss";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDarkMode } from "./DarkModeContext";


const MessageContent = React.memo(({ role, content, isLoading, isLast }) => {
    const { darkMode, setDarkMode } = useDarkMode();
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`message__bubble p-2.5 rounded-3xl ${role === "user"
                    ? "message__user dark:text-gray-200 dark:bg-gray-800 mt-4"
                    : "message__assistant  dark:text-gray-200"
                    }`}
            >
                {content ? (
                    role === "assistant" ? (
                        <div className="message__markdown">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                language={match[1]}
                                                style={darkMode ? dracula : oneLight}
                                                PreTag="div"
                                                className="message__code-block"
                                                customStyle={{
                                                    maxWidth: "100%",
                                                    overflowX: "auto",
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    boxSizing: "border-box",
                                                }}
                                                codeTagProps={{
                                                    style: {
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    },
                                                }}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className="message__inline-code bg-gray-200 dark:bg-gray-700 dark:text-gray-200">{children}</code>
                                        );
                                    },
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="message__link"
                                        >
                                            {children}
                                        </a>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <span className="p-2 items-center block">{content}</span>
                    )
                ) : isLoading && role === "assistant" && isLast ? (
                    <div className="ml-2 w-3.5 h-3.5 bg-gray-900 rounded-full animate-pulse dark:bg-gray-200" />
                ) : null}
            </div>
        </div>
    );
});

export default MessageContent;
