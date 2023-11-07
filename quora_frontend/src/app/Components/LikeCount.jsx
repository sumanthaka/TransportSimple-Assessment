import React, { useState, useEffect } from "react"
import client from "../API/api"
import { useRouter } from "next/navigation"
import like from '@/assets/like.png'
import Image from "next/image"

const LikeCount = ({ answer_id }) => {

    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        getLikeCount(answer_id)
    }, [])

    const getLikeCount = (answer_id) => {
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('access_token')
        client.get("/likes/count/?answer_id="+answer_id, {headers: {"Content-Type": "application/json"}})
        .then((response) => {
            setLikeCount(response.data.likes)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <div className="flex"><Image src={like} className="w-5 mr-1"/> <p>Count: {likeCount}</p></div>
        </div>
    )
}

export default LikeCount