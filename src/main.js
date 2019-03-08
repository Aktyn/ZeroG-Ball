import './styles/main.css';
import Core from './game/core';

if(document.body)
	Core.init();
else
	window.addEventListener('load', Core.init, true);