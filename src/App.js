import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Registration from './components/Registration/Registration';
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
			imageUrl: '',
			box: {},
			route: 'signin',
		};
	}

	calculateFaceLocation = data => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height,
		};
	};

	displayFaceBox = box => {
		console.log('box obj ', box);
		this.setState({ box: box });
	};

	onInputChange = event => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = event => {
		this.setState({ imageUrl: this.state.input });

		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
			.catch(err => console.log(err));
	};

	onRouteChange = route => {
		this.setState({ route: route });
	};

	render() {
		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />
				<Navigation onRouteChange={this.onRouteChange} />
				{this.state.route === 'home' ? (
					<div>
						<Logo />
						<Rank />
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
					</div>
				) : this.state.route === 'signin' ? (
					<Signin onRouteChange={this.onRouteChange} />
				) : (
					<Registration onRouteChange={this.onRouteChange} />
				)}
			</div>
		);
	}
}

export default App;
