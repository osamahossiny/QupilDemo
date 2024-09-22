import { useEffect, useState } from "react";

let recogition = null;

if ('webkitSpeechRecognition' in window) {
    recogition =  new webkitSpeechRecognition();
    recogition.continuous = true;
    recogition.lang = 'ar-AE';
}

const useSpeachRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(()=>{
        if (!recogition) return;
        recogition.onresult = (event) =>{
            setText(event.results[0][0].transcript);
            console.log(event.results[0][0].transcript);
            stopListening()
        }
    });
    const startListening = () => {
        console.log("mic on");
        setText('');
        setIsListening(true);
        recogition.start();
    };
    const stopListening = () => {
        console.log("mic off");
        setIsListening(false);
        recogition.stop();
        recogition =  new webkitSpeechRecognition();
        recogition.continuous = true;
        recogition.lang = 'ar-AE';
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening()
        }
        else {
            startListening()
        }
    }

    return {
        text,
        isListening,
        startListening,
        stopListening,
        toggleListening,
        hasRecognition: !! recogition
    }
    
}

export default useSpeachRecognition;