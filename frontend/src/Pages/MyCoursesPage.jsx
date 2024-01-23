import { Card } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { FetchCourse } from "../Redux/features/dataActions"
import { useState, useEffect } from "react"
const { Meta } = Card

// const courses = require("../sampleData/courseData.json")

const MyCoursesPage = () => {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.user.role);
  const courses = useSelector((state) => state.data.loggedInUser.courses);
  const coursesTemp = []

  

  return (
    <div>
      <div className='flex items-center my-4'>
        <h1 className='text-3xl font-bold'>My Courses</h1>
      </div>
      <div className='flex flex-wrap gap-4 my-4'>
        {courses.map((course, index) => (
          <Card
            hoverable
            title={course.course.courseTitle}
            key={index}
            style={{ width: 300 }}>
            <div className='flex justify-between items-start'>
              {role === "student" ? (
                <Meta
                  title={course.teacher.name}
                  description={course.course.courseCode}
                />
              ) : (
                <Meta title={course.course.courseCode} />
              )}
              <p className=' text-black opacity-70'>
                Cr. Hrs: {course.course.creditHour}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
export default MyCoursesPage