import {JSDOM} from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html>`);

// Access the document and create elements
const document = dom.window.document;

document.documentElement.lang = 'en';

const charset = document.createElement('meta');
charset.setAttribute('charset', 'utf-8');
document.head.appendChild(charset);

const viewport = document.createElement('meta');
viewport.name = 'viewport';
viewport.content = 'width=device-width, initial-scale=1';

document.head.appendChild(viewport);

const title = document.createElement('title');
title.textContent = 'HTML5 Boilerplate';
document.head.appendChild(title);

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/static/styles/global.css';
document.head.appendChild(link);

const script = document.createElement('script');
script.src = 'scripts.js';
document.body.appendChild(script);

const span = document.createElement('span');
span.id = 'placeholder';
document.body.appendChild(span);

// Output the resulting HTML
console.log(dom.serialize());