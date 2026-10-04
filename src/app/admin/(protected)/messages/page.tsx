"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Mail,
  MailOpen,
  RefreshCw,
  Trash2,
} from "lucide-react";

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  async function fetchMessages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/messages",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load messages"
        );
      }

      setMessages(
        data.messages || []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load messages"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function toggleRead(
    message: Message
  ) {
    try {
      setUpdatingId(message._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/messages/${message._id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            isRead: !message.isRead,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update message"
        );
      }

      setMessages((current) =>
        current.map((item) =>
          item._id === message._id
            ? {
                ...item,
                isRead:
                  !message.isRead,
              }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update message"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteMessage(
    message: Message
  ) {
    const confirmed =
      window.confirm(
        `Delete message from ${message.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(message._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/messages/${message._id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete message"
        );
      }

      setMessages((current) =>
        current.filter(
          (item) =>
            item._id !== message._id
        )
      );

      setSuccess(
        "Message deleted successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete message"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const unreadCount =
    messages.filter(
      (message) => !message.isRead
    ).length;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
              Inbox / Contact
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Messages
            </h1>

            <p className="mt-3 text-sm text-white/40">
              {unreadCount} unread{" "}
              {unreadCount === 1
                ? "message"
                : "messages"}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/50 transition hover:border-cyan-400/30 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {loading ? (
          <div className="border border-white/10 py-16 text-center text-sm text-white/40">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="border border-dashed border-white/10 py-20 text-center">
            <Mail
              size={30}
              className="mx-auto mb-4 text-white/20"
            />

            <p className="text-white/50">
              No messages yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(
              (message) => (
                <article
                  key={message._id}
                  className={`border p-5 transition sm:p-6 ${
                    message.isRead
                      ? "border-white/10 bg-white/[0.01]"
                      : "border-cyan-400/20 bg-cyan-400/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span
                          className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${
                            message.isRead
                              ? "text-white/25"
                              : "text-cyan-400"
                          }`}
                        >
                          {message.isRead ? (
                            <MailOpen
                              size={
                                13
                              }
                            />
                          ) : (
                            <Mail
                              size={
                                13
                              }
                            />
                          )}

                          {message.isRead
                            ? "Read"
                            : "Unread"}
                        </span>

                        <span className="font-mono text-[10px] text-white/20">
                          {new Date(
                            message.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>

                      <h2 className="text-lg font-medium sm:text-xl">
                        {
                          message.subject
                        }
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="text-white/60">
                          {message.name}
                        </span>

                        <a
                          href={`mailto:${message.email}`}
                          className="text-white/30 transition hover:text-cyan-400"
                        >
                          {
                            message.email
                          }
                        </a>
                      </div>

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-white/45">
                          {
                            message.message
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2 lg:flex-col">
                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          message._id
                        }
                        onClick={() =>
                          toggleRead(
                            message
                          )
                        }
                        className="flex items-center justify-center gap-2 border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-400 disabled:opacity-40"
                      >
                        {message.isRead ? (
                          <Mail
                            size={
                              14
                            }
                          />
                        ) : (
                          <Check
                            size={
                              14
                            }
                          />
                        )}

                        {message.isRead
                          ? "Unread"
                          : "Mark Read"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          message._id
                        }
                        onClick={() =>
                          deleteMessage(
                            message
                          )
                        }
                        className="flex items-center justify-center gap-2 border border-red-500/10 px-3 py-2 text-xs text-red-300/60 transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                      >
                        <Trash2
                          size={14}
                        />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}