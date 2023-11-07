"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import client from '../API/api';
import Navbar from '../Components/Navbar';

const Page = () => {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    
    useEffect(() => {
        if(!localStorage.getItem("access_token")) {
            router.push("/")
        } else {
            client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")
            router.refresh()
        }
    }, [])

    useEffect(() => {
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")   

        client.get('questions/').then((response) => {
            setQuestions(response.data)
        })
    }, [])

    async function questionRedirect(question_id) {
        router.push("/Question/?question_id=" + question_id)
    }

    return (
        <div>
            <Navbar />
            <div>
                {questions.map((question, index) => {
                    console.log(question)
                    return(
                        <div className='flex justify-center w-full px-20' key={index}>
                            <div className="w-full rounded overflow-hidden shadow-lg m-4" key={index} onClick={()=> {questionRedirect(question.id)}} >
                                <div className="px-6 py-4">
                                    <p className="text-gray-700 text-base text-center cursor-pointer">
                                        {question.question_text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Page;