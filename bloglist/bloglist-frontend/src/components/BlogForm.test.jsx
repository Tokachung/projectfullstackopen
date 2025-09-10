import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls event handler it received as props', async () => {

    const exampleBlog = {
        title: "React Hooks in Depth",
        author: "Dan Abramov",
        url: "https://react.dev/hooks"
    };

    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByTestId('title-input')
    const authorInput = screen.getByTestId('author-input')
    const urlInput = screen.getByTestId('url-input')

    const sendButton = screen.getByText('create')

    await user.type(titleInput, exampleBlog.title)
    await user.type(authorInput, exampleBlog.author)
    await user.type(urlInput, exampleBlog.url)
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(exampleBlog); // Comparison of the object data
})