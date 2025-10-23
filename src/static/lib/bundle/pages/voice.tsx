import React from "react";
import Page from "../../../../react/page";
import styles from "../../../styles/voice.module.css";

// Type declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly length: number;
}

interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
}

interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    lang: string;
    start(): void;
    stop(): void;
    addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
    addEventListener(type: string, listener: EventListener): void;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

export default class Test extends Page {

    componentDidMount() {
        const startStopButton = document.getElementById('startButton') as HTMLButtonElement;
        const clearButton = document.getElementById('clear') as HTMLButtonElement;
        const output = document.getElementById('output') as HTMLDivElement;
        const language = document.getElementById('language') as HTMLSelectElement;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language.value;
        let listening = false;

        startStopButton.addEventListener('click', () => {
            if (listening)
                recognition.stop();
            else
                recognition.start();
        });

        clearButton.addEventListener('click', () => {
            output.textContent = '';
        });

        recognition.addEventListener('result', (e: SpeechRecognitionEvent) => {
            const text = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            output.textContent += text;
        });

        language.addEventListener('change', () => {
            recognition.lang = language.value;
            console.log('Language has been changed to: ' + language.value);
        });
    }

    render() {
        return super.render(<div className={styles.container}>
            <button id="startButton" className={styles.bso}>Start Stop Voice Input</button>
            <button id="clear" className={styles.bso}>Clear</button>
            <select id="language">
                <option className={styles.bso} value="en-US">English</option>
                <option className={styles.bso} value="fr-FR">French</option>
            </select>
            <div id="output" className={styles.output} contentEditable="true">Hello</div>
        </div>
        );
    }
}