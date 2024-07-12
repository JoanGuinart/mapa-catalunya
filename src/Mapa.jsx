import React, { useState, useEffect, useRef } from 'react'
import mapaImage from './svgs/mapa.svg'
import trashIcon from './svgs/trash.svg'
import Pin from './Pin'
import { convertircoordenades } from './utils'

const Mapa = () => {
	const coordenadesCiudades = {
		Barcelona: { lat: 41.3851, lng: 2.1734 },
		Girona: { lat: 41.9793, lng: 2.8198 },
		Lleida: { lat: 41.6176, lng: 0.62 },
		Tarragona: { lat: 41.1189, lng: 1.2445 },
		Deltebre: { lat: 40.572075, lng: 0.658539 },
		Sant_Quirze_del_Vallès: { lat: 41.535, lng: 2.0833 },
		Andorra: { lat: 42.5078, lng: 1.5211 },
	}

	const mapWidth = 740 // Ancho del mapa en píxeles
	const mapHeight = 796 // Alto del mapa en píxeles

	const [pins, setPins] = useState(() => {
		const savedPins = localStorage.getItem('pins')
		return savedPins ? JSON.parse(savedPins) : []
	})
	const [newPinName, setNewPinName] = useState('')
	const [isTrashHovered, setIsTrashHovered] = useState(false)
	const [selectedPinId, setSelectedPinId] = useState(null)

	const buttonRef = useRef(null)

	useEffect(() => {
		localStorage.setItem('pins', JSON.stringify(pins))
	}, [pins])

	useEffect(() => {
		const initialPins = Object.keys(coordenadesCiudades).map((ciudad) => {
			const { lat, lng } = coordenadesCiudades[ciudad]
			const { x, y } = convertircoordenades(lat, lng)
			return { id: ciudad, name: ciudad, x, y }
		})

		setPins(initialPins)
	}, [])

	const addPin = (name, initialX, initialY) => {
		setPins([...pins, { id: Date.now(), name, x: initialX, y: initialY }])
		setNewPinName('')
	}

	const updatePinPosition = (id, newPosition) => {
		setPins(
			pins.map((pin) => (pin.id === id ? { ...pin, ...newPosition } : pin))
		)
	}

	const deletePin = (id) => {
		setPins(pins.filter((pin) => pin.id !== id))
	}

	const handleFormSubmit = (event) => {
		event.preventDefault()
		if (newPinName.trim()) {
			const buttonRect = buttonRef.current.getBoundingClientRect()
			const initialX = buttonRect.left + 100
			const initialY = buttonRect.top + buttonRect.height / 2
			addPin(newPinName, initialX, initialY)
		}
	}

	const handleDrop = (event) => {
		event.preventDefault()
		const data = JSON.parse(event.dataTransfer.getData('application/json'))
		const { id, offsetX, offsetY } = data
		const newPosition = {
			x: event.clientX - offsetX,
			y: event.clientY - offsetY,
		}
		updatePinPosition(id, newPosition)

		const trashIconRect =
			event.currentTarget.lastElementChild.getBoundingClientRect()
		if (
			newPosition.x >= trashIconRect.left &&
			newPosition.x <= trashIconRect.right &&
			newPosition.y >= trashIconRect.top &&
			newPosition.y <= trashIconRect.bottom
		) {
			deletePin(id)
		}
	}

	const handleTrashMouseEnter = () => {
		setIsTrashHovered(true)
	}

	const handleTrashMouseLeave = () => {
		setIsTrashHovered(false)
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{ flex: '1' }}>
				<h1>Mapa de Catalunya</h1>
				<form onSubmit={handleFormSubmit} style={{ marginBottom: '10px' }}>
					<input
						type='text'
						value={newPinName}
						onChange={(e) => setNewPinName(e.target.value)}
						placeholder='Nombre del pin'
					/>
					<button ref={buttonRef} type='submit'>
						Crear Pin
					</button>
				</form>
				<div
					onDrop={handleDrop}
					onDragOver={(e) => e.preventDefault()}
					style={{
						position: 'relative',
						width: '740px',
						height: '796px',
						backgroundImage: `url(${mapaImage})`,
						backgroundSize: 'cover',
					}}
				>
					{pins.map((pin) => (
						<Pin
							key={pin.id}
							id={pin.id}
							name={pin.name}
							initialX={pin.x}
							initialY={pin.y}
							onPositionChange={updatePinPosition}
							onDelete={deletePin}
							isSelected={pin.id === selectedPinId}
						/>
					))}
					<div
						onMouseEnter={handleTrashMouseEnter}
						onMouseLeave={handleTrashMouseLeave}
						style={{
							position: 'absolute',
							bottom: '20px',
							right: '20px',
							width: '50px',
							height: '50px',
							background: `url(${trashIcon}) no-repeat center center`,
							backgroundSize: 'contain',
							cursor: 'pointer',
							transform: isTrashHovered ? 'scale(1.1)' : 'scale(1)',
							transition: 'transform 0.2s ease',
						}}
					/>
				</div>
			</div>
			<div style={{ flex: '1', paddingLeft: '20px' }}>
				<h2>Pins:</h2>
				<ul style={{ listStyleType: 'none', padding: 0 }}>
					{pins.map((pin) => (
						<li
							key={pin.id}
							style={{
								cursor: 'pointer',
								marginBottom: '5px',
								color: selectedPinId === pin.id ? 'blue' : 'black',
							}}
							onClick={() => setSelectedPinId(pin.id)}
						>
							{pin.name}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Mapa
