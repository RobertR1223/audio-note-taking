import { render, screen, fireEvent } from '@testing-library/react';
import NoteList from './NoteList';

// Mocked NoteItem component since it's being imported
jest.mock('./NoteItem', () => ({ note, onEdit, onDelete }) => (
    <li>
        <span>{note.content}</span>
        <button onClick={() => onEdit(note.id)}>Edit</button>
        <button onClick={() => onDelete(note.id)}>Delete</button>
    </li>
));

describe('NoteList Component', () => {
    it('displays a message when there are no notes', () => {
        render(<NoteList notes={[]} onEdit={() => {}} onDelete={() => {}} />);
        expect(screen.getByText(/No notes available. Create one!/i)).toBeInTheDocument();
    });

    it('renders a list of notes', () => {
        const notes = [
            { id: 1, content: 'Note 1' },
            { id: 2, content: 'Note 2' },
        ];
        
        render(<NoteList notes={notes} onEdit={() => {}} onDelete={() => {}} />);
        
        expect(screen.getByText(/Note 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Note 2/i)).toBeInTheDocument();
    });

    it('calls onEdit with correct note id when edit button is clicked', () => {
        const onEditMock = jest.fn();
        const notes = [{ id: 1, content: 'Note 1' }];
        
        render(<NoteList notes={notes} onEdit={onEditMock} onDelete={() => {}} />);
        
        fireEvent.click(screen.getByText(/Edit/i));
        
        expect(onEditMock).toHaveBeenCalledWith(1);
    });

    it('calls onDelete with correct note id when delete button is clicked', () => {
        const onDeleteMock = jest.fn();
        const notes = [{ id: 1, content: 'Note 1' }];
        
        render(<NoteList notes={notes} onEdit={() => {}} onDelete={onDeleteMock} />);
        
        fireEvent.click(screen.getByText(/Delete/i));
        
        expect(onDeleteMock).toHaveBeenCalledWith(1);
    });
});
