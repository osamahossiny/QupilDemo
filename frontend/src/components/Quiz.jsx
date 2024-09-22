import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import useSpeachRecognition from '../hooks/useSpeachRecognition';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { HiSpeakerphone } from "react-icons/hi";
import NoData from './NoData';

const Quiz = () => {
    const [quiz, setQuiz] = useState(null)
    const { quizId } = useParams()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const {text, isListening, startListening, stopListening, toggleListening, hasRecognition} = useSpeachRecognition();

    useEffect(()=>{
        if (!quiz && !error && !loading) {            
            setLoading(true)
            fetch(`/api/quiz/getQuiz/${quizId}`,{method:"GET", credentials:'include'})
            .then(async (res)=>{
                if (res.ok) {                    
                    res.json().then((data) => {
                        console.log(data);
                        setQuiz(data)
                        setLoading(false)
                    })
                }
                else {
                    console.log(res);
                    let data = await res.json()
                    console.log(data);
                    setLoading(false);
                    setError("Server error")
                }
            }).catch((error)=>{
                console.log(error);
                setError("Server error")
                setLoading(false)
            })
        }
    })

    const [counter, setCounter] = useState(0); // Set the countdown time in seconds
    const [questionId, setQuestionId] = useState('');
    const synth = window.speechSynthesis;

    const [answers, setAnswers] = useState(null);

    useEffect(() => {
        if (quiz){
            if (counter == 0) {                
                setCounter(quiz.duration * 60)
                return
            }
            if (answers == null) {
                setAnswers(quiz.questions.map((question) => ({questionId:question._id, answered: false, isWrong: false })))
            }
            
            const interval = setInterval(() => {
                setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
            }, 1000);
            return () => clearInterval(interval); // Cleanup on component unmount
        }

    }, [quiz]);

    // Format the countdown in MM:SS format
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleMic = (qi) => {
        toggleListening();
        setQuestionId(qi);
        submitAnswer(qi, false, false)
    };

    const handleReadAloud = (questionText) => {
        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.lang = 'ar-AE'
        synth.speak(utterance);
    };

    const submitAnswer = (questionId, isCorrect, isWrong) => {
        setAnswers((prevAnswers) =>
            prevAnswers.map((answer, index) =>
                answer.questionId.toString() === questionId
                    ? {questionId, answered: isCorrect, isWrong }
                    : answer
            )
        );
    };

    useEffect(() => {
        if (text == ''|| questionId == null) return;
        let seg = text.split(' ')
        seg = seg[0].replace('?','').replace('؟','').replace(':','').replace("'ّ",'').replace(',','').replace('!','').replace('.','').replace('.','').replace('،','');
        // if (seg == (quiz.questions.find(q=>q._id.toString() == question).segment)) {            
        //     submitAnswer(question, true, false)
        // } else {
        //     submitAnswer(question, false, true)
        // }
        console.log(seg);
        console.log({
            quizId: quiz._id,
            questionId: questionId
          });
        
        
        fetch("/api/quiz/asnwerQuestion", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quizId: quiz._id,
              questionId: questionId,
              answer: text
            }),
            credentials: "include"
          }).then( async (res)=> {
              if (res.ok){                
                submitAnswer(questionId, true, false)
              }
              else {
                submitAnswer(questionId, false, true)
              }
          }).catch((error)=>{
              console.log(error);
              setError("Sever error")
              setQuestionId(null)
        });
    },[text])

    return (
        quiz && answers?
        <div className="min-h-screen bg-gray-100 p-8 relative">
            {/* Countdown timer in the top-right corner */}
            <div className="absolute top-4 right-4 bg-white text-gray-700 rounded-lg shadow p-4">
                <p className="text-lg font-semibold">Time Left: {formatTime(counter)}</p>
            </div>

            <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>

            <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                    <div key={question._id} className="bg-white rounded-lg shadow p-6 relative">
                        {/* Answered status radio at the top-right */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                            <p className="text-sm text-gray-600">{answers[index].answered? "Answered":"Not answered"}</p>
                            <input
                                type="radio"
                                disabled
                                checked={answers[index].answered} // assuming each question has an `answered` property
                                className="h-5 w-5 text-blue-500"
                            />
                        </div>

                        {/* Question text */}
                        <h2 className="text-xl mt-4 font-semibold text-gray-800 mb-4">
                            {index + 1}. {question.question}
                        </h2>
                        
                        <h2 className="text-xl text-right font-semibold text-gray-800 mb-4">
                            {question.line}
                        </h2>
                        <h2 className="text-xl text-center font-semibold text-blue-800 mb-10">
                            {question.segment}
                        </h2>
                        {answers[index].isWrong && (
                            <p className="text-red-500 mb-10 text-sm">Incorrect answer. Please try again.</p>
                        )}
                        {error && (
                            <p className="text-red-500 mb-10 text-sm">{error}</p>
                        )}
                        {/* Buttons for microphone and reading aloud at the bottom-right */}
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                            {/* Button to activate microphone */}
                            {!answers[index].answered &&
                                // <button
                                //     onClick={() => handleMic(question._id)}
                                //     className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors"
                                // >
                                //     🎤 Mic
                                // </button>
                                <button
                                    onClick={() => handleMic(question._id)}
                                    disabled={isListening && questionId && (questionId.toString() != question._id.toString())}
                                    className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-300 shadow-lg ${
                                        (isListening && questionId && (questionId.toString() == question._id.toString())) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                >
                                    {(isListening && questionId && (questionId.toString() == question._id.toString())) ? (
                                        <FaStop className="text-white text-2xl" /> // Stop icon
                                    ) : (
                                        <FaMicrophone className="text-white text-2xl" /> // Microphone icon
                                    )}
                                </button>
                            }

                            {/* Button to read the question aloud */}
                            <button
                                onClick={() => handleReadAloud(question.segment)}
                                className="bg-blue-500 flex items-center justify-center w-16 h-16 rounded-full duration-300 shadow-lg text-white py-1 px-3 hover:bg-blue-600 transition-colors"
                            >
                                <HiSpeakerphone className="text-white text-2xl" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        :
        error?
        <div className="text-center text-gray-500">{error}</div>
        :
        loading?
        <Loading/>
        :
        // <div className="text-center text-gray-500">The quiz is not available at the moment.</div>
        <NoData/>
    );
};

export default Quiz;
