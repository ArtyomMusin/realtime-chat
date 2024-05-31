import './EventSource.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface IMessage {
    id: string | number
    message: string
}

interface IEvent {
    data: string
}

const EventSource = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState('')

    useEffect(() => {
        void subscribe()
    }, [])

    const subscribe = async() => {
        const eventSource = new EventSource('http://localhost:5000/connect')
        eventSource.onmessage = (event: IEvent) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
    }

    useEffect(() => {
        console.log(messages)
    }, [messages])

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-message', {
            message: value,
            id: Date.now()
        })
    }

    return (
        <div className="EventSource">
            <div className="EventSource__Form">
                <input className="EventSource__Input" value={value} type="text" onChange={e => setValue(e.target.value)}/>
                <button className="EventSource__Button" onClick={sendMessage}>Отправить</button>
            </div>
            <div className="EventSource__Messages">
                {messages.map(mess =>
                    <div className="EventSource__Message" key={mess.id}>{mess.message}</div>
                )}
            </div>
        </div>
    )
}

export default EventSource
