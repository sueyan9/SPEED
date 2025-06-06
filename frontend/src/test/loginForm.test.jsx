import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';

// Mock next/router & next/image
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} alt={props.alt} />,
}));
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, ...props }) => <a {...props}>{children}</a>,
}));
describe('LoginForm Component', () => {
    it('renders inputs and button', () => {
        render(<LoginForm />);
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('updates input values on change', () => {
        render(<LoginForm />);
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('123456');
    });
});