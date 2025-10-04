// ConfirmModal.jsx
import React from 'react';
import './Modal.css';

export function ConfirmModal({ message, onConfirm, onCancel }) {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<p>{message}</p>
				<div className="modal-buttons">
					<button
						className="confirm-btn"
						onClick={onConfirm}
					>
						Confirm
					</button>
					<button className="cancel-btn" onClick={onCancel}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
