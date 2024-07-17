const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Course = ({course}) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <p><b>total of {total} exercises</b></p>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => <Part key={part.name} part={part} />)}
    </>
  )
}

const Courses = ({courses}) => {
    const renderCourse = (course) => <Course course={course} />
    return courses.map(renderCourse)
}

export default Courses