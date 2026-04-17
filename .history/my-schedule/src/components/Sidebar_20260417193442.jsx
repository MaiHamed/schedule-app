export default function Sidebar({ currentSemester, setShowAddCourse }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Courses</h2>
        <button className="btn-violet" onClick={() => setShowAddCourse(true)}>
          + Add Course
        </button>
      </div>

      <div className="course-list">
        {currentSemester.courses.length === 0 ? (
          <div style={{textAlign:'center', color:'#777', padding:'60px 20px'}}>
            No courses yet.<br />Click "+ Add Course"
          </div>
        ) : (
          currentSemester.courses.map(course => (
            <div key={course.id} className="course-item">
              <div 
                style={{ 
                  width: '26px', 
                  height: '26px', 
                  borderRadius: '10px', 
                  backgroundColor: course.color 
                }}
              />
              <div>
                <div style={{fontWeight:'500'}}>{course.name}</div>
                <div style={{fontSize:'0.85rem', color:'#888'}}>{course.code}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{marginTop:'auto', paddingTop:'30px', textAlign:'center', fontSize:'0.8rem', color:'#555'}}>
        Data saved locally • Drafts supported
      </div>
    </div>
  );
}