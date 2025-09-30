'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Message } from '@/types'
import { formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import Link from 'next/link'

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    fetchMessages()
  }, [session, status, router])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    setIsSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 bg-primary-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Agrupar mensajes por usuario
  const messageGroups = messages.reduce((groups, message) => {
    const otherUserId = message.senderId === session.user.id 
      ? message.receiverId 
      : message.senderId
    
    if (!groups[otherUserId]) {
      groups[otherUserId] = {
        user: message.senderId === session.user.id ? message.receiver : message.sender,
        messages: []
      }
    }
    
    groups[otherUserId].messages.push(message)
    return groups
  }, {} as Record<string, { user: any; messages: Message[] }>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Mensajes
        </h1>
        <p className="text-secondary-600">
          Comunícate con otros usuarios del marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de conversaciones */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-4 border-b border-secondary-200">
              <h2 className="font-semibold text-secondary-900">Conversaciones</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {Object.keys(messageGroups).length === 0 ? (
                <div className="p-4 text-center text-secondary-500">
                  <p>No tienes conversaciones aún</p>
                </div>
              ) : (
                Object.entries(messageGroups).map(([userId, group]) => (
                  <button
                    key={userId}
                    onClick={() => setSelectedUser(userId)}
                    className={`w-full p-4 text-left border-b border-secondary-100 hover:bg-secondary-50 ${
                      selectedUser === userId ? 'bg-primary-50 border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {group.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-secondary-900 truncate">
                          {group.user.name}
                        </p>
                        <p className="text-sm text-secondary-500 truncate">
                          {group.messages[0]?.content}
                        </p>
                      </div>
                      <div className="text-xs text-secondary-400">
                        {formatDateTime(group.messages[0]?.createdAt || new Date())}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 h-96 flex flex-col">
              <div className="p-4 border-b border-secondary-200">
                <h3 className="font-semibold text-secondary-900">
                  {messageGroups[selectedUser]?.user.name}
                </h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messageGroups[selectedUser]?.messages
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.senderId === session.user.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === session.user.id
                            ? 'text-primary-100'
                            : 'text-secondary-500'
                        }`}>
                          {formatDateTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-4 border-t border-secondary-200">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    isLoading={isSending}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-secondary-600">
                  Elige una conversación de la lista para comenzar a chatear
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}







