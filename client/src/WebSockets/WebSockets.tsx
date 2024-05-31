import './WebSockets.css'
import { useEffect, useRef, useState } from 'react'

interface IMessage {
    id: string | number
    message: string
    event: string
    username: string
}

const WebSockets = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState('')
    const socket = useRef<null | WebSocket>(null)
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            console.log('it has been connected')
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current?.send(JSON.stringify(message))
        }

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message)
            setMessages(prevState => [message, ...prevState])
        }

        socket.current.onclose = () => {
            console.log('socket has been opened')
        }

        socket.current.onerror = () => {

        }
    }

    const sendMessage = async () => {
        const message = {
            event: 'message',
            username,
            id: Date.now(),
            message: value
        }
        socket.current?.send(JSON.stringify(message))
        setValue('')
    }

    const handleEnter = (e: KeyboardEvent) => {
        if (e.code === "NumpadEnter") {
            sendMessage()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEnter)
        return () => {
            document.removeEventListener('keydown', handleEnter)
        }
    }, [value])

    if (!connected) {
        return (
            <div>
                <div>
                    <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Введите ваше имя"/>
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }

    return (
        <div className="WebSockets">
            <div className="WebSockets__Form">
                <input className="WebSockets__Input" value={value} type="text" onChange={e => setValue(e.target.value)}/>
                <button className="WebSockets__Button" onClick={sendMessage}>Отправить</button>
            </div>
            <div className="WebSockets__Messages">
                {messages.map(mess =>
                    <div className="WebSockets__Message" key={mess.id}>
                        {mess.event === 'connection'
                            ? `Пользователь ${mess.username} подключился`
                            : mess.message
                        }
                    </div>
                )}
            </div>
            {username && `Вы подключились под никнеймом ${username}`}
        </div>
    )
}

export default WebSockets
