"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import client from '../API/api';
import Like from '@/app/Components/Like'
import Navbar from '../Components/Navbar';
import LikeCount from '../Components/LikeCount';

const Page = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [question_id, setQuestionId ] = useState(searchParams.get("question_id"))
    const [question, setQuestion] = useState({})
    const [answers, setAnswers] = useState([])
    // const [liked, setLiked] = useState(false)
    const [answered, setAnswered] = useState(false)
    const [likedStatus, setLikedStatus] = useState([]);


    useEffect(() => {
        if(!localStorage.getItem("access_token")) {
            router.push("/")
        }
        checkAnswered(question_id)
    }, [])

    useEffect(() => {
        if(question_id) {
            client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")   

            client.get('questions/' + question_id).then((response) => {
                setQuestion(response.data)
            })
        }
    }, [question_id])

    const getQuestions = async () => {
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")   

        await client.get('answers/get_answers_by_question/?question_id=' + question_id).then((response) => {
            setAnswers(response.data)
        })
    }

    useEffect(() => {
        if(question_id) {
            getQuestions()
        }
    }, [question_id, answered, likedStatus])


    async function checkLike(answer_id) {
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")
        const response = await client.get('likes/check_like/?answer_id=' + answer_id)
        console.log(response.data.liked)
        return response.data.liked
    }

    async function submitAnswer(event) {
        event.preventDefault()
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")
        const response = await client.post('answers/', {
            answer_text: event.target[0].value,
            question: question_id,
        })
        setAnswered(true)
    }

    async function checkAnswered(question_id) {
        client.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem("access_token")
        const response = await client.get('answers/check_answered/?question_id=' + question_id)
        setAnswered(response.data.answered)
    }

    useEffect(() => {
        // Fetch liked status for all answers
        const fetchLikedStatusForAnswers = async () => {
            const likedStatusArray = await Promise.all(
                answers.map(async (answer) => {
                    const liked = await checkLike(answer.id);
                    return liked;
                })
            );
            
            // Update liked status for each answer
            setLikedStatus(likedStatusArray);
        };

        if (answers.length > 0) {
            fetchLikedStatusForAnswers();
        }
    }, [answers]);

    const refreshPage = () => {
        router.refresh();
        router.push('/Question/?question_id=' + question_id);
      };

    return (
        <>
            <Navbar />
            <div className='flex justify-center'>
                <div className='w-full h-full'>
                    <div className='flex justify-center'>
                        <p className='mt-4'>{question.question_text}</p>
                    </div>
                    <div>
                        {answered ? <div></div> : 
                        <form onSubmit={submitAnswer}>
                            <div className='flex justify-center mx-10'>
                                <textarea className="mt-4 border-2 p-2 w-full rounded-md" placeholder="Answer" />
                            </div>
                            <div className='flex justify-center mt-2'>
                                <button type='submit' className="border-2 p-2 border-red-500 text-white bg-red-600 rounded-md">Submit</button>
                            </div>
                        </form>}
                    </div>
                    <div className='border-2 px-6 py-2 m-2'>
                        {answers.map((answer, index) => {
                            return (
                                <div key={answer.id} className='border-y-2'>
                                    {answer.answer_text}
                                    <p>{likedStatus[index] ? <LikeCount answer_id={answer.id} /> : <Like answer_id={answer.id} question_id={question_id} onClick={refreshPage} />}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page