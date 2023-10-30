const { text } = require('express');
const Note = require('../models/Note.js');
const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');

// @desc Get Note
// @route GET/note
// @access Private

const getAllNotes = asyncHandler(async (req, res) => {
	const notes = await Note.find().lean();

	//if no notes
	if (!notes.length) {
		return res.status(400).json({ message: 'No notes found' });
	}

	// Add username to each note before sending response
	const noteWithUser = await Promise.all(
		notes.map(async (note) => {
			const user = await User.findById(note.user).lean().exec();
			return { ...note, user: user.username };
		})
	);

	res.json(noteWithUser);
});

// @desc Create new note
// @route Post /note
// @access Private

const createNewNote = asyncHandler(async (req, res) => {
	const { user, title, text } = req.body;

	//Ensure fields are NOT empty
	if (!user || !title || !text) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	// Check for duplicate title
	const duplicate = await Note.findOne({ title }).lean().exec();

	if (duplicate) {
		return res.status(409).json({ message: 'Duplicate note title' });
	}

	// Create and store the new user
	const note = await Note.create({ user, title, text });

	if (note) {
		//Created
		return res.status(201).json({ message: 'New note created' });
	} else {
		return res.status(400).json({ message: 'Invalid note data received' });
	}
});

// @desc Update a note
// @route Patch /note
// @access Private

const updateNote = asyncHandler(async (req, res) => {
	const { id, user, title, text, completed } = req.body;

	//confirm data
	if (!id || !user || !title || !text || typeof completed !== 'boolean') {
		return res.status(400).json({ message: 'All fields are required' });
	}

	// Confirm note exists to update
	const note = await Note.findById(id).exec();
	if (!note) {
		return res.status(400).json({ message: 'Note not found' });
	}

	//Check for duplicate title

	const duplicate = await Note.findOne({ title }).lean().exec();

	//Allow remaining of the original note
	if (duplicate && duplicate._id.toString() !== id) {
		return res.status(409).json({ message: 'Duplicate note title' });
	}
	note.user = user;
	note.title = title;
	note.text = text;
	note.completed = completed;

	const updatedNote = await note.save();

	res.json(`${updatedNote.title} updated`);
});

// @desc Delete a note
// @route DELETE /note
// @access Private

const deleteNote = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: 'Note Id required' });
	}

	const noteToDelete = await Note.findById(id).exec();
	if (!noteToDelete) {
		return res.status(400).json({ message: 'No Notes found' });
	}
});

module.exports = {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
};
