import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog', () => {
    const exampleBlog = {
        id: "1",
        title: "React Hooks in Depth",
        author: "Dan Abramov",
        url: "https://react.dev/hooks",
        likes: 42,
        user: {
          id: "123",
          name: "John Doe",
          username: "johndoe"
        }
    };

    const likeBlog = vi.fn()
    const removeBlog = vi.fn()

    render(<Blog blog={exampleBlog} likeBlog={likeBlog} removeBlog={removeBlog} />)

    screen.debug()

    const title = screen.getByText('React Hooks in Depth', { exact: false })
    const author = screen.getByText('Dan Abramov', { exact: false })
    const likes = screen.queryByText('42', { exact: false }) // Check if likes are rendered

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(likes).toBeNull() // Ensure likes are NOT in the document initially

})
