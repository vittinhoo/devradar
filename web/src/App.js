import React, { useState, useEffect } from 'react';
import api from './services/api';

import { PulseLoader } from "react-spinners";

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

// Fundamentos do ReactJS:
// Componente Ex: App(), função que retorna um conteudo HTML
// Propriedade: Informações que um componente PAI passa para o componente FILHO
// Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)
// Imutabilidade é criar um novo estado e não atualiza-lo

function App() {
	const
		[devs, setDevs] = useState([]), 
		[github_username, setGithubUsername] = useState(''),
		[techs, setTechs] = useState(''),
		[latitude, setLatitude] = useState(''),
		[longitude, setLongitude] = useState(''),
		[buttonLoading, setbuttonLoading] = useState(false),
		[buttonMessage, setbuttonMessage] = useState('Salvar');

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;

				setLatitude(latitude);
				setLongitude(longitude);
			},
			(err) => { console.log(err); },
			{ timeout: 30000, }
		);
	}, []);

	useEffect(() => {
		async function loadDevs() {
			const response = await api.get('/devs');

			setDevs(response.data);
		};	

		loadDevs();
	}, [devs]);

	async function handleAddDev(e) {
		e.preventDefault();
		setbuttonLoading(true);
		setbuttonMessage('');

		const response = await api.post('/devs', {
			github_username,
			techs,
			latitude,
			longitude
		});

		setGithubUsername('');
		setTechs('');
		setbuttonLoading(false);
		setbuttonMessage('Salvar');

		setDevs([...devs, response.data]);
	}

	async function handleDeleteDev(_id) {
		await api.delete('/devs', { data: { _id } });

		return devs.filter((elem) => {
			return elem._id !== _id;
		});
	}

	return (
		<div id="app">
			<aside>
				<strong>Cadastrar</strong>
				<form onSubmit={handleAddDev}>
					<div className="input-block">
						<label htmlFor="github_username">Usuário do GitHub</label>
						<input 
							name="github_username" 
							id="github_username" 
							required
							value={github_username}
							onChange={e => setGithubUsername(e.target.value)}
						/>
					</div>

					<div className="input-block">
						<label htmlFor="tech">Tecnologias</label>
						<input 
							name="techs" 
							id="techs" 
							required
							value={techs}
							onChange={e => setTechs(e.target.value)}
						/>
					</div>

					<div className="input-group">
						<div className="input-block">
							<label htmlFor="latitude">Latitude</label>
							<input 
								type="number" 
								name="latitude" 
								id="latitude" 
								required 
								value={latitude}
								onChange={e => setLatitude(e.target.value)}
							/>
						</div>

						<div className="input-block">
							<label htmlFor="longitude">Longitude</label>
							<input 
								type="number" 
								name="longitude" 
								id="longitude" 
								required 
								value={longitude}
								onChange={e => setLongitude(e.target.value)}
							/>
						</div>
					</div>

					<button type="submit">
						<PulseLoader 
							className="loading-icon" 
							loading={buttonLoading}
							color={"#FFF"}
							size={10}
						/>
						{buttonMessage}
					</button>
				</form>
			</aside>

			<main>
				<ul>
					{devs.map(dev => (
						<li key={dev._id} className="dev-item">
							<span className="dev-item__remove" onClick={() => handleDeleteDev(dev._id)}>X</span>
							<header>
								<img src={dev.avatar_url} alt={dev.name}/>
								<div className="user-info">
									<strong>{dev.name}</strong>
									<span>{dev.techs.join(', ')}</span>
								</div>
							</header>
							<p>{dev.bio}</p>
							<a href={`https://github.com/${dev.github_username}`} target="_blank" rel="noopener noreferrer">Acessar perfil no GitHub</a>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}

export default App;