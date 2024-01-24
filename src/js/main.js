import manipuleElements from './manipuleElements.js';
import * as domManipulations from './domManipulations.js';

manipuleElements.exportData();

document.addEventListener("keydown", domManipulations.handleKeyPress);
document.querySelector("#toggleStart").addEventListener('click', domManipulations.handleToggleStartClick);
document.querySelector("#btnResults").addEventListener('click', domManipulations.handleBtnResultsClick);
document.querySelector("#btnConfig").addEventListener('click', domManipulations.handleBtnConfigClick);
document.querySelector('#sendConfigTime').addEventListener('click', domManipulations.handleSendConfigTimeClick);
document.querySelector("#clearResults").addEventListener('click', domManipulations.handleClearResultsClick);