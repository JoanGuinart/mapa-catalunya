import React, { useState } from 'react'
import pinImage from './svgs/pin.svg'

const Pin = ({
	id,
	name,
	initialX,
	initialY,
	onPositionChange,
	onDelete,
	isSelected,
}) => {
	const [position, setPosition] = useState({ x: initialX, y: initialY })
	const [isEditing, setIsEditing] = useState(false)
	const [newName, setNewName] = useState(name)
	const [dragging, setDragging] = useState(false)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

	const handleDragStart = (event) => {
		const offsetX = event.clientX - position.x
		const offsetY = event.clientY - position.y
		event.dataTransfer.setData(
			'application/json',
			JSON.stringify({ id, offsetX, offsetY })
		)
		setDragOffset({ x: offsetX, y: offsetY })
		setDragging(true)
	}

	const handleDrag = (event) => {
		if (dragging) {
			const newPosition = {
				x: event.clientX - dragOffset.x,
				y: event.clientY - dragOffset.y,
			}
			setPosition(newPosition)
		}
	}

	const handleDragEnd = () => {
		onPositionChange(id, position)
		setDragging(false)
	}

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleSave = () => {
		if (newName.trim()) {
			setIsEditing(false)
			onPositionChange(id, { ...position, name: newName })
		}
	}

	const handleDelete = () => {
		onDelete(id)
	}

	return (
		<div
			draggable
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}
			style={{
				position: 'absolute',
				left: `${position.x}px`,
				top: `${position.y}px`,
				cursor: 'move',
				zIndex: dragging ? 2 : 1,
				backgroundColor: isSelected ? 'yellow' : 'transparent',
			}}
		>
			<img src={pinImage} alt='Pin' />
			{isEditing ? (
				<input
					type='text'
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					onBlur={handleSave}
				/>
			) : (
				<div
					style={{ textAlign: 'center', marginTop: '-10px', fontSize: '12px' }}
				>
					{name}
				</div>
			)}
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<button
					onClick={handleEdit}
					style={{
						display: isEditing ? 'none' : 'flex',
						paddingInline: '2px',
						margin: '0px',
						border: '1px solid black',
						backgroundColor: 'white',
					}}
				>
					<p style={{ fontSize: '5px' }}>Editar</p>
				</button>
				<button
					onClick={handleDelete}
					style={{
						display: isEditing ? 'none' : 'flex',
						paddingInline: '2px',
						margin: '0px',
						border: '1px solid black',
						backgroundColor: 'white',
					}}
				>
					<p style={{ fontSize: '5px' }}>eliminar</p>
				</button>
			</div>
		</div>
	)
}

export default Pin
