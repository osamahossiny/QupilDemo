import React from 'react';
import useSpeachRecognition from '../hooks/useSpeachRecognition';

function Main(props) {
    const {text, isListening, startListening, stopListening, hasRecognition} = useSpeachRecognition();
    
    return (
        <div>
            {hasRecognition ? (
                <div>
                    <button onClick={startListening}>Start listening</button>
                    {isListening? (
                        <div>Your browser is recording your voice</div>
                    ):null}
                    {text}
                </div>
            ):(
                <h1>Your browser has no support</h1>
            )}
        </div>
    );
}

export default Main;