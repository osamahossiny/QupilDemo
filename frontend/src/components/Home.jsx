import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    // if (!quizzes || quizzes.length === 0) {
    //     return <div className="text-center text-gray-500">No quizzes available at the moment.</div>;
    // }
    const navigate = useNavigate()
    const [quizzes, setQuizzes] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        if (!quizzes && !error && !loading) {            
            setLoading(true)
            fetch('/api/quiz/getallquizzes',{method:"GET", credentials:'include'})
            .then(async (res)=>{
                if (res.ok) {                    
                    res.json().then((data) => {
                        console.log(data);
                        
                        setQuizzes(data)
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
    

    const onStartQuiz = (quizId, event) => {
        console.log(`Starting quiz with ID: ${quizId}`);
        document.getElementById("start-button").disabled = true;
        fetch('/api/quiz/startquiz',{
            method:"Post",
            body:JSON.stringify({quizId}),
            headers: {
                'Content-Type': 'application/json',
              },
            credentials:'include'})
            .then(async (res)=>{
                if (res.ok) {                    
                    navigate(`/quiz/${quizId}`)
                }
                else {
                    res.json().then(data=>{
                        console.log(data);  
                        document.getElementById("start-button").disabled = false;
                    })
                }
            }).catch((error)=>{
                document.getElementById("start-button").disabled = false;
                console.log(error);
            })
        // Navigate to quiz or start quiz logic here
    };
    const getExpertiseLevelWidth = (expertise) => {
        switch (expertise.toLowerCase()) {
            case 'beginner':
                return 'w-1/3 bg-green-400';
            case 'intermediate':
                return 'w-2/3 bg-yellow-400';
            case 'advanced':
                return 'w-full bg-red-400';
            default:
                return 'w-1/3 bg-gray-400';
        }
    };

    return (
        quizzes?
        <div className="max-w-5xl mx-auto p-6 bg-gray-50">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Available Quizzes</h1>

            {/* Quizzes Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {quizzes.map(quiz => (
                    <div 
                        key={quiz._id} 
                        className="relative flex flex-col justify-between p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                    >
                        {/* Expertise Level Bar (Fixed at the Top) */}
                        <div className="mb-4">
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Expertise Level:</span> {quiz.expertise}
                            </p>
                            <div className="relative w-full h-3 bg-gray-200 rounded-full">
                                <div className={`absolute h-3 rounded-full ${getExpertiseLevelWidth(quiz.expertiseLevel)}`}></div>
                            </div>
                        </div>

                        {/* Quiz Title */}
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{quiz.title}</h2>

                        {/* Quiz Duration (Fixed to Bottom Right) */}
                        <div className="absolute bottom-20 right-6 text-gray-600">
                            <span className="font-semibold">Duration:</span> {quiz.duration} minutes
                        </div>

                        {/* Start Quiz Button (Positioned at the bottom) */}
                        <div className="mt-auto">
                            <button 
                                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                onClick={(event) => onStartQuiz(quiz._id,event)}
                                id='start-button'
                            >
                                Start Quiz
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
        <div className="text-center text-gray-500">No quizzes available at the moment.</div>
    );
};

export default Home;
