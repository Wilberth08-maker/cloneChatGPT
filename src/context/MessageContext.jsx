import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./message-content.scss";

const MessageContent = ({ role, content, isLoading, isLast }) => {
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div
                className={`message__bubble p-2.5 rounded-3xl ${role === "user"
                    ? "message__user dark:text-gray-200 dark:bg-gray-800"
                    : "message__assistant dark:text-gray-200"
                    }`}
            >
                {content ? (
                    role === "assistant" ? (
                        <div className="message__markdown">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    code: ({ inline, className, children }) =>
                                        inline ? (
                                            <code className="message__inline-code">{children}</code>
                                        ) : (
                                            <pre className="message__code-block dark:text-gray-100 dark:bg-gray-950">
                                                <code className={className}>{children}</code>
                                            </pre>
                                        ),
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
};

export default MessageContent;
