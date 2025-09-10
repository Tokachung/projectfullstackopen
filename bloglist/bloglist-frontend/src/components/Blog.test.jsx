import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders blog", () => {
  const exampleBlog = {
    id: "1",
    title: "React Hooks in Depth",
    author: "Dan Abramov",
    url: "https://react.dev/hooks",
    likes: 42,
    user: {
      id: "123",
      name: "John Doe",
      username: "johndoe",
    },
  };

  const likeBlog = vi.fn();
  const removeBlog = vi.fn();

  render(
    <Blog blog={exampleBlog} likeBlog={likeBlog} removeBlog={removeBlog} />,
  );

  const title = screen.getByText("React Hooks in Depth", { exact: false });
  const author = screen.getByText("Dan Abramov", { exact: false });
  const likes = screen.queryByText("42", { exact: false }); // Check if likes are rendered

  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(likes).toBeNull(); // Ensure likes are NOT in the document initially
});

test("renders blog shows number of likes when button is clicked", async () => {
  const exampleBlog = {
    id: "1",
    title: "React Hooks in Depth",
    author: "Dan Abramov",
    url: "https://react.dev/hooks",
    likes: 42,
    user: {
      id: "123",
      name: "John Doe",
      username: "johndoe",
    },
  };

  const likeBlog = vi.fn();
  const removeBlog = vi.fn();

  render(
    <Blog blog={exampleBlog} likeBlog={likeBlog} removeBlog={removeBlog} />,
  );

  const button = screen.getByText("view");

  const user = userEvent.setup();
  await user.click(button);

  const likes = screen.queryByText("42", { exact: true }); // Check if likes are rendered
  const url = screen.queryByText("https://react.dev/hooks", { exact: true });

  expect(likes).toBeDefined(); // Ensure likes are NOT in the document initially
  expect(url).toBeDefined();
});

test("when button is clicked twice, event handler registers both clicks", async () => {
  const exampleBlog = {
    id: "1",
    title: "React Hooks in Depth",
    author: "Dan Abramov",
    url: "https://react.dev/hooks",
    likes: 42,
    user: {
      id: "123",
      name: "John Doe",
      username: "johndoe",
    },
  };

  const likeBlog = vi.fn();
  const removeBlog = vi.fn();

  render(
    <Blog blog={exampleBlog} likeBlog={likeBlog} removeBlog={removeBlog} />,
  );

  const viewButton = screen.getByText("view");
  const user = userEvent.setup();
  await user.click(viewButton);

  const likeButton = screen.getByText("Like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(likeBlog.mock.calls).toHaveLength(2);
});
