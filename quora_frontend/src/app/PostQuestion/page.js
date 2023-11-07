"use client"
import React, { useEffect } from "react";
import Navbar from "../Components/Navbar";
import client from "../API/api";
import { useRouter } from "next/navigation";


const Page = () => {
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem('access_token')) {
            window.location.href = "/login";
        }
    }, [])

    const postQuestion = async (e) => {
        e.preventDefault();
        const question = e.target[0].value;
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")
        await client.post("/questions/", { question_text: question })
        router.push("/Blog")
    }

    return (
        <>
            <Navbar />
            <div className="">
                <form onSubmit={postQuestion}>
                    <textarea className="w-full h-64 border-2 border-gray-300 p-2 rounded-md" placeholder="What is your question or link?" />
                    <div className="flex justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Post</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Page;