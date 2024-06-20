'use client'
import React, { useState } from 'react'

interface ChatType {
    role: string
    text: string
}

const ChatComponent = () => {
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<ChatType[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async () => {
        setIsLoading(true)
        // Add the user message to the chat history
        const updatedHistory = [...chatHistory, { role: 'user', text: message }]
        setChatHistory(updatedHistory)

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, history: updatedHistory })
        })

        const data = await res.json()

        // Add the model response to the chat history
        setChatHistory([
            ...updatedHistory,
            { role: 'model', text: data.response }
        ])
        setMessage('') // Clear the input
        setIsLoading(false)
    }

    // Fungsi untuk memformat respons agar mendukung HTML
    const formatResponse = (response: string) => {
        return response
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>')
            .replace(
                /\* \*\*(.+?)\*\*\:(.+?)<br\/>/g,
                '<strong>$1</strong>: $2<br/>'
            )
    }

    return (
        <div className='max-w-screen-md mx-auto w-full p-4 grid grid-rows-[36px_1fr_160px] h-full'>
            <h1 className='text-2xl font-bold mb-4'>Chat dengan Bilal</h1>
            <div className='rounded-lg p-4 mb-4 overflow-y-auto'>
                {chatHistory.map((chat: ChatType, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded ${
                            chat.role === 'user'
                                ? 'bg-blue-100 text-right'
                                : 'bg-gray-100 text-left'
                        }`}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: formatResponse(chat.text)
                            }}
                        />
                    </div>
                ))}
                {isLoading && (
                   <div className="mb-2 p-4 rounded bg-gray-100 text-left animate-pulse">
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
                        <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
                        <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
                    </div>
                   </div>
                )}
            </div>
            <div className=''>
                <textarea
                    className='w-full border border-gray-300 rounded-lg p-2 mb-2'
                    style={{ height: '100px' }}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                        }
                    }}
                    placeholder='Ketik pesan di sini...'
                />
                <button
                    onClick={handleSendMessage}
                    className='inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500'>
                    Kirim
                </button>
            </div>
        </div>
    )
}

export default ChatComponent
