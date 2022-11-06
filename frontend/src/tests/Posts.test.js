import { Provider } from 'react-redux';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import { configureStore } from '@reduxjs/toolkit';
import postSlice from '../features/posts/postSlice';
import Posts from '../features/posts';

afterEach(cleanup);

function renderWithProviders(
    component, 
    {
        preloadedState, 
        store = configureStore({ reducer: { posts: postSlice }, preloadedState})
    } = {}) {
        return {
            ...render(<Provider store={store}>{component}</Provider>)
    }
}

const initialState = { 
    data: [{"userId": 1,"id": 1,"title": "test title","body": "test body"}, {"userId": 2,"id": 2,"title": "other title","body": "other body"}], 
    status: 'succeeded', 
    error: null
};

it("Posts render without crashing", () => {
    const renders = renderWithProviders(<Posts />, {
        preloadedState: {
            posts: initialState
        }
    });
});

it("Posts contain proper data", () => {
    const { getByTestId } = renderWithProviders(<Posts />, {
        preloadedState: {
            posts: initialState
        }
    });

    const posts = getByTestId("posts-frontpage");
    expect(posts).toHaveTextContent("test title");
    expect(posts).toHaveTextContent("test body");
});

it("Search field filters posts", async () => {
    const { getByPlaceholderText } = renderWithProviders(<Posts />, {
        preloadedState: {
            posts: initialState
        }
    });
    const post = screen.queryByText("other title");

    const search = getByPlaceholderText("Search...");
    userEvent.type(search, "test title");

    expect(post).not.toBeInTheDocument();

});


it("Edit modal renders & individual post's edit buttons populates edit fields correctly", async () => {
    const rendered = renderWithProviders(<Posts></Posts>, {
        preloadedState: {
            posts: initialState
        }
    });
    const button = screen.getAllByRole("button")[1];
    await fireEvent.click(button);

    const modal = screen.getByRole("dialog");

    expect(within(modal).getByTestId("field-entry").value).toBe('test title');
    expect(within(modal).getByTestId("field-title").value).toBe('test title');
    expect(within(modal).getByTestId("field-body").value).toBe('test body');
});

it("Entering search entry into edit modal properly populates fields", async () => {
    const rendered = renderWithProviders(<Posts></Posts>, {
        preloadedState: {
            posts: initialState
        }
    });
    const button = screen.getAllByRole("button")[0];
    await fireEvent.click(button);

    const modal = screen.getByRole("dialog");

    expect(within(modal).getByTestId("field-entry").value).not.toBe('test title');
    expect(within(modal).getByTestId("field-title").value).not.toBe('test title');
    expect(within(modal).getByTestId("field-body").value).not.toBe('test body');

    const searchInput = within(modal).getByTestId("field-entry");
    await fireEvent.change(searchInput, { target: { value: 'test title' } })

    expect(searchInput.value).toBe("test title");
    expect(within(modal).getByTestId("field-title").value).toBe('test title');
    expect(within(modal).getByTestId("field-body").value).toBe('test body');
});

it("Submitting edit form with new title or body properly changes post", async () => {
    const { getByTestId } = renderWithProviders(<Posts></Posts>, {
        preloadedState: {
            posts: initialState
        }
    });
    const button = screen.getAllByRole("button")[1];
    await fireEvent.click(button);

    const modal = screen.getByRole("dialog");

    const titleInput = within(modal).getByTestId("field-title");
    const bodyInput = within(modal).getByTestId("field-body");
    const submitButton = within(modal).getByTestId("submit-button");
    await fireEvent.change(titleInput, { target: { value: 'new title' } })
    await fireEvent.change(bodyInput, { target: { value: 'new body' } })
    await fireEvent.click(submitButton);

    const posts = getByTestId("posts-frontpage");
    expect(posts).toHaveTextContent("new title");
    expect(posts).toHaveTextContent("new body");
    expect(posts).not.toHaveTextContent("test title");
    expect(posts).not.toHaveTextContent("test body");

});

