import './LongPulling.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface IMessage {
    id: string | number
    message: string
}

const LongPulling = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState('')

    useEffect(() => {
        void subscribe()
    }, [])

    const subscribe = async () => {
        try {
            const {data} = await axios.get('http://localhost:5000/get-message')
            setMessages(prev => [data, ...prev])
            await subscribe()
        } catch (e) {
            setTimeout(() => {
                subscribe()
            }, 500)
            console.error(e)
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
        <div className="LongPulling">
            <div className="LongPulling__Form">
                <input className="LongPulling__Input" value={value} type="text" onChange={e => setValue(e.target.value)}/>
                <button className="LongPulling__Button" onClick={sendMessage}>Отправить</button>
            </div>
            <div className="LongPulling__Messages">
                {messages.map(mess =>
                    <div className="LongPulling__Message" key={mess.id}>{mess.message}</div>
                )}
            </div>
        </div>
    )
}

export default LongPulling
