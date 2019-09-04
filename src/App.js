import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
	apiKey: 'a914c2f952264f0fbadd081d6c6a59ab',
});

const particlesOptions = {
	particles: {
		number: {
			value: 90,
			density: {
				enable: true,
				value_area: 800,
			},
		},
	},
	interactivity: {
		events: {
			onhover: {
				enable: true,
				mode: 'repulse',
			},
		},
	},
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: 'https://cdn.onlinewebfonts.com/svg/img_94880.png',
		};
	}

	onInputChange = event => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = event => {
		this.setState({ imageUrl: this.state.input });

		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
			function(response) {
				console.log('response ', response.outputs[0].data.regions[0].region_info.bounding_box);
			},
			function(err) {
				console.log('err ', err);
			},
		);
	};

	render() {
		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />
				<Navigation />
				{/*
        <Logo />
      */}
				<Rank />
				<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
				<FaceRecognition imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
