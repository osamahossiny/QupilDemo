import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Loading from './Loading';
import NoData from './NoData';

const QuizHistory = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    // Fetch user enrolled quizzes from the API
    useEffect(() => {
        const fetchEnrolledQuizzes = () => {
            try {
                setLoading(true)
                fetch('/api/user/getMyQuizzes',{
                    method:"GET",
                    credentials:'include'
                })
                .then((res)=>{
                    if (res.ok) {
                        res.json().then((data)=>{
                            console.log(data);
                            
                            setQuizzes(data);
                            setLoading(false)
                        })
                    }
                    else {
                        setLoading(false)
                        setError("Server error")
                    }
                }).catch((error) => {
                    setLoading(false)
                    setError("Server error")
                });
            } catch (error) {
                console.error('Error fetching enrolled quizzes:', error);
                setLoading(false)
                setError("Server error")
            }
        };
        if (quizzes.length == 0 && !error && !loading) {
            fetchEnrolledQuizzes();
        }
    }, []);

    return (
        (quizzes.length > 0)?
        <div className="container mx-auto p-4">
            <h1 className="text-2xl text-center font-bold mb-4">Enrolled Quizzes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz._id} quiz={quiz} />
                ))}
            </div>
        </div>
        :
        loading?
        <Loading/>
        :
        error?
        <div className="text-center text-gray-500">{error}</div>
        :
        // <div className="text-center text-gray-500">{"You don't have quiz history at the moment."}</div>
        <NoData/>
    );
};

const QuizCard = ({ quiz }) => {
    const { quizId, title, startTime, stopTime, answered, grade, maxGrade, level, passed, status } = quiz;

    const getLevelPercentage = (level) => {
        switch (level) {
            case 'beginner':
                return 33;
            case 'intermediate':
                return 66;
            case 'advanced':
                return 100;
            default:
                return 0;
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">{quizId.title}</h2>

            {/* Level Representation */}
            <div className="mb-4">
                <p className="text-xl font-bold mb-2">{title}</p>

                <p className="text-lg font-bold mb-2">Level: {level.charAt(0).toUpperCase() + level.slice(1)}</p>
                <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                        className={`bg-green-500 h-full text-white text-sm font-medium text-center leading-6 rounded-full`}
                        style={{ width: `${getLevelPercentage(level)}%` }}
                    >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </div>
                </div>
            </div>

            {/* Quiz Information */}
            <p className="text-gray-700 mb-2">
                <strong>Status:</strong> {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
            <p className="text-gray-700 mb-2">
                <strong>Start Time:</strong>{' '}
                {startTime ? format(new Date(startTime), 'PPpp') : 'Not Started'}
            </p>
            <p className="text-gray-700 mb-2">
                <strong>Stop Time:</strong>{' '}
                {stopTime ? format(new Date(stopTime), 'PPpp') : 'Not Stopped'}
            </p>
            <p className="text-gray-700 mb-2">
                <strong>Grade:</strong> {grade} / {maxGrade}
            </p>
            <p className="text-gray-700 mb-2">
                <strong>Passed:</strong>{' '}
                {passed ? (
                    <span className="text-green-500">Yes</span>
                ) : (
                    <span className="text-red-500">No</span>
                )}
            </p>
            <p className="text-gray-700">
                <strong>Answered Questions:</strong> {answered.length}
            </p>
        </div>
    );
};
export default QuizHistory;
