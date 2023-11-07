import React from "react"
import client from "../API/api"
import { useRouter } from "next/navigation"
import like from '@/assets/like.png'
import Image from "next/image"

const Like = ({ liked, answer_id, onClick }) => {

    const router = useRouter()

    const sendLike = async (answer_id) => {
        console.log("Like sent for answer_id: " + answer_id)
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('access_token')
        await client.post("/likes/", { answer: answer_id }, {headers: {"Content-Type": "application/json"}})
        onClick()
    }

    return (
        <>
            <i
            onClick={() => sendLike(answer_id)}
            style={{ cursor: "pointer" }}
            ><Image src={like} className="w-5" /></i>
        </>
    )
}

export default Like